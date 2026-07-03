#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to COSMOS OS Desktop.", name)
}

#[tauri::command]
pub fn get_app_data() -> String {
    "COSMOS OS Data".to_string()
}

#[tauri::command]
pub fn save_app_data(_data: String) -> Result<(), String> {
    Ok(())
}
