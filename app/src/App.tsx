import { useState } from 'react';
import { Search } from './components/Search';
import { parseQuery } from './query/parser';
import { DefaultSettings, ParallelDocument, Settings, queryDocuments } from './query/api';
import { SearchResult } from './components/SearchResult';
import { SearchSettings } from './components/SearchSettings';
import { produce } from 'immer';
import { LanguageSwitch } from './components/LanguageSwitch';

function App() {
	const [settings, setSettings] = useState<Settings>(DefaultSettings);
	const [results, setResults] = useState<ParallelDocument[] | null>(null);
	const [errors, setErrors] = useState<string | null>(null);

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col items-center gap-3">
				<Search
					className="w-full lg:w-1/2"
					onSubmit={async (text) => {
						const q = parseQuery(text);
						if (q.ok) {
							const r = await queryDocuments(q.value, settings);
							if (r.ok) {
								setResults(r.value);
								setErrors(null);
							} else {
								setResults(null);
								setErrors(String(r.error));
							}
						} else {
							setResults(null);
							setErrors(q.error.join('\n'));
						}
					}}
				/>
				<div className="flex flex-row items-center gap-4">
					<SearchSettings value={settings} onChange={setSettings} />
					<LanguageSwitch
						value={settings.lang}
						onChange={(lang) =>
							setSettings(
								produce((d) => {
									d.lang = lang;
								}),
							)
						}
					/>
				</div>
				{results && results.length ? (
					<ol className="flex flex-col gap-1.5 w-2/3">
						{results.map((pdoc) => (
							<li key={pdoc.en + ' ' + pdoc.jp}>
								<SearchResult pdoc={pdoc} />
							</li>
						))}
					</ol>
				) : errors ? (
					<div className="text-red-600">{errors}</div>
				) : (
					<div>No results found.</div>
				)}
			</div>
		</div>
	);
}

export default App;
