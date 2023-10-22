import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { updateTheme } from './util/theme.ts';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

updateTheme();

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div
			className="overflow-y-scroll h-screen dark:bg-zinc-900 dark:text-gray-300"
			style={{ scrollbarGutter: 'stable' }}
		>
			<RouterProvider router={router} />
		</div>
	</React.StrictMode>,
);
