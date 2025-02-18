mod db;
use axum::{routing::get, Router, serve};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use db::{establish_connection, setup_database};
use tokio;

#[tokio::main]
async fn main() {
    let pool = establish_connection().await;
    setup_database(&pool).await;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new().layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    println!("🚀 Server running at http://{}/", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    serve(listener, app).await.unwrap();
}
