import { Button, Checkbox, CheckboxGroup, Heading, Switch } from 'react-aria-components';
import {
	FaCheckDouble,
	FaComputer,
	FaGear,
	FaMoon,
	FaRegSquare,
	FaRegSquareCheck,
	FaStar,
	FaSun,
	FaToggleOff,
	FaToggleOn,
	FaXmark,
} from 'react-icons/fa6';
import { AllSources, RecommendedSources, QuerySettings, Source } from '../query/api';
import { produce } from 'immer';
import clsx from 'clsx';
import { useTheme } from '../hooks/useTheme';
import { CustomDialog } from './layout/CustomDialog';
import { SearchSettings } from '../util/SearchSettings';
import { Sources } from '../util/Sources';

export interface SettingsProps {
	querySettings: QuerySettings;
	onQuerySettingsChange: (settings: QuerySettings) => void;
	searchSettings: SearchSettings;
	onSearchSettingsChange: (settings: SearchSettings) => void;
}

export function Settings({
	querySettings,
	onQuerySettingsChange,
	searchSettings,
	onSearchSettingsChange,
}: SettingsProps) {
	const [theme, setTheme] = useTheme();

	return (
		<CustomDialog
			title="Settings"
			button={
				<div className="flex flex-row items-center gap-1">
					<FaGear /> Settings
				</div>
			}
		>
			<div className="flex flex-col gap-2">
				<Heading level={2} className="text-xl font-bold">
					Theme
				</Heading>
				<div className="flex flex-row items-center gap-2">
					<Button
						onPress={() => setTheme('dark')}
						className={({ isFocusVisible }) =>
							clsx('flex flex-row items-center gap-1 rounded-sm', isFocusVisible && 'ring')
						}
					>
						<FaMoon />
						<span className={clsx(theme === 'dark' && 'underline')}>Dark</span>
					</Button>
					<Button
						onPress={() => setTheme('light')}
						className={({ isFocusVisible }) =>
							clsx('flex flex-row items-center gap-1 rounded-sm', isFocusVisible && 'ring')
						}
					>
						<FaSun />
						<span className={clsx(theme === 'light' && 'underline')}>Light</span>
					</Button>
					<Button
						onPress={() => setTheme(null)}
						className={({ isFocusVisible }) =>
							clsx('flex flex-row items-center gap-1 rounded-sm', isFocusVisible && 'ring')
						}
					>
						<FaComputer />
						<span className={clsx(theme === null && 'underline')}>System</span>
					</Button>
				</div>
				<Heading level={2} className="text-xl font-bold">
					Search Results
				</Heading>
				<div className="flex flex-col gap-2">
					<Switch
						className={({ isFocusVisible }) =>
							clsx('w-fit flex flex-row items-center gap-1', isFocusVisible && 'rounded-sm ring')
						}
						onChange={(t) => {
							onSearchSettingsChange(
								produce(searchSettings, (d) => {
									d.showEnglish = t;
								}),
							);
						}}
					>
						{!searchSettings.showEnglish ? <FaToggleOn /> : <FaToggleOff />} Hide English Translation
					</Switch>
				</div>
				<Heading level={2} className="text-xl font-bold">
					Document Sources
				</Heading>
				<div className="flex flex-col gap-2">
					<div className="flex flex-col lg:flex-row gap-2">
						<Button
							className="flex flex-row items-center gap-1"
							onPress={() => {
								onQuerySettingsChange(
									produce(querySettings, (d) => {
										d.sources = RecommendedSources;
									}),
								);
							}}
						>
							<FaStar />
							Select Recommended
						</Button>
						<Button
							className="flex flex-row items-center gap-1"
							onPress={() => {
								onQuerySettingsChange(
									produce(querySettings, (d) => {
										d.sources = AllSources;
									}),
								);
							}}
						>
							<FaCheckDouble />
							Select All
						</Button>
						<Button
							className="flex flex-row items-center gap-1"
							onPress={() => {
								onQuerySettingsChange(
									produce(querySettings, (d) => {
										d.sources = [];
									}),
								);
							}}
						>
							<FaXmark />
							Select None
						</Button>
					</div>
					<CheckboxGroup
						aria-label="Enabled Sources"
						className="flex flex-col gap-2"
						value={querySettings.sources}
						onChange={(sources) => {
							onQuerySettingsChange(
								produce(querySettings, (d) => {
									d.sources = sources as Source[];
								}),
							);
						}}
					>
						<div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
							{Sources.flatMap((source) => source.short.map((s) => [s, source] as const)).map(([s, source]) => (
								<Checkbox key={s} value={s} className="flex flex-row items-center gap-1">
									{({ isSelected, isFocusVisible }) => (
										<>
											<span className={clsx('rounded-sm', isFocusVisible && 'ring')}>
												{isSelected ? <FaRegSquareCheck /> : <FaRegSquare />}
											</span>
											<span className="text-sm font-bold font-mono bg-zinc-300 dark:bg-zinc-700 rounded-sm px-0.5">
												{s} {source.unscored && <span className="-ml-1.5 font-sans text-xs text-red-600">*</span>}
											</span>
										</>
									)}
								</Checkbox>
							))}
						</div>
						{Sources.filter((source) => source.unscored).length > 0 && (
							<span className="text-xs">
								<span className="text-red-600">*</span>{' '}
								<span>These sources are currently not scored properly. Sorting will not be accurate.</span>
							</span>
						)}
					</CheckboxGroup>
				</div>
			</div>
		</CustomDialog>
	);
}
