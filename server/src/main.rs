use axum::{
    extract::{self, State},
    http::StatusCode,
    routing::post,
    Json, Router,
};
use data::{Document, Query};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod data;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_tokio_postgres=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let port = env::var("SGBG_PORT")
        .ok()
        .and_then(|x| str::parse(&x).ok())
        .unwrap_or(3000);

    let db_str = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://postgres:aikotoba@db:5432".to_string());

    let pool = PgPoolOptions::new()
        .connect(&db_str)
        .await
        .expect("could not connect to database");

    let app = Router::new()
        .route("/v1/query", post(query))
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("listening on {addr}");
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn query(
    State(pool): State<PgPool>,
    extract::Json(payload): extract::Json<Query>,
) -> Result<Json<Vec<Document>>, (StatusCode, String)> {
    data::query(&pool, &payload)
        .await
        .map(Json)
        .map_err(internal_error)
}

fn internal_error(err: anyhow::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
