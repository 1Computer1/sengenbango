import { useState } from 'react';
import { Search } from './components/Search';
import { parseQuery } from './query/parser';
import { ParallelDocument, queryDocuments } from './query/api';
import { SearchResult } from './components/SearchResult';
// import sample from './query/sample.json';

function App() {
	const [results, setResults] = useState<ParallelDocument[] | null>(null);

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col items-center gap-3">
				<Search
					className="w-1/2"
					onSubmit={async (text) => {
						// const r = sample;
						const q = parseQuery(text);
						const r = await queryDocuments(q);
						setResults(r);
					}}
				/>
				{results && results.length && (
					<ol className="flex flex-col gap-1.5 w-2/3">
						{results.map((pdoc) => (
							<SearchResult pdoc={pdoc} />
						))}
					</ol>
				)}
			</div>
		</div>
	);
}

export default App;
