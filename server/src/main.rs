use axum::{
    error_handling::HandleErrorLayer,
    extract::{self, State},
    http::{Method, StatusCode},
    routing::post,
    BoxError, Json, Router,
};
use data::{Document, QueryWithConfig};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::net::SocketAddr;
use std::{env, time::Duration};

use tower::{buffer::BufferLayer, limit::RateLimitLayer, ServiceBuilder};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

mod data;

#[derive(Clone)]
struct ApiState {
    pool: PgPool,
    max_complexity: usize,
    max_query_time: Duration,
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

    let max_query_time = std::env::var("SGBG_QUERY_TIME")
        .ok()
        .and_then(|x| str::parse(&x).ok())
        .map(Duration::from_secs)
        .unwrap_or(Duration::from_secs(10));

    let pool = PgPoolOptions::new()
        .connect(&db_str)
        .await
        .expect("could not connect to database");

    let app = Router::new()
        .route("/v1/query", post(query))
        .with_state(ApiState {
            pool,
            max_complexity,
            max_query_time,
        })
        .layer(
            CorsLayer::new()
                .allow_methods(vec![Method::GET, Method::POST, Method::OPTIONS])
                .allow_origin(Any)
                .allow_headers(Any)
                .allow_credentials(false),
        )
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

#[derive(serde::Serialize, Clone, Copy)]
#[serde(rename_all = "snake_case")]
enum QueryError {
    Complex,
    NotMeaningful,
    TookTooLong,
    Internal,
}

#[derive(serde::Serialize)]
struct QueryResponse {
    total: i64,
    documents: Vec<Document>,
}

#[derive(serde::Serialize)]
struct QueryErrorResponse {
    error: QueryError,
    #[serde(skip_serializing_if = "Option::is_none")]
    msg: Option<String>,
}

async fn query(
    State(state): State<ApiState>,
    extract::Json(payload): extract::Json<QueryWithConfig>,
) -> Result<Json<QueryResponse>, (StatusCode, Json<QueryErrorResponse>)> {
    if payload.query.complexity() > state.max_complexity {
        return Err(unprocessable_error(QueryError::Complex));
    }
    let has_querytree = data::has_querytree(&state.pool, &payload)
        .await
        .map_err(internal_error)?;
    if !has_querytree {
        return Err(unprocessable_error(QueryError::NotMeaningful));
    }
    match tokio::time::timeout(state.max_query_time, data::query(&state.pool, &payload)).await {
        Err(_) => Err(unprocessable_error(QueryError::TookTooLong)),
        Ok(x) => x
            .map(|x| {
                Json(QueryResponse {
                    total: x.1,
                    documents: x.0,
                })
            })
            .map_err(internal_error),
    }
}

fn unprocessable_error(error: QueryError) -> (StatusCode, Json<QueryErrorResponse>) {
    (
        StatusCode::UNPROCESSABLE_ENTITY,
        Json(QueryErrorResponse { error, msg: None }),
    )
}

fn internal_error(err: anyhow::Error) -> (StatusCode, Json<QueryErrorResponse>) {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(QueryErrorResponse {
            error: QueryError::Internal,
            msg: Some(err.to_string()),
        }),
    )
}
