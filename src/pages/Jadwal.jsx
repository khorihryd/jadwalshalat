// src/pages/Jadwal.jsx
import React, {
	useState,
	useEffect
} from 'react';
import {
	useParams,
	useNavigate
} from 'react-router-dom';
import Countdown from '../components/Countdown';

const Jadwal = () => {
	const {
		cityName
	} = useParams();
	const [jadwal,
		setJadwal] = useState(null);
	const [isLoading,
		setIsLoading] = useState(true);
	const [error,
		setError] = useState(null);

	const navigate = useNavigate();

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

				const today = new Date();
				const year = today.getFullYear();
				const month = String(today.getMonth() + 1).padStart(2, '0');
				const jadwalResponse = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${city.id}/${year}/${month}`);

				if (!jadwalResponse.ok) {
					throw new Error('Gagal mengambil data jadwal');
				}
				const jadwalData = await jadwalResponse.json();
				setJadwal(jadwalData.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchJadwal();
	},
		[cityName]);

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

	const today = new Date();
	let Month = today.getMonth()+1;
	//let todayDate = today.toISOString().split('T')[0];
	let todayDate = `${today.getFullYear()}-${Month.toString().padStart(2,'0')}-${today.getDate()}`
	let jadwalHariIni = jadwal.jadwal.find(j => j.date === todayDate);

	const now = new Date();
	const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

	if (jadwalHariIni && currentTime > jadwalHariIni.isya) {
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		const tomorrowDate = tomorrow.toISOString().split('T')[0];
		jadwalHariIni = jadwal.jadwal.find(j => j.date === tomorrowDate);
		todayDate = tomorrowDate;
	}

	if (!jadwalHariIni) {
		return <div className="flex justify-center items-center h-screen">
			Jadwal hari ini tidak tersedia
		</div>;
	}

	const jadwalWaktu = [{
		label: 'Imsak',
		waktu: jadwalHariIni.imsak,
		title: 'Saatnya Imsak, Selamat Menunaikan Ibadah Puasa'
	},
		{
			label: 'Subuh',
			waktu: jadwalHariIni.subuh,
			title: 'Saatnya Azan Subuh, sholat lebih baik daripada tidur'
		},
		{
			label: 'Terbit',
			waktu: jadwalHariIni.terbit,
			title: 'Waktu Terbit Matahari'
		},
		{
			label: 'Dhuha',
			waktu: jadwalHariIni.dhuha,
			title: 'Waktu Dhuha telah Tiba'
		},
		{
			label: 'Dzuhur',
			waktu: jadwalHariIni.dzuhur,
			title: 'Saatnya Azan Dzuhur'
		},
		{
			label: 'Ashar',
			waktu: jadwalHariIni.ashar,
			title: 'Saatnya Azan Azhar'
		},
		{
			label: 'Maghrib',
			waktu: jadwalHariIni.maghrib,
			title: 'Saatnya Azan Maghrib. Selamat Berbuka Puasa!'
		},
		{
			label: 'Isya',
			waktu: jadwalHariIni.isya,
			title: 'Saatnya Azan Isya. Siap-siap shalat tarawih berjamaah di masjid terdekat!'
		},
	];

	let jadwalTerdekat = null;
	let waktuTerdekat = null;
	let titleTerdekat = null;
	let jadwalSaatini = [];
	let waktuSaatini = null;
	for (let i = 0; i < jadwalWaktu.length; i++) {
		if (jadwalWaktu[i].waktu > currentTime) {
			jadwalTerdekat = jadwalWaktu[i].label;
			waktuTerdekat = jadwalWaktu[i].waktu;
			titleTerdekat = jadwalWaktu[i].title;
			break;
		} else {
			jadwalSaatini = jadwalWaktu[i].label
			waktuSaatini = jadwalWaktu[i].waktu
		}
	}

	if (!jadwalTerdekat && jadwalHariIni) {
		jadwalTerdekat = jadwalWaktu[0].label;
		waktuTerdekat = jadwalWaktu[0].waktu;
	}

	const handleLihatJadwalLainnya = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		navigate(`/jadwal/${cityName}/${year}/${month}`);
	};

	return (
		<div className="w-screen bg-gradient-to-b from-emerald-950 to-emerald-700 h-screen overflow-hidden flex flex-col items-center ">
			<div className="mt-5 text-yellow-300 text-center font-berkshire-swash">
				<h1 className=" font-semibold text-4xl mb-2">Jadwal Imsakiyah</h1>
				<p className="text-[1rem] font-[400] font-semibold">
					Ramadhan 1446 H / 2025 M
				</p>
				<p className="text-[1.1rem] font-serif  font-semibold text-white">
					{jadwal.lokasi}, {jadwal.daerah}
				</p>
			</div>
			<div className="mt-5 px-3 py-5 rounded-lg shadow-xl shadow-slate-700 w-80 bg-white text-gray-800">
				<p className="font-semibold text-xs text-gray-800 mb-2">
					{jadwalHariIni.tanggal.replace('/', '-').replace('/', '-')}
				</p>
				<div className="relative pt-40 flex flex-col gap-1">
					{jadwalWaktu.map((item) => (
						<React.Fragment key={item.label}>
							<div className={`shadow px-3 py-2 rounded flex flex-col justify-between items-center font-bold text-[0.9rem]  ${
								jadwalTerdekat === item.label && waktuTerdekat === item.waktu ? 'absolute w-full top-0 bg-emerald-800  text-white font-semibold my-2 shadow-xl': ''
								} ${jadwalSaatini === item.label && waktuSaatini === item.waktu ? 'bg-emerald-300': ''}`}>
								<div className="w-full flex justify-between items-center">
									<p>
										{item.label}
									</p>
									<p>
										{item.waktu}
									</p>
								</div>
								<div>
									{jadwalTerdekat === item.label && waktuTerdekat === item.waktu && (
										<div className="mt-4 text-center">
											<Countdown targetTime={waktuTerdekat} namaWaktu={titleTerdekat} isAfterIsya={currentTime > jadwalHariIni.isya} />
											<p className="text-xs">
												{`Menuju Waktu ${jadwalTerdekat}`}
											</p>
										</div>
									)}
								</div>
							</div>
						</React.Fragment>
					))}
				</div>
				<div className="flex justify-between items-center mt-4">
					<button className="py-2 text-xs rounded border-2 border-emerald-800 px-2 font-[700] text-emerald-800" onClick={()=> navigate('/')}>
						Ganti Daerah
					</button>
					<button
						className="py-2 text-white text-xs border-emerald-800 border-2 rounded bg-emerald-800 px-2"
						onClick={handleLihatJadwalLainnya}
						>
						Lihat jadwal lengkapnya
					</button>
				</div>
			</div>
			<footer className="mt-2 text-white text-center font-semibold text-xs">
				<a href="https://www.instagram.com/khoriharyadi?igsh=MWdpY3ZrZzdramx3dQ==">Khori Haryadi</a> ©2025
			</footer>
		</div>
	);
};

export default Jadwal;


	// {jadwalTerdekat && (
	//	<p className="mt-4 text-center">
	//		{jadwalTerdekat} dalam: <Countdown targetTime={waktuTerdekat} isAfterIsya={currentTime > jadwalHariIni.isya} />
	//	</p>
	// )}