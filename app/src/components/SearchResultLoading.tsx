export function SearchResultLoading() {
	return (
		<div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-md p-2 gap-0.5">
			<div className="h-6 w-1/4 py-0.5 animate-pulse">
				<div className="w-full h-full rounded-sm bg-gray-300 dark:bg-gray-600"></div>
			</div>
			<div className="text-sm h-5 w-1/3 py-0.5 animate-pulse">
				<div className="w-full h-full rounded-sm bg-gray-300 dark:bg-gray-600"></div>
			</div>
			<div className="flex flex-row justify-between items-end">
				<div className="text-xs h-4 w-1/12 py-0.5 animate-pulse">
					<div className="w-full h-full rounded-sm bg-gray-300 dark:bg-gray-600"></div>
				</div>
			</div>
		</div>
	);
}
