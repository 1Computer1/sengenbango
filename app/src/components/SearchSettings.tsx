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
} from 'react-aria-components';
import { FaCheckDouble, FaGear, FaRegSquare, FaRegSquareCheck, FaStar, FaX, FaXmark } from 'react-icons/fa6';
import { AllSources, RecommendedSources, Settings, Source } from '../query/api';
import { produce } from 'immer';
import { LanguageSwitch } from './LanguageSwitch';

export interface SearchSettingsProps {
	value: Settings;
	onChange: (settings: Settings) => void;
}

export function SearchSettings({ value, onChange }: SearchSettingsProps) {
	return (
		<DialogTrigger>
			<Button className="flex flex-row items-center gap-1">
				<FaGear /> Settings
			</Button>
			<ModalOverlay
				isDismissable
				className="fixed inset-0 p-6 w-screen h-screen bg-black bg-opacity-20 flex justify-center items-center"
			>
				<Modal className="bg-white w-full lg:w-1/2 border border-gray-300 rounded-md p-4">
					<Dialog className="z-10">
						{({ close }) => (
							<div className="flex flex-col gap-2">
								<div className="flex flex-row justify-between items-center">
									<Heading level={1} className="text-xl font-bold">
										Search Settings
									</Heading>
									<Button onPress={close}>
										<FaX />
									</Button>
								</div>
								<div className="flex flex-col gap-2">
									<Heading level={2} className="text-lg font-bold">
										Language
									</Heading>
									<div>
										<LanguageSwitch
											value={value.lang}
											onChange={(lang) =>
												onChange(
													produce(value, (d) => {
														d.lang = lang;
													}),
												)
											}
										/>
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
