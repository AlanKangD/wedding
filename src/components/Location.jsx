import './Location.css';

const Location = () => {
    const handleMapClick = (mapType) => {
        const address = encodeURIComponent('서울시 강남구 테헤란로 742');
        let url = '';
        
        switch(mapType) {
            case 'naver':
                url = `https://map.naver.com/v5/search/${address}`;
                break;
            case 'kakao':
                url = `https://map.kakao.com/link/search/${address}`;
                break;
            case 'tmap':
                url = `https://tmapapi.sktelecom.com/main/shortUrl.do?name=${address}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank');
    };

    return (
        <section className="location">
            <div className="location-content">
                <h2 className="section-title">location</h2>
                <h3 className="venue-name">그랜드컨벤션웨딩홀 6층 그랜드홀</h3>
                <p className="venue-address">서울특별자치도 강남구 테헤란로 742</p>
                <p className="venue-phone">Tel. 02-1234-5678</p>

                <div className="map-container">
                    <div className="map-placeholder">
                        <span>지도 영역</span>
                    </div>
                    <div className="map-buttons">
                        <button className="map-btn" onClick={() => handleMapClick('naver')}>
                            네이버 지도
                        </button>
                        <button className="map-btn" onClick={() => handleMapClick('kakao')}>
                            카카오맵
                        </button>
                        <button className="map-btn" onClick={() => handleMapClick('tmap')}>
                            티맵
                        </button>
                    </div>
                </div>

                <div className="transport-info">
                    <div className="transport-item">
                        <h4>지하철 이용</h4>
                        <p>2호선 강남역 3번 출구 도보 10분</p>
                    </div>
                    <div className="transport-item">
                        <h4>버스 이용</h4>
                        <p>간선버스 : 47, 240, 463</p>
                        <p>지선버스 : 4211</p>
                        <p>광역버스 : 강남08</p>
                    </div>
                    <div className="transport-item">
                        <h4>자가용 이용</h4>
                        <p>강남역 방면에서 150m 직진 후 우측 건물 이용</p>
                    </div>
                    <div className="transport-item">
                        <h4>주차 안내</h4>
                        <p>건물 지하 주차장 이용 가능 (2시간 무료)</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
