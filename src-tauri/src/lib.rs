use std::fs;

use log::{error, info};
use tauri::{AppHandle, Error, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    log::error!("something bad happened!");
    log::info!("Tauri is awesome!");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn init_stronghold_plugin(salt: &str, app_handle: AppHandle) -> Result<(), String> {
    let app_local_data_dir_path = match app_handle.path().app_local_data_dir() {
        Ok(path_buf) => path_buf,
        Err(err) => return Err(err.to_string()),
    };

    let salt_path = app_local_data_dir_path.join("salt.txt");

    info!("{:?}", salt_path.to_str());

    match fs::write(&salt_path, salt) {
        Ok(_) => (),
        Err(err) => return Err(err.to_string()),
    };

    if !salt_path.exists() {
        return Err("Salt path does not exist".into());
    }

    let _ = match app_handle
        .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())
    {
        Ok(()) => println!("input: {}", salt),
        Err(err) => return Err(err.to_string()),
    };

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .clear_targets()
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                        file_name: None,
                    }),
                    #[cfg(dev)]
                    {
                        tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Webview)
                    },
                    #[cfg(dev)]
                    {
                        tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout)
                    },
                ])
                .max_file_size(50_000 /* bytes */)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, init_stronghold_plugin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
