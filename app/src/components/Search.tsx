import { Button, Input, SearchField, SearchFieldProps } from 'react-aria-components';
import { FaCheck, FaXmark } from 'react-icons/fa6';

interface SearchBarProps extends SearchFieldProps {
	searchDone: boolean;
}

export function Search({ searchDone, ...props }: SearchBarProps) {
	return (
		<SearchField aria-label="Search" {...props}>
			{({ isEmpty }) => (
				<div className="grid grid-areas-[input_done_clear] grid-cols-[1fr,auto,auto] items-center">
					<Input className="grid-in-[input] border border-gray-300 dark:border-gray-600 dark:bg-zinc-900 rounded-md p-2 pr-20 lg:text-2xl" />
					{searchDone && (
						<div className="grid-in-[done] rounded-full -ml-16 z-10 text-green-600">
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
