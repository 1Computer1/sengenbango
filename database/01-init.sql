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
        generated always as (to_tsvector('japanese', en)) stored;

create function query_from_json(config regconfig, obj json) returns tsquery as $$
    begin
        case obj->>'t'
            when 'Term' then
                return phraseto_tsquery(config, obj->>'c');
            when 'Tag' then
                return ('＃' || (obj->>'c') || ':*')::tsquery;
            when 'Not' then
                return !! query_from_json(config, obj->'c');
            when 'And' then
                return query_from_json(config, obj->'c'->0) && query_from_json(config, obj->'c'->1);
            when 'Or' then
                return query_from_json(config, obj->'c'->0) || query_from_json(config, obj->'c'->1);
            when 'Seq' then
                return query_from_json(config, obj->'c'->0) <-> query_from_json(config, obj->'c'->1);
        end case;
    end;
$$ language plpgsql;

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

create index textsearch_index_jp on documents using GIN (textsearch_index_jp_col);
create index textsearch_index_en on documents using GIN (textsearch_index_en_col);
create index score_index on documents (score DESC);
