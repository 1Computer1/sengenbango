use sqlx::{self, PgPool};

#[derive(sqlx::FromRow, serde::Serialize, Debug)]
pub struct Document {
    pub source: String,
    pub jp: String,
    pub en: String,
    pub score: f64,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(tag = "t", content = "c")]
pub enum Query {
    Term(String),
    Tag(String),
    Not(Box<Query>),
    And(Box<Query>, Box<Query>),
    Or(Box<Query>, Box<Query>),
    Seq(Box<Query>, Box<Query>),
}

pub async fn query(pool: &PgPool, query: &Query) -> Result<Vec<Document>, anyhow::Error> {
    let documents = sqlx::query_as(
        r#"
        WITH
        query AS (
            SELECT query_from_json(
                'japanese',
                $1::json
            ) q
        ),
        matching AS (
            SELECT *
            FROM documents, query
            WHERE textsearch_index_jp_col @@ query.q
        ),
        limited AS (
            SELECT source, jp, en, score
            FROM matching
            ORDER BY score DESC
            LIMIT 200
        )
        SELECT *
        FROM (SELECT DISTINCT ON(jp) * FROM limited) deduped
        ORDER BY score DESC
        LIMIT 100;
        "#,
    )
    .bind(serde_json::to_string(&query)?)
    .fetch_all(pool)
    .await?;
    Ok(documents)
}
