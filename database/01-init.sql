-- create extension rum;

create table documents (
    source text not null,
    name text not null,
    score float not null,
    jp text not null,
    en text not null
);

alter table documents
    add column textsearch_index_jp_col tsvector
        generated always as (to_tsvector('japanese_with_types', jp)) stored,
    add column textsearch_index_en_col tsvector
        generated always as (to_tsvector('english_nostop', en)) stored;

-- large good sources

copy documents (source, name, score, jp, en) from '/data/tatoeba.csv' csv delimiter ',';
-- copy documents (source, name, score, jp, en) from '/data/kyoto.csv' csv delimiter ',';

-- large other sources

-- copy documents (source, name, score, jp, en) from '/data/jparacrawl.csv' csv delimiter ',';
-- copy documents (source, name, score, jp, en) from '/data/legal.csv' csv delimiter ',';

-- good sources

copy documents (source, name, score, jp, en) from '/data/coursera.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/reuters.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/novels.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/basics.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/bpersona_ja_en.csv' csv delimiter ',';

-- other sources

copy documents (source, name, score, jp, en) from '/data/wordnet_exe.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/wordnet_def.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/bpersona_en_ja.csv' csv delimiter ',';
copy documents (source, name, score, jp, en) from '/data/natcom.csv' csv delimiter ',';

-- create index textsearch_index_jp on documents using rum (textsearch_index_jp_col rum_tsvector_addon_ops, score)
--     with (attach = 'score', to = 'textsearch_index_jp_col');

-- create index textsearch_index_en on documents using rum (textsearch_index_en_col rum_tsvector_addon_ops, score)
--     with (attach = 'score', to = 'textsearch_index_en_col');

create index textsearch_index_jp on documents using gin (textsearch_index_jp_col);

create index textsearch_index_en on documents using gin (textsearch_index_en_col);

create index score_index on documents using btree (score desc);
