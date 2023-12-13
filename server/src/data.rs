use indoc::indoc;
use sqlx::{self, PgPool, Postgres, QueryBuilder};

#[derive(serde::Serialize)]
pub struct Document {
    pub source: String,
    pub jp: String,
    pub en: String,
    pub score: f64,
}

#[derive(sqlx::FromRow)]
struct QueriedRow {
    source: String,
    // name: String,
    jp: String,
    en: String,
    score: f64,
    // textsearch_index_jp_col: String,
    // textsearch_index_en_col: String,
    total: i64,
}

impl QueriedRow {
    fn into_document(self) -> Document {
        let QueriedRow {
            source,
            jp,
            en,
            score,
            ..
        } = self;
        Document {
            source,
            jp,
            en,
            score,
        }
    }
}

#[derive(serde::Deserialize)]
pub struct QueryWithConfig {
    pub queries: Queries,
    #[serde(default = "all_sources")]
    pub sources: Vec<Source>,
}

#[derive(serde::Deserialize)]
#[serde(tag = "t", content = "c", rename_all = "snake_case")]
pub enum Queries {
    Single { query: Query, lang: Language },
    Multiple { queryjp: Query, queryen: Query },
}

impl Queries {
    pub fn complexities(&self) -> Vec<usize> {
        match self {
            Queries::Single { query, .. } => vec![query.complexity()],
            Queries::Multiple { queryjp, queryen } => {
                vec![queryjp.complexity(), queryen.complexity()]
            }
        }
    }
}

#[derive(serde::Deserialize, Clone, Copy)]
#[serde(rename_all = "snake_case")]
pub enum Language {
    English,
    Japanese,
}

impl Language {
    fn to_regconfig(self) -> String {
        use Language::*;
        match self {
            English => "english_nostop".to_string(),
            Japanese => "japanese".to_string(),
        }
    }

    fn to_col(self) -> String {
        use Language::*;
        match self {
            English => "textsearch_index_en_col".to_string(),
            Japanese => "textsearch_index_jp_col".to_string(),
        }
    }
}

#[derive(serde::Deserialize, serde::Serialize, Clone, Copy)]
#[serde(rename_all = "kebab-case")]
pub enum Source {
    Basics,
    BpersonaEnJa,
    BpersonaJaEn,
    Coursera,
    Flores,
    Jparacrawl,
    Kyoto,
    Legal,
    Natcom,
    Nllb,
    Novels,
    Opensubtitles,
    Reuters,
    Tatoeba,
    Ted,
    WordnetDef,
    WordnetExe,
}

impl Source {
    fn to_source(self) -> String {
        serde_json::to_string(&self)
            .unwrap()
            .strip_prefix('"')
            .unwrap()
            .strip_suffix('"')
            .unwrap()
            .to_string()
    }
}

static ALL_SOURCES: [Source; 17] = {
    use Source::*;
    [
        Basics,
        BpersonaEnJa,
        BpersonaJaEn,
        Coursera,
        Flores,
        Jparacrawl,
        Kyoto,
        Legal,
        Natcom,
        Nllb,
        Novels,
        Opensubtitles,
        Reuters,
        Tatoeba,
        Ted,
        WordnetDef,
        WordnetExe,
    ]
};

fn all_sources() -> Vec<Source> {
    ALL_SOURCES.to_vec()
}

#[derive(serde::Deserialize)]
#[serde(tag = "t", content = "c", rename_all = "snake_case")]
pub enum Query {
    Term(String),
    Tag(String),
    Not(Box<Query>),
    And(Box<Query>, Box<Query>),
    Or(Box<Query>, Box<Query>),
    Seq(Box<Query>, Box<Query>),
}

impl Query {
    pub fn complexity(&self) -> usize {
        use Query::*;
        match self {
            Term(_) => 1,
            Tag(_) => 4,
            Not(x) => 1 + x.complexity(),
            And(x, y) => 1 + x.complexity() + y.complexity(),
            Or(x, y) => 1 + x.complexity() + y.complexity(),
            Seq(x, y) => x.complexity() + y.complexity(),
        }
    }
}

