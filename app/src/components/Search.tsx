import { Button, Input, SearchField, SearchFieldProps } from 'react-aria-components';
import { FaXmark } from 'react-icons/fa6';

export interface SearchBarProps extends SearchFieldProps {}

export function Search({ ...props }: SearchBarProps) {
	return (
		<SearchField aria-label="Search" {...props}>
			{({ isEmpty }) => (
				<div className="grid grid-areas-[input_clear] grid-cols-[1fr,auto] items-center">
					<Input className="grid-in-[input] border border-gray-300 dark:border-gray-600 dark:bg-zinc-900 rounded-md p-2 pr-12 lg:text-2xl" />
					<div className="grid-in-[clear] flex flex-row justify-center items-center -ml-10 gap-4">
						{!isEmpty && (
							<Button className="rounded-full z-10">
								<FaXmark />
							</Button>
						)}
					</div>
				</div>
			)}
		</SearchField>
	);
}
