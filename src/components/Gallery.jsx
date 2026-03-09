import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    const photos = [
        '/gallery-1.webp',
        '/gallery-2.webp',
        '/gallery-3.webp',
        '/gallery-4.webp',
        '/gallery-5.webp',
        '/main-photo.webp',
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

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const thumbnailStripRef = useRef(null);
    const imageCacheRef = useRef(new Map());

    const touchStartXRef = useRef(null);
    const touchStartYRef = useRef(null);
    const touchStartTimeRef = useRef(null);
    const dragOffsetRef = useRef(0);
    const isDraggingRef = useRef(false);
    const isTransitioningRef = useRef(false);
    const isHorizontalRef = useRef(null);
    const lastWheelRef = useRef(0);
    const slideTimerRef = useRef(null);
    const slideGenRef = useRef(0);

    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    const nextIndex = (currentIndex + 1) % photos.length;

    useLayoutEffect(() => {
        if (trackRef.current) {
            trackRef.current.style.transition = 'none';
            trackRef.current.style.transform = 'translateX(-33.333%)';
        }
        isTransitioningRef.current = false;
    }, [currentIndex]);

    useEffect(() => {
        const preloadImages = async () => {
            const firstImg = new Image();
            firstImg.src = photos[0];

            if (firstImg.complete) {
                setLoadedImages(prev => new Set([...prev, photos[0]]));
                imageCacheRef.current.set(photos[0], true);
            } else {
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

            const loadPromises = photos.slice(1).map((photo) => {
                return new Promise((resolve) => {
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
                    img.onerror = () => resolve();
                    img.src = photo;
                });
            });

            await Promise.all(loadPromises);
            setIsInitialLoad(false);
            setShowLoadingSpinner(false);
        };

        preloadImages();
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        if (loadedImages.has(photos[currentIndex])) {
            setShowLoadingSpinner(false);
            return;
        }

        const img = new Image();
        img.src = photos[currentIndex];

        if (img.complete) {
            setLoadedImages(prev => new Set([...prev, photos[currentIndex]]));
            setShowLoadingSpinner(false);
        } else {
            const spinnerTimeout = setTimeout(() => setShowLoadingSpinner(true), 200);
            img.onload = () => {
                clearTimeout(spinnerTimeout);
                setShowLoadingSpinner(false);
                setLoadedImages(prev => new Set([...prev, photos[currentIndex]]));
            };
        }

        [nextIndex, prevIndex].forEach(idx => {
            if (!loadedImages.has(photos[idx])) {
                const preImg = new Image();
                preImg.src = photos[idx];
                preImg.onload = () => {
                    setLoadedImages(prev => new Set([...prev, photos[idx]]));
                };
            }
        });
    }, [currentIndex, photos, loadedImages, isInitialLoad, nextIndex, prevIndex]);

    useEffect(() => {
        if (thumbnailStripRef.current) {
            const thumbnail = thumbnailStripRef.current.children[currentIndex];
            if (thumbnail) {
                const strip = thumbnailStripRef.current;
                const thumbnailCenter = thumbnail.offsetLeft + thumbnail.offsetWidth / 2;
                strip.scrollTo({
                    left: thumbnailCenter - strip.offsetWidth / 2,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentIndex]);

    const animateSlide = useCallback((targetTransform, indexUpdater) => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        if (slideTimerRef.current) {
            clearTimeout(slideTimerRef.current);
        }

        const gen = ++slideGenRef.current;

        const containerWidth = containerRef.current?.offsetWidth || 400;
        const draggedDistance = Math.abs(dragOffsetRef.current);
        const remainingRatio = Math.max(0.3, 1 - draggedDistance / containerWidth);
        const duration = Math.round(remainingRatio * 300);

        if (trackRef.current) {
            trackRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            trackRef.current.style.transform = targetTransform;
        }

        slideTimerRef.current = setTimeout(() => {
            if (slideGenRef.current !== gen) return;
            indexUpdater();
        }, duration + 20);
    }, []);

    const goToNext = useCallback(() => {
        animateSlide('translateX(-66.666%)', () => {
            setCurrentIndex(prev => (prev + 1) % photos.length);
        });
    }, [animateSlide, photos.length]);

    const goToPrev = useCallback(() => {
        animateSlide('translateX(0%)', () => {
            setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
        });
    }, [animateSlide, photos.length]);

    const snapBack = useCallback(() => {
        if (trackRef.current) {
            trackRef.current.style.transition = 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            trackRef.current.style.transform = 'translateX(-33.333%)';
        }
    }, []);

    const resolveDrag = useCallback(() => {
        isDraggingRef.current = false;
        const offset = dragOffsetRef.current;
        const elapsed = Date.now() - (touchStartTimeRef.current || Date.now());
        const velocity = Math.abs(offset) / Math.max(elapsed, 1);

        const containerWidth = containerRef.current?.offsetWidth || 400;
        const swipeRatio = Math.abs(offset) / containerWidth;

        if (swipeRatio > 0.2 || (velocity > 0.3 && Math.abs(offset) > 20)) {
            if (offset < 0) goToNext();
            else goToPrev();
        } else {
            snapBack();
        }

        touchStartXRef.current = null;
        touchStartYRef.current = null;
        isHorizontalRef.current = null;
    }, [goToNext, goToPrev, snapBack]);

    const onTouchStart = useCallback((e) => {
        if (isTransitioningRef.current) return;
        touchStartXRef.current = e.targetTouches[0].clientX;
        touchStartYRef.current = e.targetTouches[0].clientY;
        touchStartTimeRef.current = Date.now();
        dragOffsetRef.current = 0;
        isDraggingRef.current = true;
        isHorizontalRef.current = null;

        if (trackRef.current) {
            trackRef.current.style.transition = 'none';
        }
    }, []);

    const onTouchMove = useCallback((e) => {
        if (!isDraggingRef.current || touchStartXRef.current === null) return;

        const dx = e.targetTouches[0].clientX - touchStartXRef.current;
        const dy = e.targetTouches[0].clientY - (touchStartYRef.current || 0);

        if (isHorizontalRef.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
            isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
        }

        if (!isHorizontalRef.current) return;

        const containerWidth = containerRef.current?.offsetWidth || 400;
        const clampedDx = Math.max(-containerWidth * 0.85, Math.min(containerWidth * 0.85, dx));

        dragOffsetRef.current = clampedDx;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(calc(-33.333% + ${clampedDx}px))`;
        }
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!isDraggingRef.current) return;
        resolveDrag();
    }, [resolveDrag]);

    const onMouseDown = useCallback((e) => {
        if (isTransitioningRef.current) return;
        e.preventDefault();
        touchStartXRef.current = e.clientX;
        touchStartTimeRef.current = Date.now();
        dragOffsetRef.current = 0;
        isDraggingRef.current = true;

        if (trackRef.current) {
            trackRef.current.style.transition = 'none';
        }
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!isDraggingRef.current || touchStartXRef.current === null) return;
        const dx = e.clientX - touchStartXRef.current;

        const containerWidth = containerRef.current?.offsetWidth || 400;
        const clampedDx = Math.max(-containerWidth * 0.85, Math.min(containerWidth * 0.85, dx));

        dragOffsetRef.current = clampedDx;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(calc(-33.333% + ${clampedDx}px))`;
        }
    }, []);

    const onMouseUp = useCallback(() => {
        if (!isDraggingRef.current) return;
        resolveDrag();
    }, [resolveDrag]);

    const onMouseLeave = useCallback(() => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            dragOffsetRef.current = 0;
            snapBack();
            touchStartXRef.current = null;
            isHorizontalRef.current = null;
        }
    }, [snapBack]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (isTransitioningRef.current) return;
            const now = Date.now();
            if (now - lastWheelRef.current < 500) return;

            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
                e.preventDefault();
                lastWheelRef.current = now;
                dragOffsetRef.current = 0;
                if (e.deltaX > 0) goToNext();
                else goToPrev();
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [goToNext, goToPrev]);

    useEffect(() => {
        return () => {
            if (slideTimerRef.current) {
                clearTimeout(slideTimerRef.current);
            }
        };
    }, []);

    return (
        <section className="gallery">
            <div className="gallery-content">
                <h2 className="section-title">gallery</h2>

                {photos.length > 0 ? (
                    <div className="gallery-slider">
                        <div
                            className="main-image-container"
                            ref={containerRef}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onMouseLeave={onMouseLeave}
                        >
                            {!loadedImages.has(photos[currentIndex]) && showLoadingSpinner && (
                                <div className="image-loading-placeholder">
                                    <div className="image-loading-spinner"></div>
                                </div>
                            )}
                            <div className="slide-track" ref={trackRef}>
                                <div className="slide">
                                    <img
                                        src={photos[prevIndex]}
                                        alt={`갤러리 사진 ${prevIndex + 1}`}
                                        className="slide-image"
                                        draggable="false"
                                        decoding="async"
                                    />
                                </div>
                                <div className="slide">
                                    <img
                                        src={photos[currentIndex]}
                                        alt={`갤러리 사진 ${currentIndex + 1}`}
                                        className="slide-image"
                                        draggable="false"
                                        decoding="async"
                                    />
                                </div>
                                <div className="slide">
                                    <img
                                        src={photos[nextIndex]}
                                        alt={`갤러리 사진 ${nextIndex + 1}`}
                                        className="slide-image"
                                        draggable="false"
                                        decoding="async"
                                    />
                                </div>
                            </div>
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
