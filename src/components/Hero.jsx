import Countdown from './Countdown';
import './Hero.css';

const Hero = () => {
    // 웹사이트 참고: 2024년 10월 26일 토요일 오후 1시 30분
    const weddingDate = '2024-10-26T13:30:00';
    
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
                    신랑 <span className="slash">/</span> 신부
                </h1>
                <p className="hero-datetime">
                    {weekday}요일 오후 1시 30분
                </p>
                <p className="hero-venue">서울시 강남구 테헤란로 742</p>
                <p className="hero-venue-detail">그랜드컨벤션웨딩홀 6층 그랜드홀</p>
            </div>
        </section>
    );
};

export default Hero;
