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
                        level: 3, // 지도 확대 레벨 (숫자가 클수록 멀리 보임)
                        
                        // 지도 상호작용 활성화
                        draggable: true,              // 마우스 드래그, 모바일 터치로 지도 이동 가능
                        zoomable: true,               // 마우스 휠, 핀치 줌으로 확대/축소 가능
                        scrollwheel: true,            // 마우스 휠로 확대/축소 가능
                        disableDoubleClickZoom: false // 더블 클릭 확대 가능
                    };

                    const map = new window.kakao.maps.Map(container, options);

                    // 마커 생성
                    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition
                    });
                    marker.setMap(map);

                    // 인포윈도우 생성 (원하시면 주석 처리하여 마커만 남길 수 있습니다)
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: '<div style="padding:10px;font-size:12px;text-align:center;min-width:80px;font-weight:bold;">난타호텔</div>'
                    });
                    infowindow.open(map, marker);
                    
                    // 줌 기능 활성화
                    map.setZoomable(true);
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
                    console.log('KAKAO_APP_KEY:', KAKAO_APP_KEY);
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
                    
                    script.onload = () => {
                        console.log('카카오맵 스크립트 로드 성공');
                        console.log('현재 도메인:', window.location.hostname);
                        console.log('API 키:', KAKAO_APP_KEY ? `${KAKAO_APP_KEY.substring(0, 10)}...` : '없음');
                        
                        // 스크립트 로드 후 약간의 지연을 두고 초기화
                        setTimeout(() => {
                            if (window.kakao && window.kakao.maps) {
                                initMap();
                            } else {
                                console.error('카카오맵 객체를 찾을 수 없습니다.');
                                if (mapContainer.current) {
                                    mapContainer.current.innerHTML = `
                                        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;padding:2rem;text-align:center;background-color:#f8f8f8;border-radius:12px;">
                                            <p style="margin-bottom:1rem;color:#d32f2f;font-weight:bold;">카카오맵을 초기화할 수 없습니다.</p>
                                            <p style="font-size:0.85rem;color:#999;">API 키의 플랫폼 설정을 확인하세요.</p>
                                        </div>
                                    `;
                                }
                            }
                        }, 100);
                    };
                    
                    script.onerror = (error) => {
                        console.warn('카카오맵 스크립트 로드 실패:', error);
                        console.warn('API 키 확인:', KAKAO_APP_KEY ? `설정됨 (${KAKAO_APP_KEY.substring(0, 10)}...)` : '설정 안됨');
                        console.warn('현재 도메인:', window.location.hostname);
                        console.warn('카카오 개발자 콘솔에서 다음 도메인을 등록하세요:');
                        console.warn('  - http://localhost:5173');
                        console.warn('  - http://localhost:5174');
                        console.warn('  - http://localhost:3000');
                        console.warn('  - http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
                        
                        // 정적 지도 이미지로 대체 (카카오 스태틱 맵 API 사용)
                        if (mapContainer.current) {
                            const staticMapUrl = `https://dapi.kakao.com/v2/maps/staticmap?markers=${latitude},${longitude}&level=3&size=600x300&appkey=${KAKAO_APP_KEY}`;
                            
                            // 정적 지도 이미지 시도, 실패 시 네이버 정적 지도 사용
                            const img = new Image();
                            img.onload = () => {
                                if (mapContainer.current) {
                                    mapContainer.current.innerHTML = `
                                        <img 
                                            src="${staticMapUrl}" 
                                            alt="난타호텔 위치" 
                                            style="width:100%;height:100%;object-fit:cover;border-radius:12px;cursor:pointer;"
                                            onclick="window.open('https://map.kakao.com/link/map/난타호텔,${latitude},${longitude}', '_blank')"
                                        />
                                    `;
                                }
                            };
                            img.onerror = () => {
                                // 네이버 정적 지도로 대체
                                const naverStaticMapUrl = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=600&h=300&markers=type:d|size:mid|pos:${longitude} ${latitude}|label:난타호텔&center=${longitude},${latitude}&level=15&X-NCP-APIGW-API-KEY-ID=`;
                                
                                // 또는 구글 스태틱 맵 사용 (무료, API 키 불필요)
                                const googleStaticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red|label:N|${latitude},${longitude}&language=ko`;
                                
                                if (mapContainer.current) {
                                    mapContainer.current.innerHTML = `
                                        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg, #e8e5e1 0%, #ddd9d4 100%);border-radius:12px;padding:2rem;">
                                            <img 
                                                src="${googleStaticMapUrl}" 
                                                alt="난타호텔 위치" 
                                                style="width:100%;height:100%;object-fit:cover;border-radius:8px;cursor:pointer;margin-bottom:1rem;"
                                                onclick="window.open('https://map.kakao.com/link/map/난타호텔,${latitude},${longitude}', '_blank')"
                                            />
                                            <p style="font-size:0.85rem;color:#666;text-align:center;margin:0;">
                                                지도를 클릭하면 상세 위치를 확인할 수 있습니다.
                                            </p>
                                        </div>
                                    `;
                                }
                            };
                            img.src = staticMapUrl;
                        }
                    };
                    
                    document.head.appendChild(script);
                }
            }
        } else {
            // API 키가 없을 경우 안내 메시지 표시
            if (mapContainer.current) {
                mapContainer.current.innerHTML = `
                    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;padding:2rem;text-align:center;background-color:#f8f8f8;border-radius:12px;">
                        <p style="margin-bottom:1rem;">지도를 표시하려면 카카오맵 API 키가 필요합니다.</p>
                        <p style="font-size:0.85rem;color:#999;">아래 버튼을 클릭하여 지도를 확인하세요.</p>
                    </div>
                `;
            }
        }
    }, []);

    const handleMapClick = (mapType) => {
        const address = encodeURIComponent('제주 제주시 선돌목동길 56-26 호텔난타');
        const placeName = encodeURIComponent('난타호텔');
        let url = '';
        
        // 카카오톡 인앱 브라우저 감지
        const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);
        const isInApp = /(iPhone|iPod|iPad|Android)/i.test(navigator.userAgent) && 
                       !window.MSStream && 
                       !/CriOS|FxiOS|OPiOS/i.test(navigator.userAgent);
        
        switch(mapType) {
            case 'naver':
                // 네이버 지도: 카카오톡 인앱 브라우저 호환 링크
                // 좌표 기반 검색으로 변경 (더 안정적)
                url = `https://m.map.naver.com/map2/search?query=${placeName}&sm=hty&style=v5&center=${longitude},${latitude}&level=3`;
                
                // 카카오톡 인앱 브라우저에서는 location.href 사용
                if (isKakaoTalk || isInApp) {
                    window.location.href = url;
                    return;
                }
                break;
            case 'kakao':
                // 카카오맵: 카카오톡 인앱 브라우저 호환 링크
                url = `https://map.kakao.com/link/map/${placeName},${latitude},${longitude}`;
                
                // 카카오톡 인앱 브라우저에서는 location.href 사용
                if (isKakaoTalk || isInApp) {
                    window.location.href = url;
                    return;
                }
                break;
            case 'tmap':
                // 티맵: 카카오톡 인앱 브라우저 호환 링크
                url = `https://tmapapi.sktelecom.com/main/shortUrl.do?name=${address}`;
                
                // 카카오톡 인앱 브라우저에서는 location.href 사용
                if (isKakaoTalk || isInApp) {
                    window.location.href = url;
                    return;
                }
                break;
            default:
                return;
        }
        
        // 일반 브라우저에서는 새 창으로 열기
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section className="location">
            <div className="location-content">
                <h2 className="section-title">location</h2>
                <h3 className="venue-name">난타호텔</h3>
                <p className="venue-address">제주 제주시 선돌목동길 56-26 호텔난타</p>
                <p className="venue-phone">Tel. 064-727-0800</p> 

                <div className="map-container">
                    <div 
                        ref={mapContainer}
                        className="map-placeholder"
                        style={{ 
                            width: '100%', 
                            height: '300px',
                            borderRadius: '12px', // [추가] 모서리 둥글게
                            overflow: 'hidden',    // [추가] 자식이 튀어나오지 않게
                            border: '1px solid #e0e0e0' // [추가] 연한 테두리
                        }}
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
                        <p>제주시내버스 473번 이용 후 난타호텔 정류장 하차</p>
                    </div>
                    <div className="transport-item">
                        <h4>주차 안내</h4>
                        <p>호텔 내 넓은 주차장 이용 가능</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;