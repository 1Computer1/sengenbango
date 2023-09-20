import { Query } from './parser';

export interface ParallelDocument {
	source: string;
	jp: string;
	en: string;
	score: number;
}

export function queryDocuments(query: Query): Promise<ParallelDocument[]> {
	return fetch('/api/v1/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(query),
	}).then((r) => r.json());
}
