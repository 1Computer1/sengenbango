import { Query } from './parser';

export interface ParallelDocument {
	source: string;
	jp: string;
	en: string;
	score: number;
}

export async function queryDocuments(query: Query, lang: 'english' | 'japanese'): Promise<ParallelDocument[]> {
	const r = await fetch('/api/v1/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			lang,
			query,
		}),
	});
	return await r.json();
}
