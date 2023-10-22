import { useCallback, useState } from 'react';

export default function useLocalStorage(key: string): [string | null, (newValue: string | null) => void] {
	const [value, setValue_] = useState(localStorage.getItem(key));
	const setValue = useCallback(
		(newValue: string | null) => {
			if (newValue == null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, newValue);
			}
			setValue_(newValue);
		},
		[key],
	);
	return [value, setValue];
}

export function useJSONLocalStorage<T>(key: string, initial: T): [T, (newValue: T) => void] {
	const [value, setValue_] = useState<T>(localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : initial);
	const setValue = useCallback(
		(newValue: T) => {
			if (newValue == null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(newValue));
			}
			setValue_(newValue);
		},
		[key],
	);
	return [value, setValue];
}
