import {
	Button,
	Checkbox,
	CheckboxGroup,
	Dialog,
	DialogTrigger,
	Heading,
	Label,
	Modal,
	ModalOverlay,
	Radio,
	RadioGroup,
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
import { flushSync } from 'react-dom';
import { AllSources, RecommendedSources, QuerySettings, Source } from '../query/api';
import { produce } from 'immer';
import useLocalStorage from '../hooks/useLocalStorage';
import { updateTheme } from '../util/theme';
import clsx from 'clsx';

export interface SettingsProps {
	value: QuerySettings;
	onChange: (settings: QuerySettings) => void;
}

export function Settings({ value, onChange }: SettingsProps) {
	const [theme, setTheme] = useLocalStorage('theme');

	return (
		<DialogTrigger>
			<Button className="flex flex-row items-center gap-1">
				<FaGear /> Settings
			</Button>
			<ModalOverlay
				isDismissable
				className="fixed inset-0 p-6 w-screen h-screen bg-black bg-opacity-20 flex justify-center items-center dark:"
			>
				<Modal className="bg-white dark:bg-zinc-900 dark:text-gray-300 w-full lg:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md p-4">
					<Dialog className="z-10">
						{({ close }) => (
							<div className="flex flex-col gap-2">
								<div className="flex flex-row justify-between items-center">
									<Heading level={1} className="text-xl font-bold">
										Settings
									</Heading>
									<Button onPress={close}>
										<FaX />
									</Button>
								</div>
								<div className="flex flex-col gap-2">
									<Heading level={2} className="text-lg font-bold">
										Theme
									</Heading>
									<div>
										<RadioGroup
											value={theme ?? ''}
											onChange={(t) => {
												flushSync(() => {
													setTheme(t || null);
												});
												updateTheme();
											}}
											className="flex flex-row items-center gap-2"
										>
											<Radio value="dark" className="flex flex-row items-center gap-1">
												<FaMoon />
												<span className={clsx(theme === 'dark' && 'underline')}>Dark</span>
											</Radio>
											<Radio value="light" className="flex flex-row items-center gap-1">
												<FaSun />
												<span className={clsx(theme === 'light' && 'underline')}>Light</span>
											</Radio>
											<Radio value="" className="flex flex-row items-center gap-1">
												<FaComputer />
												<span className={clsx(theme === null && 'underline')}>System</span>
											</Radio>
										</RadioGroup>
									</div>
									<Heading level={2} className="text-lg font-bold">
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
											<Label className="font-bold">Enabled Sources</Label>
											<div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
												{AllSources.map((source) => (
													<Checkbox key={source} value={source} className="flex flex-row items-center gap-1">
														{({ isSelected }) => (
															<>
																{isSelected ? <FaRegSquareCheck /> : <FaRegSquare />}
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
