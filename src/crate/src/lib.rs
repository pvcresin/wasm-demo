mod utils;

use std::io::Cursor;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use zip::ZipArchive;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn initialize() {
    utils::set_panic_hook();
}

#[wasm_bindgen(js_name = getFilenameList)]
pub fn get_filename_list(buf: Vec<u8>) -> Vec<JsValue> {
    let reader = Cursor::new(buf);
    let mut zip = ZipArchive::new(reader).unwrap();
    let mut filename_list: Vec<String> = Vec::new();

    for idx in 0..zip.len() {
        let file = zip.by_index(idx).unwrap();
        let name = file.name().to_owned();
        if !name.ends_with("/") {
            filename_list.push(name);
        }
    }

    filename_list.iter().map(|x| JsValue::from_str(x)).collect()
}
