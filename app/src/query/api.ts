import { Query, Result } from './parser';

export interface QueryResponse {
	total: number;
	documents: ParallelDocument[];
}

export interface QueryErrorResponse {
	error: QueryError;
	msg?: string;
}

export type QueryError = 'complex' | 'not_meaningful' | 'took_too_long' | 'internal';

export interface ParallelDocument {
	source: string;
	jp: string;
	en: string;
	score: number;
}

export type Language = 'english' | 'japanese';

export type Source =
	| 'basics'
	| 'bpersona-en-ja'
	| 'bpersona-ja-en'
	| 'coursera'
	| 'flores'
	| 'jparacrawl'
	| 'kyoto'
	| 'legal'
	| 'natcom'
	| 'nllb'
	| 'novels'
	| 'reuters'
	| 'tatoeba'
	| 'wordnet-def'
	| 'wordnet-exe';

export type QuerySettings = {
	sources: Source[];
};

export const RecommendedSources: Source[] = [
	'basics',
	'bpersona-en-ja',
	'bpersona-ja-en',
	'coursera',
	'flores',
	'kyoto',
	'novels',
	'reuters',
	'tatoeba',
	'wordnet-exe',
];

export const AllSources: Source[] = [
	'basics',
	'bpersona-en-ja',
	'bpersona-ja-en',
	'coursera',
	'jparacrawl',
	'flores',
	'kyoto',
	'legal',
	'natcom',
	'nllb',
	'novels',
	'reuters',
	'tatoeba',
	'wordnet-def',
	'wordnet-exe',
];

export const DefaultQuerySettings: QuerySettings = {
	sources: RecommendedSources,
};

export async function queryDocuments(
	query: Query,
	lang: Language,
	settings: QuerySettings,
): Promise<Result<QueryResponse, QueryErrorResponse>> {
	const r = await fetch(import.meta.env.VITE_API_URL + '/v1/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			lang,
			sources: settings.sources,
		}),
	});
	if (r.ok) {
		return { ok: true, value: await r.json() };
	}
	return { ok: false, error: await r.json() };
}
