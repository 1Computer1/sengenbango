import { Button, Input, SearchField, SearchFieldProps } from 'react-aria-components';
import { FaX } from 'react-icons/fa6';

interface SearchBarProps extends SearchFieldProps {}

export function Search({ ...props }: SearchBarProps) {
	return (
		<SearchField aria-label="Search" {...props}>
			{({ isEmpty }) => (
				<div className="grid grid-areas-[input_clear_submit_help] grid-cols-[1fr,auto]">
					<Input className="grid-in-[input] border border-gray-300 rounded-md p-2 pr-10 lg:text-2xl" />
					{!isEmpty && (
						<Button className="grid-in-[clear] rounded-full -ml-8">
							<FaX />
						</Button>
					)}
				</div>
			)}
		</SearchField>
	);
}
