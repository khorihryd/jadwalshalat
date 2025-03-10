import React, {
	useState,
	useEffect
} from 'react';
import {
	useParams
} from 'react-router-dom';

const JadwalFull = () => {
	const {
		cityName,
		year,
		month
	} = useParams();
	const [jadwal,
		setJadwal] = useState(null);
	const [isLoading,
		setIsLoading] = useState(true);
	const [error,
		setError] = useState(null);
	const [todayDate,
		setTodayDate] = useState(null);

	useEffect(() => {
		const fetchJadwal = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const citiesResponse = await fetch('https://api.myquran.com/v2/sholat/kota/semua');
				if (!citiesResponse.ok) {
					throw new Error('Gagal mengambil data kota');
				}
				const citiesData = await citiesResponse.json();
				const city = citiesData.data.find(c => c.lokasi.toLowerCase().replace(/ /g, '-') === cityName);

				if (!city) {
					throw new Error('Kota tidak ditemukan');
				}

				const jadwalResponse = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${city.id}/${year}/${month}`);

				if (!jadwalResponse.ok) {
					throw new Error('Gagal mengambil data jadwal');
				}
				const jadwalData = await jadwalResponse.json();
				setJadwal(jadwalData.data);

				// Set tanggal hari ini
				const today = new Date();
				const Month = today.getMonth()+1;
				//const todayFormatted = today.toISOString().split('T')[0];
				const todayFormatted = `${today.getFullYear()}-${Month.toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
				setTodayDate(todayFormatted);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchJadwal();
	},
		[cityName,
			year,
			month]);

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

	if (!jadwal) {
		return <div className="flex justify-center items-center h-screen">
			Jadwal tidak ditemukan
		</div>;
	}

	return (
		<div className="p-4">
			<h1 className="fixed top-0 bg-white text-2xl font-bold mb-4">Jadwal Lengkap {jadwal.lokasi} - {year}/{month}</h1>

			{/* Tampilan Card untuk Smartphone */}
			<div className="md:hidden mt-20">
				{jadwal.jadwal.map((item, index) => (
					<div
						key={item.date}
						className={`mb-4 border rounded-lg overflow-hidden ${
						item.date === todayDate ? 'bg-yellow-200': ''
						}`}
						>
						<div className="font-semibold px-3 py-1 bg-emerald-500">
							{item.tanggal}
						</div>
						<div className="px-3 py-2 grid grid-cols-2">
							<p>
								Imsak: {item.imsak}
							</p>
							<p>
								Subuh: {item.subuh}
							</p>
							<p>
								Terbit: {item.terbit}
							</p>
							<p>
								Dhuha: {item.dhuha}
							</p>
							<p>
								Dzuhur: {item.dzuhur}
							</p>
							<p>
								Ashar: {item.ashar}
							</p>
							<p>
								Maghrib: {item.maghrib}
							</p>
							<p>
								Isya: {item.isya}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Tampilan Tabel untuk Desktop */}
			<div className=" hidden md:block w-screen h-screen overflow-x-auto">
				<table className="relative w-full border-collapse border border-gray-400 min-w-max">
					<thead className="sticky top-0 left-0">
						<tr className="bg-gray-200">
							<th className="border border-gray-400 p-2">No.</th>
							<th className="border border-gray-400 p-2">Tanggal</th>
							<th className="border border-gray-400 p-2">Imsak</th>
							<th className="border border-gray-400 p-2">Subuh</th>
							<th className="border border-gray-400 p-2">Terbit</th>
							<th className="border border-gray-400 p-2">Dhuha</th>
							<th className="border border-gray-400 p-2">Dzuhur</th>
							<th className="border border-gray-400 p-2">Ashar</th>
							<th className="border border-gray-400 p-2">Maghrib</th>
							<th className="border border-gray-400 p-2">Isya</th>
						</tr>
					</thead>
					<tbody>
						{jadwal.jadwal.map((item, index) => (
							<tr
								key={item.date}
								className={item.date === todayDate ? 'bg-yellow-200': ''}
								>
								<td className="border border-gray-400 p-2 text-center">{index + 1}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.tanggal}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.imsak}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.subuh}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.terbit}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.dhuha}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.dzuhur}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.ashar}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.maghrib}</td>
								<td className="border border-gray-400 p-2 whitespace-nowrap">{item.isya}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default JadwalFull;