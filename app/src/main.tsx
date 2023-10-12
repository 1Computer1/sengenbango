import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { updateTheme } from './util/theme.ts';

updateTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div
			className="overflow-y-scroll h-screen dark:bg-zinc-900 dark:text-gray-300"
			style={{ scrollbarGutter: 'stable' }}
		>
			<App />
		</div>
	</React.StrictMode>,
);
