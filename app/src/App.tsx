import { useCallback, useEffect, useState } from 'react';
import { Search } from './components/Search';
import { SearchStatus } from './util/SearchStatus';
import { Result, parseQuery } from './query/parser';
import { DefaultSettings, QueryResponse, QuerySettings, queryDocuments } from './query/api';
import { SearchResult } from './components/SearchResult';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { useSearchParams } from 'react-router-dom';
import { SearchResultLoading } from './components/SearchResultLoading';
import { Transition } from '@headlessui/react';

const JAPANESE_REGEX =
	/(?!\p{Punctuation})[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]/u;

function App() {
	const [settings, setSettings] = useState<QuerySettings>(DefaultSettings);
	const [results, setResults] = useState<Result<QueryResponse, string> | null>(null);
	const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.UNSENT);
	const [searchParams, setSearchParams] = useSearchParams();
	const [queryText, setQueryText] = useState('');

	const submitQuery = useCallback(
		async (q: string) => {
			if (!q) {
				return;
			}
			const query = parseQuery(q);
			if (query.ok) {
				const isJapanese = q.search(JAPANESE_REGEX) >= 0;
				const r = await queryDocuments(query.value, isJapanese ? 'japanese' : 'english', settings);
				if (r.ok) {
					setResults(r);
				} else {
					setResults({ ok: false, error: String(r.error) });
				}
			} else {
				setResults({ ok: false, error: query.error.join('\n') });
			}
		},
		[settings],
	);

	useEffect(() => {
		const q = searchParams.get('q') ?? '';
		if (q) {
			document.title = `千言万語 - ${q}`;
			setQueryText(q);
			(async () => {
				setSearchStatus(SearchStatus.LOADING);
				await submitQuery(q);
				if (searchStatus === SearchStatus.LOADING_UNSENT) {
					setSearchStatus(SearchStatus.DONE_UNSENT);
				} else {
					setSearchStatus(SearchStatus.DONE);
				}
			})();
		}
	}, [searchParams]);

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col items-center gap-3">
				<Search
					autoFocus
					className="w-full lg:w-1/2"
					value={queryText}
					onChange={(value) => {
						setQueryText(value);
						if (searchStatus === SearchStatus.DONE) {
							setSearchStatus(SearchStatus.DONE_UNSENT);
						} else if (searchStatus === SearchStatus.LOADING) {
							setSearchStatus(SearchStatus.LOADING_UNSENT);
						}
					}}
					onSubmit={(q) => {
						setSearchParams({ q });
					}}
				/>
				<div className="flex flex-row items-center gap-4">
					<Help />
					<Settings
						value={settings}
						onChange={(t) => {
							setSettings(t);
							if (searchStatus === SearchStatus.DONE) {
								setSearchStatus(SearchStatus.DONE_UNSENT);
							} else if (searchStatus === SearchStatus.LOADING) {
								setSearchStatus(SearchStatus.LOADING_UNSENT);
							}
						}}
					/>
				</div>
				<Transition
					show={searchStatus === SearchStatus.LOADING || searchStatus === SearchStatus.LOADING_UNSENT}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					className="flex flex-col items-center gap-3 w-full lg:w-2/3"
				>
					{(searchStatus === SearchStatus.LOADING || searchStatus === SearchStatus.LOADING_UNSENT) && (
						<>
							<div className="text-gray-400 text-xs self-end">
								<div className="h-4 w-32 p-0.5 animate-pulse">
									<div className="w-full h-full rounded-sm bg-gray-300 dark:bg-gray-600"></div>
								</div>
							</div>
							<ol className="flex flex-col gap-1.5 w-full">
								{Array.from({ length: 8 }).map((_, i) => (
									<li key={i}>
										<SearchResultLoading />
									</li>
								))}
							</ol>
						</>
					)}
				</Transition>
				<Transition
					show={
						results != null && searchStatus !== SearchStatus.LOADING && searchStatus !== SearchStatus.LOADING_UNSENT
					}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					className="flex flex-col items-center gap-3 w-full lg:w-2/3"
				>
					{results != null &&
						(results.ok ? (
							results.value.total ? (
								<>
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
								</>
							) : (
								<div>No results found.</div>
							)
						) : (
							<div className="text-red-600">{results.error}</div>
						))}
				</Transition>
				<Transition
					show={results == null}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100"
				>
					<div>Type something to search!</div>
				</Transition>
			</div>
		</div>
	);
}

export default App;
