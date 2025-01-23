use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> { 
  return vec![
      // Define your migrations here
      Migration {
          version: 1,
          description: "create_stronghold_vaults_table",
          sql: "CREATE TABLE IF NOT EXISTS vault (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);",
          kind: MigrationKind::Up,
      },
  ];
}