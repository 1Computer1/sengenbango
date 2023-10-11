import { Switch } from 'react-aria-components';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa6';
import { Language } from '../query/api';

export interface LanguageSwitchProps {
	value: Language;
	onChange: (lang: Language) => void;
}

export function LanguageSwitch({ value, onChange }: LanguageSwitchProps) {
	return (
		<Switch
			className="flex flex-row items-center gap-1"
			onChange={(t) => {
				onChange(t ? 'japanese' : 'english');
			}}
		>
			{value === 'japanese' ? (
				<>
					<FaToggleOff />
					<span className="underline">Japanese</span>
					<span>English</span>
				</>
			) : (
				<>
					<FaToggleOn />
					<span>Japanese</span>
					<span className="underline">English</span>
				</>
			)}
		</Switch>
	);
}
