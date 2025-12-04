import { useEffect, useRef, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    // 갤러리 이미지 경로 배열
    const photos = [
        '/gallery-1.webp',
        '/gallery-2.webp',
        '/gallery-3.webp',
        '/gallery-4.webp',
        '/gallery-5.webp',
        '/gallery-6.webp',
        '/gallery-7.webp',
        '/gallery-8.webp',
        '/gallery-9.webp',
        '/gallery-10.webp',

    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
    
    // 스와이프 제스처를 위한 상태
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    
    // 썸네일 스트립 ref
    const thumbnailStripRef = useRef(null);
    const imageCacheRef = useRef(new Map());

    // 컴포넌트 마운트 시 모든 이미지 프리로드 (최적화)
    useEffect(() => {
        const preloadImages = async () => {
            // 첫 번째 이미지가 이미 로드되었는지 빠르게 확인
            const firstImg = new Image();
            firstImg.src = photos[0];
            
            // 이미지가 캐시에 있으면 즉시 로드됨
            if (firstImg.complete) {
                setLoadedImages(prev => new Set([...prev, photos[0]]));
                imageCacheRef.current.set(photos[0], true);
            } else {
                // 로딩 스피너 표시 (200ms 후에만 표시하여 깜빡임 방지)
                const spinnerTimeout = setTimeout(() => {
                    setShowLoadingSpinner(true);
                }, 200);
                
                firstImg.onload = () => {
                    clearTimeout(spinnerTimeout);
                    setShowLoadingSpinner(false);
                    setLoadedImages(prev => new Set([...prev, photos[0]]));
                    imageCacheRef.current.set(photos[0], true);
                };
            }

            // 나머지 이미지들 백그라운드에서 프리로드
            const loadPromises = photos.slice(1).map((photo, index) => {
                return new Promise((resolve) => {
                    // 이미 캐시에 있는지 확인
                    if (imageCacheRef.current.has(photo)) {
                        setLoadedImages(prev => new Set([...prev, photo]));
                        resolve();
                        return;
                    }

                    const img = new Image();
                    img.onload = () => {
                        imageCacheRef.current.set(photo, true);
                        setLoadedImages(prev => new Set([...prev, photo]));
                        resolve();
                    };
                    
                    img.onerror = () => {
                        console.warn(`이미지 로드 실패: ${photo}`);
                        resolve();
                    };
                    
                    img.src = photo;
                });
            });

            await Promise.all(loadPromises);
            setIsInitialLoad(false);
            setShowLoadingSpinner(false);
        };

        preloadImages();
    }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

    // 현재 이미지와 인접 이미지 우선 프리로드
    useEffect(() => {
        if (isInitialLoad) return; // 초기 로드 중이면 스킵

        // 현재 이미지가 이미 로드되어 있으면 스피너 표시 안 함
        if (loadedImages.has(photos[currentIndex])) {
            setShowLoadingSpinner(false);
            return;
        }

        // 현재 이미지 로드 (이미 캐시에 있으면 즉시 완료)
        const img = new Image();
        img.src = photos[currentIndex];
        
        // 이미지가 캐시에 있으면 즉시 로드됨
        if (img.complete) {
            setLoadedImages(prev => new Set([...prev, photos[currentIndex]]));
            setShowLoadingSpinner(false);
        } else {
            // 로딩 스피너 표시 (200ms 후에만 표시)
            const spinnerTimeout = setTimeout(() => {
                setShowLoadingSpinner(true);
            }, 200);
            
            img.onload = () => {
                clearTimeout(spinnerTimeout);
                setShowLoadingSpinner(false);
                setLoadedImages(prev => new Set([...prev, photos[currentIndex]]));
            };
        }

        // 다음 이미지 프리로드
        const nextIndex = (currentIndex + 1) % photos.length;
        if (!loadedImages.has(photos[nextIndex])) {
            const nextImg = new Image();
            nextImg.src = photos[nextIndex];
            nextImg.onload = () => {
                setLoadedImages(prev => new Set([...prev, photos[nextIndex]]));
            };
        }

        // 이전 이미지 프리로드
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        if (!loadedImages.has(photos[prevIndex])) {
            const prevImg = new Image();
            prevImg.src = photos[prevIndex];
            prevImg.onload = () => {
                setLoadedImages(prev => new Set([...prev, photos[prevIndex]]));
            };
        }
    }, [currentIndex, photos, loadedImages, isInitialLoad]);

    // 썸네일 스트립 자동 스크롤 (선택된 썸네일이 중앙에 오도록)
    useEffect(() => {
        if (thumbnailStripRef.current) {
            const thumbnail = thumbnailStripRef.current.children[currentIndex];
            if (thumbnail) {
                const strip = thumbnailStripRef.current;
                const thumbnailWidth = thumbnail.offsetWidth;
                const thumbnailGap = 12.8; // 0.8rem = 12.8px (기본 폰트 크기 기준)
                const stripWidth = strip.offsetWidth;
                const thumbnailLeft = thumbnail.offsetLeft;
                const thumbnailCenter = thumbnailLeft + thumbnailWidth / 2;
                const scrollPosition = thumbnailCenter - stripWidth / 2;
                
                strip.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    // 터치 이벤트 핸들러
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    // 마우스 드래그 이벤트 핸들러
    const onMouseDown = (e) => {
        setIsDragging(true);
        setDragStart(e.clientX);
    };

    const onMouseMove = (e) => {
        if (!isDragging || !dragStart) return;
        // 드래그 중에는 기본 동작 방지하지 않음 (이미지 확대 등)
    };

    const onMouseUp = (e) => {
        if (!isDragging || !dragStart) return;
        
        const distance = dragStart - e.clientX;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
        
        setIsDragging(false);
        setDragStart(null);
    };

    // 휠 이벤트 핸들러 (수평 스크롤)
    const onWheel = (e) => {
        // 수평 스크롤 감지
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            if (e.deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    return (
        <section className="gallery">
            <div className="gallery-content">
                <h2 className="section-title">gallery</h2>

                {photos.length > 0 ? (
                    <div className="gallery-slider">
                        <div 
                            className="main-image-container"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onMouseLeave={() => {
                                setIsDragging(false);
                                setDragStart(null);
                            }}
                            onWheel={onWheel}
                        >
                            {!loadedImages.has(photos[currentIndex]) && showLoadingSpinner && (
                                <div className="image-loading-placeholder">
                                    <div className="image-loading-spinner"></div>
                                </div>
                            )}
                            <img
                                src={photos[currentIndex]}
                                alt={`갤러리 사진 ${currentIndex + 1}`}
                                className={`main-image ${loadedImages.has(photos[currentIndex]) ? 'loaded' : 'loading'} ${isDragging ? 'dragging' : ''}`}
                                loading={currentIndex === 0 ? "eager" : "lazy"}
                                decoding="async"
                                draggable="false"
                                fetchPriority={currentIndex === 0 ? "high" : "auto"}
                                style={{
                                    opacity: loadedImages.has(photos[currentIndex]) ? 1 : 0,
                                    transition: 'opacity 0.2s ease-in-out'
                                }}
                            />

                            <button className="nav-btn prev" onClick={prevSlide}>
                                &lt;
                            </button>
                            <button className="nav-btn next" onClick={nextSlide}>
                                &gt;
                            </button>
                        </div>

                        <div 
                            className="thumbnail-strip"
                            ref={thumbnailStripRef}
                        >
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={photo}
                                        alt={`썸네일 ${index + 1}`}
                                        className="thumbnail-image"
                                        loading={index < 6 ? "eager" : "lazy"}
                                        decoding="async"
                                        draggable="false"
                                        fetchPriority={index < 3 ? "high" : "auto"}
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="gallery-caption">
                            
                        </p>
                    </div>
                ) : (
                    <div className="gallery-placeholder">
                        <p>갤러리 이미지를 추가해주세요.</p>
                        <p className="gallery-instruction">
                            Gallery.jsx 파일의 photos 배열에 이미지 경로를 추가하세요.<br />
                            예: ['/gallery-1.webp', '/gallery-2.webp', ...]
                        </p>
                    </div>
                )}
            </div>

        </section>
    );
};

export default Gallery;
