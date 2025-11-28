import { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    const photos = [1, 2, 3, 4, 5, 6];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="gallery">
            <div className="gallery-content">
                <h2 className="section-title">gallery</h2>

                <div className="gallery-slider">
                    <div className="main-image-container">
                        <div 
                            className="main-image"
                            onClick={openModal}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>사진 {photos[currentIndex]}</span>
                        </div>

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
                                key={photo}
                                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <span>{photo}</span>
                            </div>
                        ))}
                    </div>

                    <p className="gallery-caption">
                        이미지를 클릭하시면 확대보기가 가능합니다.
                    </p>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ×
                        </button>
                        <div className="modal-image">
                            <span>사진 {photos[currentIndex]} (확대)</span>
                        </div>
                        <div className="modal-nav">
                            <button className="modal-nav-btn" onClick={prevSlide}>
                                &lt;
                            </button>
                            <button className="modal-nav-btn" onClick={nextSlide}>
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
