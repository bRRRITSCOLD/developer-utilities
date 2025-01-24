use std::fs;

use log::{error, info};
use tauri::{AppHandle, Error, Manager};

#[tauri::command]
pub fn stronghold_plugin_init(app_handle: AppHandle) -> Result<(), String> {
    let app_local_data_dir_path = match app_handle.path().app_local_data_dir() {
        Ok(path_buf) => path_buf,
        Err(err) => return Err(err.to_string()),
    };

    let salt_path = app_local_data_dir_path.join("salt.txt");

    if !salt_path.exists() {
        return Err("Salt path does not exist".into());
    }

    let _ = match app_handle
        .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())
    {
        Ok(()) => (),
        Err(err) => return Err(err.to_string()),
    };

    Ok(())
}
