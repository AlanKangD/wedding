import { useEffect, useRef } from 'react';
import './Location.css';

const Location = () => {
    const mapContainer = useRef(null);
    
    // 난타호텔 좌표
    const latitude = 33.445293;
    const longitude = 126.54792;

    useEffect(() => {
        // 카카오맵 JavaScript API 키
        const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY || '';
        
        // 디버깅: API 키 확인
        if (KAKAO_APP_KEY) {
            console.log('카카오맵 API 키가 설정되었습니다.');
        } else {
            console.warn('카카오맵 API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_MAP_API_KEY를 추가하세요.');
        }
        
        if (!mapContainer.current) return;

        const initMap = () => {
            if (!mapContainer.current) return;
            
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    if (!mapContainer.current) return;
                    
                    const container = mapContainer.current;
                    const options = {
                        center: new window.kakao.maps.LatLng(latitude, longitude),
                        level: 3
                    };

                    const map = new window.kakao.maps.Map(container, options);

                    // 마커 생성
                    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition
                    });
                    marker.setMap(map);

                    // 인포윈도우 생성
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: '<div style="padding:10px;font-size:12px;text-align:center;min-width:80px;">난타호텔</div>'
                    });
                    infowindow.open(map, marker);
                });
            }
        };

        if (KAKAO_APP_KEY) {
            // 이미 카카오맵 스크립트가 로드되어 있는지 확인
            if (window.kakao && window.kakao.maps) {
                initMap();
            } else {
                // 스크립트가 이미 있는지 확인
                const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps"]');
                
                if (existingScript) {
                    // 이미 스크립트가 있으면 로드 완료를 기다림
                    existingScript.addEventListener('load', () => {
                        if (window.kakao && window.kakao.maps) {
                            initMap();
                        }
                    });
                    
                    // 이미 로드되었을 수도 있음
                    if (window.kakao) {
                        initMap();
                    }
                } else {
                    // 새 스크립트 추가
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
                    
                    script.onload = () => {
                        console.log('카카오맵 스크립트 로드 성공');
                        initMap();
                    };
                    
                    script.onerror = (error) => {
                        console.error('카카오맵 스크립트 로드 실패:', error);
                        console.error('API 키 확인:', KAKAO_APP_KEY ? `설정됨 (${KAKAO_APP_KEY.substring(0, 10)}...)` : '설정 안됨');
                        console.error('스크립트 URL:', script.src);
                        console.error('에러 상세:', error);
                        console.error('해결 방법:');
                        console.error('1. 카카오 개발자 콘솔(https://developers.kakao.com/)에서 Web 플랫폼 등록 확인');
                        console.error('2. 사이트 도메인에 localhost 또는 현재 도메인 추가');
                        console.error('3. JavaScript 키가 올바른지 확인');
                        
                        // 실패 시 정적 지도 이미지 또는 안내 메시지 표시
                        if (mapContainer.current) {
                            // 카카오맵 정적 이미지 사용 (API 키 불필요)
                            const staticMapUrl = `https://dapi.kakao.com/v2/maps/staticmap?center=${latitude},${longitude}&level=3&size=600x300&markers=size:mid,color:red|${latitude},${longitude}`;
                            
                            mapContainer.current.innerHTML = `
                                <div style="position:relative;width:100%;height:100%;border-radius:12px;overflow:hidden;background:#f5f5f5;">
                                    <img 
                                        src="https://dapi.kakao.com/v2/maps/staticmap?center=${latitude},${longitude}&level=3&size=600x300&markers=size:mid,color:red|${latitude},${longitude}" 
                                        alt="난타호텔 위치"
                                        style="width:100%;height:100%;object-fit:cover;"
                                        onerror="this.parentElement.innerHTML='<div style=\\'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;padding:2rem;text-align:center;\\'><p style=\\'margin-bottom:1rem;\\'>지도를 불러올 수 없습니다.</p><p style=\\'font-size:0.85rem;color:#999;\\'>아래 버튼을 클릭하여 지도를 확인하세요.</p></div>'"
                                    />
                                    <div style="position:absolute;bottom:10px;right:10px;background:rgba(255,255,255,0.9);padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#666;">
                                        난타호텔
                                    </div>
                                </div>
                            `;
                        }
                    };
                    
                    document.head.appendChild(script);
                }
            }
        } else {
            // API 키가 없을 경우 안내 메시지 표시
            if (mapContainer.current) {
                mapContainer.current.innerHTML = `
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;padding:2rem;text-align:center;">
                        <p style="margin-bottom:1rem;">지도를 표시하려면 카카오맵 API 키가 필요합니다.</p>
                        <p style="font-size:0.85rem;color:#999;">아래 버튼을 클릭하여 지도를 확인하세요.</p>
                    </div>
                `;
            }
        }
    }, []);

    const handleMapClick = (mapType) => {
        const address = encodeURIComponent('제주 제주시 선돌목동길 56-26 호텔난타');
        let url = '';
        
        switch(mapType) {
            case 'naver':
                url = `https://map.naver.com/v5/search/${address}`;
                break;
            case 'kakao':
                url = `https://map.kakao.com/link/map/난타호텔,${latitude},${longitude}`;
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
                <h3 className="venue-name">난타호텔</h3>
                <p className="venue-address">제주 제주시 선돌목동길 56-26 호텔난타</p>
                <p className="venue-phone">Tel. 02-1234-5678</p>

                <div className="map-container">
                    <div 
                        ref={mapContainer}
                        className="map-placeholder"
                        style={{ width: '100%', height: '300px' }}
                    ></div>
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
                        <h4>자가용 이용</h4>
                        <p>네비게이션에 "난타호텔" 또는 "제주시 선돌목동길 56-26" 검색</p>
                        <p>호텔 주차장 이용 가능</p>
                    </div>
                    <div className="transport-item">
                        <h4>버스 이용</h4>
                        <p>제주시내버스 이용 후 난타호텔 정류장 하차</p>
                    </div>
                    <div className="transport-item">
                        <h4>주차 안내</h4>
                        <p>호텔 주차장 이용 가능</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
