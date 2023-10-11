import { useState } from 'react';
import { Search } from './components/Search';
import { Result, parseQuery } from './query/parser';
import { DefaultSettings, ParallelDocument, Settings, queryDocuments } from './query/api';
import { SearchResult } from './components/SearchResult';
import { SearchSettings } from './components/SearchSettings';
import { produce } from 'immer';
import { LanguageSwitch } from './components/LanguageSwitch';

function App() {
	const [settings, setSettings] = useState<Settings>(DefaultSettings);
	const [results, setResults] = useState<Result<ParallelDocument[], string> | null>(null);
	const [isChanged, setIsChanged] = useState(false);

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col items-center gap-3">
				<Search
					className="w-full lg:w-1/2"
					searchDone={results != null && !isChanged}
					onChange={() => setIsChanged(true)}
					onSubmit={async (text) => {
						if (!text) {
							return;
						}
						const q = parseQuery(text);
						if (q.ok) {
							const r = await queryDocuments(q.value, settings);
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
					<SearchSettings
						value={settings}
						onChange={(t) => {
							setSettings(t);
							setIsChanged(true);
						}}
					/>
					<LanguageSwitch
						value={settings.lang}
						onChange={(lang) => {
							setSettings(
								produce((d) => {
									d.lang = lang;
								}),
							);
							setIsChanged(true);
						}}
					/>
				</div>
				{results && results.ok ? (
					results.value.length ? (
						<ol className="flex flex-col gap-1.5 w-full lg:w-2/3">
							{results.value.map((pdoc) => (
								<li key={pdoc.en + ' ' + pdoc.jp}>
									<SearchResult pdoc={pdoc} />
								</li>
							))}
						</ol>
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
