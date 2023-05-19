use min_max::*;
use photon_rs::transform::SamplingFilter;
use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use wasm_bindgen::JsCast;
use web_sys::console;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, ImageData};

use photon_rs::*;

use super::ImageObj;

//creating image object from canvas
impl ImageObj {
    //scalling function
    pub fn flip(&mut self, flipType: &str) {
        let mut image = self.v_image.clone();
        if flipType == "H" {
            transform::fliph(&mut image);
        } else if flipType == "V" {
            transform::flipv(&mut image);
        }

        self.v_image = image;
        self.DrawImage();
    }
    //resizing function
    pub fn resize(&mut self, width: u32, height: u32) {
        //let mut image= self.v_image.clone();
        let image = transform::resize(&self.image.clone(), width, height, SamplingFilter::Nearest);

        let canvas = &self.canvas;

        let ctx = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();
        let mut pixels: Vec<u8> = image.get_raw_pixels();

        let new_img_data =
            ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut pixels), width, height);

        //Resizing canvas befor drawing the image
        self.ctx.clear_rect(
            0_f64,
            0_f64,
            self.canvas.width().into(),
            self.canvas.height().into(),
        );

        self.ctx.canvas().expect("REASON").set_height(height);
        self.ctx.canvas().expect("REASON").set_width(width);

        // Place the new imagedata onto the canvas
        self.ctx
            .put_image_data(&new_img_data.unwrap(), 0 as f64, 0 as f64)
            .expect("Should put image data on Canvas");

        self.width = image.get_width();
        self.height = image.get_height();
        self.v_image = image.clone();
        self.image = image;
    }
    pub fn rotate(&mut self, clockwise: bool) {
        // rotate 90
        let image = &self.image;
        let pixels: Vec<u8> = image.get_raw_pixels();
        let (w, h) = (self.width as usize, self.height as usize);

        let mut new_pixels = vec![0_u8; (w * h * 4) as usize];
        let mut new_x;
        let mut new_y;
        let mut new_idx: usize;
        let mut current_idx: usize;

        for row in 0..h {
            for col in 0..w {
                new_x = if clockwise { h - 1 - row } else { row };
                new_y = if clockwise { col } else { w - 1 - col };
                new_idx = new_y * h + new_x; // new image's height is original image's width
                current_idx = row * w + col;

                new_pixels[new_idx * 4 + 0] = pixels[current_idx * 4 + 0];
                new_pixels[new_idx * 4 + 1] = pixels[current_idx * 4 + 1];
                new_pixels[new_idx * 4 + 2] = pixels[current_idx * 4 + 2];
                new_pixels[new_idx * 4 + 3] = pixels[current_idx * 4 + 3];
            }
        }
        self.width = h as u32;
        self.height = w as u32;

        let new_img_data = ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(&mut new_pixels),
            h as u32,
            w as u32,
        );

        //Resizing canvas befor drawing the image
        self.ctx.clear_rect(
            0_f64,
            0_f64,
            self.canvas.width().into(),
            self.canvas.height().into(),
        );

        self.ctx.canvas().expect("REASON").set_height(w as u32);
        self.ctx.canvas().expect("REASON").set_width(h as u32);

        // Place the new imagedata onto the canvas
        self.ctx
            .put_image_data(&new_img_data.unwrap(), 0 as f64, 0 as f64)
            .expect("Should put image data on Canvas");

        self.updateImage()
    }

    //cropping function
    pub fn crop(&mut self, start_x: u32, start_y: u32, crop_width: u32, crop_height: u32) {
        let image = &self.image;
        let pixels: Vec<u8> = image.get_raw_pixels();
        let image_width = self.width;
        let image_height = self.height;

        let mut start_x = start_x.max(0).min(image_width as u32);
        let mut start_y = start_y.max(0).min(image_height as u32);
        let crop_width = crop_width.min(image_width);
        let crop_height = crop_height.min(image_height);

        if start_x as u32 + crop_width > image_width {
            start_x = image_width - crop_width;
        }
        if start_y as u32 + crop_height > image_height {
            start_y = image_height - crop_height;
        }

        let mut new_pixels = vec![0_u8; (crop_width * crop_height * 4) as usize];
        let mut old_x;
        let mut old_y;
        let mut old_idx: usize;
        let mut current_idx: usize;
        for row in 0..crop_height {
            for col in 0..crop_width {
                old_x = start_x as u32 + col; // x/y position in original pixels vector
                old_y = start_y as u32 + row;
                old_idx = (old_y * image_width + old_x) as usize;
                current_idx = (row * crop_width + col) as usize;
                new_pixels[current_idx * 4 + 0] = pixels[old_idx * 4 + 0];
                new_pixels[current_idx * 4 + 1] = pixels[old_idx * 4 + 1];
                new_pixels[current_idx * 4 + 2] = pixels[old_idx * 4 + 2];
                new_pixels[current_idx * 4 + 3] = pixels[old_idx * 4 + 3];
            }
        }

        //let cropped_image= PhotonImage::new(new_pixels, crop_width, crop_height);

        // let js: JsValue = cropped_image.get_height().into();
        // console::log_1(&js);

        let new_img_data = ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(&mut new_pixels),
            crop_width,
            crop_height,
        );

        //Resizing canvas befor drawing the image
        self.ctx.clear_rect(
            0_f64,
            0_f64,
            self.canvas.width().into(),
            self.canvas.height().into(),
        );

        self.ctx.canvas().expect("REASON").set_height(crop_height);
        self.ctx.canvas().expect("REASON").set_width(crop_width);

        // Place the new imagedata onto the canvas
        self.ctx
            .put_image_data(&new_img_data.unwrap(), 0 as f64, 0 as f64)
            .expect("Should put image data on Canvas");

        self.updateImage()

        //  let js: JsValue = self.canvas.height().into();
        //  console::log_1(&js);
    }
}
