// src/components/Welcome.jsx
import {
	useState,
	useEffect
} from 'react';
import {
	useNavigate
} from 'react-router-dom';
import Select from 'react-select';

const Welcome = () => {
	const [cities,
		setCities] = useState([]);
	const [selectedCity,
		setSelectedCity] = useState(null);
	const [isLoading,
		setIsLoading] = useState(true);
	const [error,
		setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCities = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('https://api.myquran.com/v2/sholat/kota/semua');
				if (!response.ok) {
					throw new Error('Gagal mengambil data kota');
				}
				const data = await response.json();
				// Memastikan data.data ada dan merupakan array
				if (data.data && Array.isArray(data.data)) {
					const formattedCities = data.data.map(city => ({
						value: city.id,
						label: city.lokasi, // Menggunakan properti "lokasi"
					}));
					setCities(formattedCities);
				} else {
					throw new Error('Format data kota tidak sesuai');
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCities();
	},
		[]);

	const handleSubmit = () => {
		if (selectedCity) {
			const cityName = cities.find(city => city.value === selectedCity.value).label;
			navigate(`/jadwal/${cityName.toLowerCase().replace(/ /g, '-')}`);
		}
	};

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">
			Memuat...
		</div>;
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen">
			Error: {error}
		</div>;
	}

	return (
		<div className="mx-auto w-screen h-screen flex flex-col justify-center items-center gap-4 bg-gradient-to-b from-emerald-950 to-emerald-700 ">
			<div className="w-full px-4 flex flex-col justify-center items-center gap-2">

				<h1 className="mt-3 flex flex-col text-center text-yellow-300 font-semibold font-berkshire-swash text-4xl mb-4">
					<span className="text-xs italic font-light">Selamat Datang di</span>
					Jadwal Imsakiyah
					<span className="text-lg font-[400] font-semibold">Ramadhan 1446 H / 2025 M</span></h1>
				<div className="w-64">
					<Select
						options={cities}
						value={selectedCity}
						onChange={setSelectedCity}
						placeholder="Pilih Kota / Kabupaten"
						isSearchable
						/>
				</div>
				<button
					onClick={handleSubmit}
					className="bg-emerald-950  shadow-2xl shadow-amber-100 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded mt-4 min-w-[250px]"
					>
					Lihat Jadwal
				</button>
			</div>
			<footer className="text-center font-semibold text-xs">
				<a href="https://www.instagram.com/khoriharyadi?igsh=MWdpY3ZrZzdramx3dQ==">Khori Haryadi</a> ©2025
			</footer>
		</div>
	);
};

export default Welcome;