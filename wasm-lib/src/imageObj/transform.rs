use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, ImageData};
use min_max::*;

use photon_rs::*;

use super::ImageObj;


//creating image object from canvas
impl ImageObj {
    //scalling function
    pub fn flipH(&mut self, flipType: &str){
        let mut image= self.v_image.clone();
        if flipType== "H" {
            transform::fliph(&mut image);
        } 
        else if flipType== "V" {
            transform::flipv(&mut image);
        }
        
        self.v_image= image;
        self.DrawImage();
        
    }
    //resizing function
    pub fn resize(&self, start_x: u32, start_y: u32, crop_width: u32, crop_height: u32){

    }
    //cropping function
    pub fn crop(&mut self, start_x: u32, start_y: u32, crop_width: u32, crop_height: u32){

        let image = &self.image;
        let pixels:  Vec<u8> = image.get_raw_pixels();
        let image_width= self.width;
        let image_height= self.height;

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

        let mut new_pixels = vec![0_u8; (crop_width * crop_height * 4 ) as usize];
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
    self.ctx.clear_rect(0_f64, 0_f64, self.canvas.width().into(), self.canvas.height().into());
    
    self.ctx.canvas().expect("REASON").set_height(crop_height);
    self.ctx.canvas().expect("REASON").set_width(crop_width);

    // Place the new imagedata onto the canvas
    self.ctx.put_image_data(&new_img_data.unwrap(), 0 as f64, 0 as f64)
        .expect("Should put image data on Canvas");

    self.updateImage()

    //  let js: JsValue = self.canvas.height().into();
    //  console::log_1(&js);

    }

}
