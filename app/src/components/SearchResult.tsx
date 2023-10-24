import { Button, Text } from 'react-aria-components';
import { ParallelDocument } from '../query/api';
import { FaClipboardCheck, FaRegClipboard, FaStar } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface SearchResultProps {
	pdoc: ParallelDocument;
	showEnglish: boolean;
}

export function SearchResult({ pdoc: { source, jp, en, score }, showEnglish }: SearchResultProps) {
	const [isShowingEnglish, setIsShowingEnglish] = useState(showEnglish);
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		setIsShowingEnglish(showEnglish);
	}, [showEnglish]);

	return (
		<div className="grid grid-areas-[text_copy,source_star] grid-cols-[1fr,auto] grid-rows-[1fr,auto] border border-gray-300 dark:border-gray-600 rounded-md p-2 gap-0.5">
			<div className="grid-in-[text] flex flex-col gap-0.5">
				<Text className="w-fit">{jp}</Text>
				<Text
					className={clsx(
						'text-sm w-fit rounded-md transition',
						!isShowingEnglish &&
							'text-zinc-300 bg-zinc-300 dark:text-zinc-700 dark:bg-zinc-700 cursor-pointer select-none',
						isShowingEnglish && 'cursor-text select-text',
					)}
					onClick={() => {
						setIsShowingEnglish(true);
					}}
				>
					{en}
				</Text>
			</div>
			<Button
				aria-label="Copy to Clipboard"
				className="grid-in-[copy] self-start justify-self-end relative text-gray-400 w-4 h-4"
				onPress={() => {
					window.navigator.clipboard.writeText(jp + '\n' + en);
					setIsCopied(true);
					setTimeout(() => setIsCopied(false), 1000);
				}}
			>
				<div className="absolute top-0 left-0">
					<FaRegClipboard />
				</div>
				<div
					className={clsx(
						'absolute top-0 left-0 transition-opacity ease-in-out',
						isCopied ? 'opacity-100 duration-0' : 'opacity-0 duration-300',
					)}
				>
					<FaClipboardCheck />
				</div>
			</Button>
			<div className="grid-in-[source]">
				<Text className="text-xs text-gray-400">{source}</Text>
			</div>
			<span className="grid-in-[star] place-self-end text-xs text-yellow-500">{score >= -100 && <FaStar />}</span>
		</div>
	);
}
