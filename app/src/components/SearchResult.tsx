import { Text } from 'react-aria-components';
import { ParallelDocument } from '../query/api';
import { FaStar } from 'react-icons/fa6';

export interface SearchResultProps {
	pdoc: ParallelDocument;
}

export function SearchResult({ pdoc: { source, jp, en, score } }: SearchResultProps) {
	return (
		<div className="flex flex-col border border-gray-300 rounded-md p-2">
			<Text>{jp}</Text>
			<Text className="text-sm">{en}</Text>
			<div className="flex flex-row justify-between">
				<Text className="text-xs text-gray-400">{source}</Text>
				{score >= -100 && (
					<span className="text-yellow-500">
						<FaStar />
					</span>
				)}
			</div>
		</div>
	);
}
