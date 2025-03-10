// src/App.jsx
import React from 'react';
import {
	HashRouter as Router,
	Routes,
	Route
} from 'react-router-dom';
import Welcome from './components/Welcome';
import Jadwal from './pages/Jadwal';
import JadwalFull from './pages/JadwalFull';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/jadwal/:cityName" element={<Jadwal />} />
				<Route path="/jadwal/:cityName/:year/:month" element={<JadwalFull />} />
			</Routes>
		</Router>
	);
}

export default App;