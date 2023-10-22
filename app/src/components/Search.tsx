import clsx from 'clsx';
import { Button, Input, SearchField, SearchFieldProps } from 'react-aria-components';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { SearchStatus } from '../util/SearchStatus';

export interface SearchBarProps extends SearchFieldProps {
	searchStatus: SearchStatus;
}

export function Search({ searchStatus, ...props }: SearchBarProps) {
	return (
		<SearchField aria-label="Search" {...props}>
			{({ isEmpty }) => (
				<div className="grid grid-areas-[input_done_clear] grid-cols-[1fr,auto,auto] items-center">
					<Input className="grid-in-[input] border border-gray-300 dark:border-gray-600 dark:bg-zinc-900 rounded-md p-2 pr-20 lg:text-2xl" />
					{searchStatus !== SearchStatus.NONE && (
						<div
							className={clsx(
								'grid-in-[done] rounded-full -ml-16 z-10 transition',
								searchStatus === SearchStatus.LOAD && 'text-yellow-500 animate-pulse',
								searchStatus === SearchStatus.DONE && 'text-green-600',
							)}
						>
							<FaCheck />
						</div>
					)}
					{!isEmpty && (
						<Button className="grid-in-[clear] rounded-full -ml-8 z-10">
							<FaXmark />
						</Button>
					)}
				</div>
			)}
		</SearchField>
	);
}
