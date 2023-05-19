extern crate wasm_bindgen;

use std::default::Default;
use std::fs::*;
use std::ops::Add;
use std::ops::Mul;

mod transform;

use imagesize::*;
use min_max::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use wasm_bindgen::JsCast;
use web_sys::console;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, ImageData};

use photon_rs::*;

pub struct ImageObj {
    canvas: HtmlCanvasElement,
    ctx: CanvasRenderingContext2d,
    image: PhotonImage,
    v_image: PhotonImage,
    width: u32,
    height: u32,
}

//creating image object from canvas
impl ImageObj {
    fn new(element_id: &str) -> ImageObj {
        let window = web_sys::window().expect("no global `window` exists");
        let document = window.document().expect("should have a document on window");

        //getting both canvases data
        //main Canvas
        let main_canvas = document
            .get_element_by_id(element_id)
            .expect("no canvas found");

        let main_canvas: web_sys::HtmlCanvasElement = main_canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();

        let main_ctx = main_canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        //hidden canvas
        let hidden_canvas = document
            .get_element_by_id("hidden_canvas")
            .expect("no canvas found");

        let hidden_canvas: web_sys::HtmlCanvasElement = hidden_canvas
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();

        let hidden_ctx = hidden_canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        //open the Full Size PhotonImage
        let mut full_photon_image = open_image(hidden_canvas.clone(), hidden_ctx.clone());

        //getting image attr
        let mut full_photon_pixels: Vec<u8> = full_photon_image.get_raw_pixels();
        let full_image_width = full_photon_image.get_width() as f64;
        let full_image_height = full_photon_image.get_height() as f64;

        //set the canvas size same as the image size
        let canvas_width = full_image_width;
        let canvas_height = full_image_height;

        //calculating centering shift values
        // let center_shift_x = (canvas_width - full_image_width * resizing_ratio) / 2.00;
        // let center_shift_y = (canvas_height - full_image_height * resizing_ratio) / 2.00;

        //resizing image
        // let mut image = photon_rs::transform::resize(
        //     &full_photon_image,
        //     canvas_width as u32,
        //     canvas_height as u32,
        //     photon_rs::transform::SamplingFilter::Gaussian,
        // );
        //let mut pixels: Vec<u8> = image.get_raw_pixels();

        //getting the resized ImageData
        let mut resized_image_data = full_photon_image.get_image_data();

        //Resizing canvas befor drawing the image
        main_canvas.set_height(canvas_height as u32);
        main_canvas.set_width(canvas_width as u32);

        main_ctx
            .put_image_data(&resized_image_data, 0 as f64, 0 as f64)
            .expect("Should put image data on Canvas");

        ImageObj {
            v_image: full_photon_image.clone(),
            image: full_photon_image,
            canvas: main_canvas,
            ctx: main_ctx,
            width: canvas_width as u32,
            height: canvas_height as u32,
        }
    }
    fn updateImage(&mut self) {
        let canvas = &self.canvas;

        let ctx = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        let image = open_image(canvas.clone(), ctx.clone());

        self.v_image = image.clone();
        self.image = image;
        self.width = canvas.width();
        self.height = canvas.height();
    }
    fn GetSize(&mut self) -> f64 {
        let size = (self.image.get_height() * self.image.get_width() * 3 / 8) as f64;
        return size as f64;
    }
    fn ApplyChanges(&mut self) {
        self.image = self.v_image.clone();
    }
    fn DiscardChanges(&mut self) {
        self.v_image = self.image.clone();

        self.DrawImage();
    }
    fn DrawImage(&mut self) {
        let mut image_data = self.v_image.get_image_data();

        let canvas_width = self.width;
        let canvas_height = self.height;

        //Resizing canvas befor drawing the image
        self.canvas.set_height(canvas_height as u32);
        self.canvas.set_width(canvas_width as u32);

        self.ctx
            .put_image_data(&image_data, 0 as f64, 0 as f64)
            .expect("Should put image data on Canvas");
    }
}
#[wasm_bindgen]
pub struct Canvas {
    canvas: ImageObj,
}
#[wasm_bindgen]
impl Canvas {
    #[wasm_bindgen(constructor)]
    pub fn new(element_id: &str) -> Canvas {
        let canvasObj = ImageObj::new(element_id);

        Canvas { canvas: canvasObj }
    }
    pub fn crop_function(&mut self, start_x: u32, start_y: u32, crop_width: u32, crop_height: u32) {
        self.canvas.crop(start_x, start_y, crop_width, crop_height);
    }
    pub fn flip_function(&mut self, flip_type: &str) {
        self.canvas.flip(flip_type);
    }
    pub fn rotate_function(&mut self, clockwise: bool) {
        self.canvas.rotate(clockwise);
    }
    pub fn discard_changes(&mut self) {
        self.canvas.DiscardChanges();
    }
    pub fn apply_changes(&mut self) {
        self.canvas.ApplyChanges();
    }
    pub fn resize_function(&mut self, width: u32, height: u32, sampling_filter: &str) {
        self.canvas.resize(width, height);
    }
    pub fn get_size(&mut self) -> f64 {
        return self.canvas.GetSize();
    }
}
