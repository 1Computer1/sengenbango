use axum::{
    error_handling::HandleErrorLayer,
    extract::{self, State},
    http::StatusCode,
    routing::post,
    BoxError, Json, Router,
};
use data::{Document, QueryWithConfig};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::net::SocketAddr;
use std::{env, time::Duration};
use tower::{buffer::BufferLayer, limit::RateLimitLayer, ServiceBuilder};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

mod data;

#[derive(Clone)]
struct ApiState {
    pool: PgPool,
    max_complexity: usize,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    let port = env::var("SGBG_PORT")
        .ok()
        .and_then(|x| str::parse(&x).ok())
        .unwrap_or(3000);

    let db_str = std::env::var("SGBG_DB").expect("database url SGBG_DB not specified");

    let rate_num = std::env::var("SGBG_RATE_NUM")
        .ok()
        .and_then(|x| str::parse(&x).ok())
        .unwrap_or(3);

    let rate_per = std::env::var("SGBG_RATE_PER")
        .ok()
        .and_then(|x| str::parse(&x).ok())
        .unwrap_or(6);

    let max_complexity = std::env::var("SGBG_COMPLEX")
        .ok()
        .and_then(|x| str::parse(&x).ok())
        .unwrap_or(10);

    let pool = PgPoolOptions::new()
        .connect(&db_str)
        .await
        .expect("could not connect to database");

    let app = Router::new()
        .route("/v1/query", post(query))
        .with_state(ApiState {
            pool,
            max_complexity,
        })
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|err: BoxError| async move {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Unhandled error: {}", err),
                    )
                }))
                .layer(BufferLayer::new(1024))
                .layer(RateLimitLayer::new(rate_num, Duration::from_secs(rate_per))),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("listening on {addr}");
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

enum QueryError {
    TooComplex,
    NotMeaningful,
}

impl QueryError {
    fn to_msg(&self) -> String {
        use QueryError::*;
        match self {
            TooComplex => "Query is too complex".to_string(),
            NotMeaningful => "Query does not have any meaningful search terms".to_string(),
        }
    }
}

async fn query(
    State(state): State<ApiState>,
    extract::Json(payload): extract::Json<QueryWithConfig>,
) -> Result<Json<Vec<Document>>, (StatusCode, String)> {
    if payload.query.complexity() > state.max_complexity {
        return Err(unprocessable_error(QueryError::TooComplex));
    }
    let numnodes = data::numnodes(&state.pool, &payload)
        .await
        .map_err(internal_error)?;
    if numnodes == 0 {
        return Err(unprocessable_error(QueryError::NotMeaningful));
    }
    data::query(&state.pool, &payload)
        .await
        .map(Json)
        .map_err(internal_error)
}

fn unprocessable_error(error: QueryError) -> (StatusCode, String) {
    (StatusCode::UNPROCESSABLE_ENTITY, error.to_msg())
}

fn internal_error(err: anyhow::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
