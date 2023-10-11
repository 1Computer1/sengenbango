import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<div className="w-screen h-screen" style={{ scrollbarGutter: 'stable both-edges' }}>
			<App />
		</div>
	</React.StrictMode>,
);
