import { updateTheme } from '../util/theme';
import useLocalStorage from './useLocalStorage';
import { flushSync } from 'react-dom';

export function useTheme(): ['dark' | 'light' | null, (newValue: 'dark' | 'light' | null) => void] {
	const [theme, setTheme] = useLocalStorage('theme');
	return [
		theme as 'dark' | 'light' | null,
		(t) => {
			flushSync(() => {
				setTheme(t);
			});
			updateTheme();
		},
	];
}
