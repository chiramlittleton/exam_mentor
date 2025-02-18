mod db;
mod models;
mod handlers;
mod routes;

use axum::{Router, serve};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use db::{establish_connection, setup_database};
use tokio;
use routes::create_routes;

#[tokio::main]
async fn main() {
    let pool = establish_connection().await;
    setup_database(&pool).await;

    let app = create_routes(pool) // ✅ Directly pass `PgPool`
        .layer(CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any)
        );

    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    println!("🚀 Server running at http://{}/", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    serve(listener, app).await.unwrap();
}
