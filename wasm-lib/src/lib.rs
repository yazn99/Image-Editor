use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, ImageData};
use min_max::*;

use photon_rs::*;


#[wasm_bindgen]
pub fn Crop_Function(element_id: &str, start_x: u32, start_y: u32, crop_width: u32, crop_height: u32) {
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");

    let canvas = document
        .get_element_by_id(element_id)
        .expect("no canvas found");
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    let ctx = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

        let mut image = open_image(canvas.clone(), ctx.clone());
        let mut pixels: Vec<u8> = image.get_raw_pixels();
        let mut image_width= image.get_width();
        let mut image_height= image.get_height();

        
        //start custom code

        //for the real calculations
        // let mut start_x = start_x.max(0).min(image_width as i32);
        // let mut start_y = start_y.max(0).min(image_height as i32);
        // let width = crop_width.min(image_width);
        // let height = crop_height.min(image_height);
        

        if start_x as u32 + crop_width > image_width {
            start_x = (image_width - crop_width) as i32
        }
        if start_y as u32 + crop_height > image_height {
            start_y = (image_height - crop_height) as i32
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

        let mut cropped_image= PhotonImage::new(new_pixels, crop_width, crop_height);

        // let js: JsValue = cropped_image.get_height().into();
        // console::log_1(&js);

        let mut raw_pixels = cropped_image.get_raw_pixels();
        let new_img_data = ImageData::new_with_u8_clamped_array_and_sh(
        Clamped(&mut raw_pixels),
        crop_width,
        crop_height,
    );

    // Place the new imagedata onto the canvas
    ctx.clear_rect(0_f64, 0_f64, canvas.width().into(), canvas.height().into());
    //Resizing canvas befor drawing the image
    ctx.canvas().expect("REASON").set_height(crop_height);
    ctx.canvas().expect("REASON").set_width(crop_width);

    ctx.put_image_data(&new_img_data.unwrap(), 0 as f64, 0 as f64)
        .expect("Should put image data on Canvas");
        
}
