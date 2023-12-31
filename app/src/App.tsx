import { useCallback, useEffect, useState } from 'react';
import { Search } from './components/Search';
import { SearchStatus, isInvalidated, isLoading, transitionDone, transitionUnsent } from './util/SearchStatus';
import { Result, formatError, parseQuery } from './query/parser';
import { DefaultQuerySettings, QueryResponse, queryDocuments } from './query/api';
import { SearchResult } from './components/SearchResult';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { useSearchParams } from 'react-router-dom';
import { SearchResultLoading } from './components/SearchResultLoading';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { DefaultSearchSettings } from './util/SearchSettings';
import { useJSONLocalStorage } from './hooks/useLocalStorage';

function App() {
	const [querySettings, setQuerySettings] = useJSONLocalStorage('querySettings', DefaultQuerySettings);
	const [searchSettings, setSearchSettings] = useJSONLocalStorage('searchSettings', DefaultSearchSettings);
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
				const res = await queryDocuments(query.value, querySettings);
				if (res.ok) {
					setResults(res);
				} else {
					const error = {
						complex: 'Query is too complex, consider using less part-of-speech tags or operators.',
						not_meaningful: 'Query does not contain meaningful text to search with.',
						took_too_long: 'Query took too long to process, consider more specific terms or part-of-speech tags.',
						internal: `Internal server error: ${res.error.msg}`,
					}[res.error.error];
					setResults({ ok: false, error });
				}
			} else {
				setResults({ ok: false, error: formatError(query.error).join('\n') });
			}
		},
		[querySettings],
	);

	useEffect(() => {
		let q = searchParams.get('q') ?? '';
		q = q.trim();
		if (q && q !== queryText) {
			document.title = `千言万語 - ${q}`;
			setQueryText(q);
			(async () => {
				setSearchStatus(SearchStatus.LOADING);
				await submitQuery(q);
				setSearchStatus((s) => transitionDone(s));
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
						setSearchStatus(transitionUnsent(searchStatus));
					}}
					onSubmit={async (q) => {
						q = q.trim();
						if (q) {
							document.title = `千言万語 - ${q}`;
							setQueryText(q);
							setSearchParams({ q });
							setSearchStatus(SearchStatus.LOADING);
							await submitQuery(q);
							setSearchStatus(transitionDone(searchStatus));
						}
					}}
				/>
				<div className="flex flex-row items-center gap-4">
					<Help />
					<Settings
						querySettings={querySettings}
						onQuerySettingsChange={(t) => {
							setQuerySettings(t);
							setSearchStatus(transitionUnsent(searchStatus));
						}}
						searchSettings={searchSettings}
						onSearchSettingsChange={(t) => {
							setSearchSettings(t);
						}}
					/>
				</div>
				<Transition
					show={isLoading(searchStatus)}
					enter="transition-opacity duration-100"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-[10ms]"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className="flex flex-col items-center gap-3 w-full lg:w-2/3"
				>
					{isLoading(searchStatus) && (
						<>
							<div className="text-gray-400 text-xs self-end">
								<div className="h-4 w-32 p-0.5 animate-pulse">
									<div className="w-full h-full rounded-md bg-gray-300 dark:bg-gray-600"></div>
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
					show={results != null && !isLoading(searchStatus)}
					enter="transition-opacity duration-[10ms]"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-[10ms]"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className="w-full lg:w-2/3"
				>
					{results != null && (
						<div className={clsx('flex flex-col items-center gap-3', isInvalidated(searchStatus) && 'opacity-60')}>
							{results.ok ? (
								results.value.total ? (
									<>
										<div className="text-gray-400 text-xs self-end">
											Displaying {results.value.documents.length} of{' '}
											{results.value.total >= 1001 ? '>1000' : results.value.total}{' '}
											{results.value.total === 1 ? 'result' : 'results'}
										</div>
										<ol className="flex flex-col gap-1.5 w-full">
											{results.value.documents.map((pdoc) => (
												<li key={pdoc.en + ' ' + pdoc.jp}>
													<SearchResult pdoc={pdoc} showEnglish={searchSettings.showEnglish} />
												</li>
											))}
										</ol>
									</>
								) : (
									<div className="text-center">
										No results found.
										<br />
										Consider adding more sources in Settings &gt; Document Sources or changing your query.
									</div>
								)
							) : (
								<div className="text-red-600">{results.error}</div>
							)}
						</div>
					)}
				</Transition>
				<Transition
					show={searchStatus === SearchStatus.UNSENT && results == null}
					leave="transition-opacity duration-[10ms]"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div>Type Japanese or English text to search!</div>
				</Transition>
			</div>
		</div>
	);
}

export default App;
