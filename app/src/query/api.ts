import { Query, Result } from './parser';

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
	| 'jparacrawl'
	| 'kyoto'
	| 'legal'
	| 'natcom'
	| 'novels'
	| 'reuters'
	| 'tatoeba'
	| 'wordnet-def'
	| 'wordnet-exe';

export type Settings = {
	lang: Language;
	sources: Source[];
};

export const RecommendedSources: Source[] = [
	'basics',
	'bpersona-ja-en',
	'coursera',
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
	'kyoto',
	'legal',
	'natcom',
	'novels',
	'reuters',
	'tatoeba',
	'wordnet-def',
	'wordnet-exe',
];

export const DefaultSettings: Settings = {
	lang: 'japanese',
	sources: RecommendedSources,
};

export async function queryDocuments(query: Query, settings: Settings): Promise<Result<ParallelDocument[], string>> {
	const r = await fetch(import.meta.env.VITE_API_URL + '/v1/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			sources: settings.sources,
			lang: settings.lang,
		}),
	});
	if (r.ok) {
		return { ok: true, value: await r.json() };
	}
	return { ok: false, error: await r.text() };
}