fn push_tsquery<'a>(query: &'a Query, lang: &'a Language, qb: &mut QueryBuilder<'a, Postgres>) {
    use Query::*;
    match query {
        Term(x) => {
            qb.push("phraseto_tsquery(");
            qb.push_bind(lang.to_regconfig());
            qb.push("::regconfig");
            qb.push(",");
            qb.push_bind(x);
            qb.push(")");
        }
        Tag(x) => {
            qb.push_bind(format!("＃{x}:*"));
            qb.push("::tsquery");
        }
        Not(x) => {
            qb.push("!!(");
            push_tsquery(x, lang, qb);
            qb.push(")");
        }
        And(x, y) => {
            qb.push("(");
            push_tsquery(x, lang, qb);
            qb.push(" && ");
            push_tsquery(y, lang, qb);
            qb.push(")");
        }
        Or(x, y) => {
            qb.push("(");
            push_tsquery(x, lang, qb);
            qb.push(" || ");
            push_tsquery(y, lang, qb);
            qb.push(")");
        }
        Seq(x, y) => {
            qb.push("(");
            push_tsquery(x, lang, qb);
            qb.push(" <-> ");
            push_tsquery(y, lang, qb);
            qb.push(")");
        }
    }
}

fn build_has_querytree(qwc: &QueryWithConfig) -> QueryBuilder<'_, Postgres> {
    match &qwc.queries {
        Queries::Single { query, lang } => {
            let mut qb = QueryBuilder::new("select querytree(");
            push_tsquery(query, lang, &mut qb);
            qb.push(") <> 'T'");
            qb
        }
        Queries::Multiple { queryjp, queryen } => {
            let mut qb = QueryBuilder::new("select querytree(");
            push_tsquery(queryjp, &Language::Japanese, &mut qb);
            qb.push(") <> 'T' and querytree(");
            push_tsquery(queryen, &Language::English, &mut qb);
            qb.push(") <> 'T'");
            qb
        }
    }
}

fn build_query(qwc: &QueryWithConfig) -> QueryBuilder<'_, Postgres> {
    let mut qb = QueryBuilder::new(indoc! {r#"
        with
        matching as (
            select *
            from documents
            where "#});
    match &qwc.queries {
        Queries::Single { query, lang } => {
            qb.push(lang.to_col());
            qb.push(" @@ (");
            push_tsquery(query, lang, &mut qb);
            qb.push(")\n");
        }
        Queries::Multiple { queryjp, queryen } => {
            qb.push(Language::Japanese.to_col());
            qb.push(" @@ (");
            push_tsquery(queryjp, &Language::Japanese, &mut qb);
            qb.push(")\n");
            qb.push("   and ");
            qb.push(Language::English.to_col());
            qb.push(" @@ (");
            push_tsquery(queryen, &Language::English, &mut qb);
            qb.push(")\n");
        }
    }
    qb.push("   and source = any(");
    qb.push_bind(
        qwc.sources
            .iter()
            .map(|s| s.to_source())
            .collect::<Vec<_>>(),
    );
    qb.push(")\n");
    qb.push(indoc! {r#"
            order by score desc
            limit 2000
        )
        select *, count(*) over() as total
        from (select distinct on(jp) * from matching) deduped
        order by score desc
        limit 100;"#});
    qb
}

pub async fn has_querytree(pool: &PgPool, qwc: &QueryWithConfig) -> Result<bool, anyhow::Error> {
    let mut qb: QueryBuilder<'_, Postgres> = build_has_querytree(qwc);
    let b: bool = qb.build_query_scalar().fetch_one(pool).await?;
    Ok(b)
}

pub async fn query(
    pool: &PgPool,
    qwc: &QueryWithConfig,
) -> Result<(Vec<Document>, i64), anyhow::Error> {
    let mut qb = build_query(qwc);
    let rows: Vec<QueriedRow> = qb.build_query_as().fetch_all(pool).await?;
    if rows.is_empty() {
        Ok((vec![], 0))
    } else {
        let total = if rows[0].total >= 1001 {
            1001
        } else {
            rows[0].total
        };
        Ok((rows.into_iter().map(|x| x.into_document()).collect(), total))
    }
}
