import './Movie.css';

const Movie = () => {
    return (
        <section className="movie">
            <div className="movie-content">
                <h2 className="section-title">movie</h2>
                <div className="movie-container">
                    <div className="movie-placeholder">
                        <div className="play-button">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <circle cx="30" cy="30" r="30" fill="rgba(255, 255, 255, 0.9)"/>
                                <path d="M25 20L40 30L25 40V20Z" fill="#a3907c"/>
                            </svg>
                        </div>
                        <p className="movie-caption">영상이 준비중입니다</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Movie;

