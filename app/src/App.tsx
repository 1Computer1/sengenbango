import { useState } from 'react';
import { Search } from './components/Search';
import { Result, parseQuery } from './query/parser';
import { DefaultSettings, QueryResponse, QuerySettings, queryDocuments } from './query/api';
import { SearchResult } from './components/SearchResult';
import { Settings } from './components/Settings';
import { Help } from './components/Help';

function App() {
	const [settings, setSettings] = useState<QuerySettings>(DefaultSettings);
	const [results, setResults] = useState<Result<QueryResponse, string> | null>(null);
	const [isChanged, setIsChanged] = useState(false);

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col items-center gap-3">
				<Search
					autoFocus
					className="w-full lg:w-1/2"
					searchDone={results != null && !isChanged}
					onChange={() => setIsChanged(true)}
					onSubmit={async (text) => {
						if (!text) {
							return;
						}
						const q = parseQuery(text);
						if (q.ok) {
							const isJapanese =
								text.search(
									/(?!\p{Punctuation})[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]/u,
								) >= 0;
							const r = await queryDocuments(q.value, isJapanese ? 'japanese' : 'english', settings);
							if (r.ok) {
								setResults(r);
							} else {
								setResults({ ok: false, error: String(r.error) });
							}
						} else {
							setResults({ ok: false, error: q.error.join('\n') });
						}
						setIsChanged(false);
					}}
				/>
				<div className="flex flex-row items-center gap-4">
					<Help />
					<Settings
						value={settings}
						onChange={(t) => {
							setSettings(t);
							setIsChanged(true);
						}}
					/>
				</div>
				{results && results.ok ? (
					results.value.total ? (
						<div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
							<div className="text-gray-400 text-xs self-end">
								Displaying top {results.value.documents.length} of {results.value.total}{' '}
								{results.value.total === 1 ? 'result' : 'results'}
							</div>
							<ol className="flex flex-col gap-1.5 w-full">
								{results.value.documents.map((pdoc) => (
									<li key={pdoc.en + ' ' + pdoc.jp}>
										<SearchResult pdoc={pdoc} />
									</li>
								))}
							</ol>
						</div>
					) : (
						<div>No results found.</div>
					)
				) : results && !results.ok ? (
					<div className="text-red-600">{results.error}</div>
				) : (
					<div>Type something to search!</div>
				)}
			</div>
		</div>
	);
}

export default App;
