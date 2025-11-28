import { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="countdown">
            <div className="countdown-label">D-{timeLeft.days}</div>
            <div className="countdown-time">
                <div className="time-unit">
                    <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="time-label">시</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-unit">
                    <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="time-label">분</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-unit">
                    <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="time-label">초</span>
                </div>
            </div>
        </div>
    );
};

export default Countdown;

