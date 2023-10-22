import { Button, Text } from 'react-aria-components';
import { ParallelDocument } from '../query/api';
import { FaStar } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface SearchResultProps {
	pdoc: ParallelDocument;
	showEnglish: boolean;
}

export function SearchResult({ pdoc: { source, jp, en, score }, showEnglish }: SearchResultProps) {
	const [isShowingEnglish, setIsShowingEnglish] = useState(showEnglish);

	useEffect(() => {
		setIsShowingEnglish(showEnglish);
	}, [showEnglish]);

	return (
		<div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-md p-2 gap-0.5">
			<Text>{jp}</Text>
			<Button
				className={clsx(
					'text-sm w-fit rounded-md transition select-text cursor-text',
					!isShowingEnglish && 'text-black bg-black dark:text-zinc-700 dark:bg-zinc-700 cursor-pointer',
				)}
				isDisabled={isShowingEnglish}
				onPress={() => {
					setIsShowingEnglish(true);
				}}
			>
				<Text>{en}</Text>
			</Button>
			<div className="flex flex-row justify-between items-end">
				<Text className="text-xs text-gray-400">{source}</Text>
				{score >= -100 && (
					<span className="text-xs text-yellow-500">
						<FaStar />
					</span>
				)}
			</div>
		</div>
	);
}
