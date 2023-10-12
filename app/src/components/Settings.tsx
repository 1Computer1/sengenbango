import {
	Button,
	Checkbox,
	CheckboxGroup,
	Dialog,
	DialogTrigger,
	Heading,
	Modal,
	ModalOverlay,
} from 'react-aria-components';
import {
	FaCheckDouble,
	FaComputer,
	FaGear,
	FaMoon,
	FaRegSquare,
	FaRegSquareCheck,
	FaStar,
	FaSun,
	FaX,
	FaXmark,
} from 'react-icons/fa6';
import { AllSources, RecommendedSources, QuerySettings, Source } from '../query/api';
import { produce } from 'immer';
import clsx from 'clsx';
import { useTheme } from '../hooks/useTheme';

export interface SettingsProps {
	value: QuerySettings;
	onChange: (settings: QuerySettings) => void;
}

export function Settings({ value, onChange }: SettingsProps) {
	const [theme, setTheme] = useTheme();

	return (
		<DialogTrigger>
			<Button className="flex flex-row items-center gap-1">
				<FaGear /> Settings
			</Button>
			<ModalOverlay
				isDismissable
				className="fixed inset-0 p-6 w-screen h-screen bg-black bg-opacity-20 flex justify-center items-center dark:"
			>
				<Modal className="bg-white dark:bg-zinc-900 dark:text-gray-300 w-full lg:w-1/2 max-h-full overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-4">
					<Dialog className="z-10">
						{({ close }) => (
							<div className="flex flex-col gap-2">
								<div className="flex flex-row justify-between items-center">
									<Heading level={1} className="text-2xl font-bold">
										Settings
									</Heading>
									<Button onPress={close}>
										<FaX />
									</Button>
								</div>
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
										Document Sources
									</Heading>
									<div className="flex flex-col gap-2">
										<div className="flex flex-row flex-wrap gap-2">
											<Button
												className="flex flex-row items-center gap-1"
												onPress={() => {
													onChange(
														produce(value, (d) => {
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
													onChange(
														produce(value, (d) => {
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
													onChange(
														produce(value, (d) => {
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
											value={value.sources}
											onChange={(sources) => {
												onChange(
													produce(value, (d) => {
														d.sources = sources as Source[];
													}),
												);
											}}
										>
											<div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
												{AllSources.map((source) => (
													<Checkbox key={source} value={source} className="flex flex-row items-center gap-1">
														{({ isSelected, isFocusVisible }) => (
															<>
																<span className={clsx('rounded-sm', isFocusVisible && 'ring')}>
																	{isSelected ? <FaRegSquareCheck /> : <FaRegSquare />}
																</span>
																{source}
															</>
														)}
													</Checkbox>
												))}
											</div>
										</CheckboxGroup>
									</div>
								</div>
							</div>
						)}
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
}
