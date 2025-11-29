import Countdown from './Countdown';
import './Hero.css';

const Hero = () => {
    // 2026년 4월 5일 일요일 오후 1시 30분
    const weddingDate = '2026-04-05T13:30:00';
    
    // 메인 사진 경로 설정
    const mainImage = '/main-photo.jpg'; // public 폴더의 이미지

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];
        return { month, day, weekday };
    };

    const { month, day, weekday } = formatDate(weddingDate);

    return (
        <section className="hero">
            <div className="hero-top">
                <Countdown targetDate={weddingDate} />
                <div className="vertical-date">
                    <span>{String(month).padStart(2, '0')}</span>
                    <span className="month-label">월</span>
                    <span>{String(day).padStart(2, '0')}</span>
                    <span className="day-label">일</span>
                </div>
            </div>

            <div className="hero-image-container">
                {mainImage ? (
                    <img 
                        src={mainImage} 
                        alt="메인 사진" 
                        className="hero-image"
                    />
                ) : (
                    <div className="hero-image-placeholder">
                        <span>메인 사진</span>
                    </div>
                )}
            </div>

            <div className="hero-bottom">
                <h1 className="hero-names">
                    강동원 <span className="slash">/</span> 오다영
                </h1>
                <p className="hero-datetime">
                    {weekday}요일  11시 30분
                </p>
                <p className="hero-venue">제주특별자치도 제주시</p>
                <p className="hero-venue-detail">난타호텔</p>
            </div>
        </section>
    );
};

export default Hero;
