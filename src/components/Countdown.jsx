// src/components/Countdown.jsx
import React, {
	useState,
	useEffect
} from 'react';

const Countdown = ({
	targetTime, isAfterIsya, namaWaktu
}) => {
	const [countdown,
		setCountdown] = useState('');
	const [waktuAzan,
		setWaktuAzan] = useState(false)

	useEffect(() => {
		const interval = setInterval(() => {
			if (targetTime) {
				const now = new Date();
				const [hours,
					minutes] = targetTime.split(':').map(Number);
				const nextTime = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					hours,
					minutes
				);

				if (isAfterIsya) {
					nextTime.setDate(nextTime.getDate() + 1);
				}

				const diff = nextTime - now;

				if (diff > 0) {
					const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
					const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
					const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
					setCountdown(
						`${hoursLeft.toString().padStart(2, '0')}:${minutesLeft
						.toString()
						.padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
					);
				} else {
					setCountdown(`${namaWaktu}`);
					setWaktuAzan(true);
					setTimeout(()=> {
						setWaktuAzan(false)
					}, 60000)
					clearInterval(interval);
				}
			}
		},
			1000);

		return () => clearInterval(interval);
	}, [targetTime, isAfterIsya]);

	if (waktuAzan) return <marquee className="text-4xl font-bold animate-pulse">{countdown}</marquee>
	
	return (
		<div>
			<div className="text-6xl">
				{countdown}
			</div>
		</div>
	)
};

export default Countdown;