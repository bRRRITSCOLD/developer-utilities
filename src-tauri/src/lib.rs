mod migrations;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
          tauri_plugin_sql::Builder::new()
            .add_migrations("sqlite:developer-utilities.stronghold.db", migrations::stronghold::get_migrations())
            .build()
        )
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
        .invoke_handler(tauri::generate_handler![
          commands::stronghold::plugin_init
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
