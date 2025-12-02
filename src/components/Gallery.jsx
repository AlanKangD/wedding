import { useEffect, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    // 갤러리 이미지 경로 배열
    const photos = [
        '/gallery-1.jpg',
        '/gallery-2.jpg',
        '/gallery-3.jpg',
        '/gallery-4.jpg',
        '/gallery-5.jpg',
        '/gallery-6.jpg',
        '/gallery-7.jpg',
        '/gallery-8.jpg',
        '/gallery-9.jpg',
        '/gallery-10.jpg',

    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [preloadedImages, setPreloadedImages] = useState(new Set());

    // 현재 이미지와 다음 이미지 프리로딩
    useEffect(() => {
        // 현재 이미지 로드
        if (!loadedImages.has(photos[currentIndex])) {
            const img = new Image();
            img.src = photos[currentIndex];
            img.onload = () => {
                setLoadedImages(prev => new Set([...prev, photos[currentIndex]]));
            };
        }

        // 다음 이미지 프리로딩
        const nextIndex = (currentIndex + 1) % photos.length;
        if (!preloadedImages.has(photos[nextIndex])) {
            const img = new Image();
            img.src = photos[nextIndex];
            img.onload = () => {
                setPreloadedImages(prev => new Set([...prev, photos[nextIndex]]));
            };
        }
    }, [currentIndex, photos, loadedImages, preloadedImages]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <section className="gallery">
            <div className="gallery-content">
                <h2 className="section-title">gallery</h2>

                {photos.length > 0 ? (
                    <div className="gallery-slider">
                        <div className="main-image-container">
                            {!loadedImages.has(photos[currentIndex]) && (
                                <div className="image-loading-placeholder">
                                    <div className="image-loading-spinner"></div>
                                </div>
                            )}
                            <img
                                src={photos[currentIndex]}
                                alt={`갤러리 사진 ${currentIndex + 1}`}
                                className={`main-image ${loadedImages.has(photos[currentIndex]) ? 'loaded' : 'loading'}`}
                                loading="lazy"
                                decoding="async"
                            />

                            <button className="nav-btn prev" onClick={prevSlide}>
                                &lt;
                            </button>
                            <button className="nav-btn next" onClick={nextSlide}>
                                &gt;
                            </button>
                        </div>

                        <div className="thumbnail-strip">
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
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="gallery-caption">
                            갤러리 사진을 확인해주세요.
                        </p>
                    </div>
                ) : (
                    <div className="gallery-placeholder">
                        <p>갤러리 이미지를 추가해주세요.</p>
                        <p className="gallery-instruction">
                            Gallery.jsx 파일의 photos 배열에 이미지 경로를 추가하세요.<br />
                            예: ['/gallery-1.jpg', '/gallery-2.jpg', ...]
                        </p>
                    </div>
                )}
            </div>

        </section>
    );
};

export default Gallery;
