import { useState } from 'react';
import './RSVP.css';

const RSVP = () => {
    const [formData, setFormData] = useState({
        name: '',
        attendance: '',
        guestCount: '',
        message: '',
        side: 'groom', // 신랑측 or 신부측
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 실제 서버 전송 로직 추가
        console.log('RSVP 데이터:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: '',
                attendance: '',
                guestCount: '',
                message: '',
                side: 'groom',
            });
        }, 3000);
    };

    return (
        <section className="rsvp">
            <div className="rsvp-content">
                <h2 className="section-title">rsvp</h2>
                <p className="rsvp-message">
                    참석 여부를 알려주시면<br />
                    더욱 정성스럽게 준비하겠습니다.<br />
                    소중한 마음만으로도 충분합니다.
                </p>

                {!submitted ? (
                    <form className="rsvp-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="이름을 입력해주세요"
                            />
                        </div>

                        <div className="form-group">
                            <label>참석 여부</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="yes"
                                        checked={formData.attendance === 'yes'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>참석합니다</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="no"
                                        checked={formData.attendance === 'no'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>참석하지 못합니다</span>
                                </label>
                            </div>
                        </div>

                        {formData.attendance === 'yes' && (
                            <div className="form-group">
                                <label htmlFor="guestCount">참석 인원</label>
                                <select
                                    id="guestCount"
                                    name="guestCount"
                                    value={formData.guestCount}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="1">1명</option>
                                    <option value="2">2명</option>
                                    <option value="3">3명 이상</option>
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="side">어느 쪽 지인인가요?</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="side"
                                        value="groom"
                                        checked={formData.side === 'groom'}
                                        onChange={handleChange}
                                    />
                                    <span>신랑측</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="side"
                                        value="bride"
                                        checked={formData.side === 'bride'}
                                        onChange={handleChange}
                                    />
                                    <span>신부측</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">축하 메시지 (선택사항)</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="축하 메시지를 남겨주세요"
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            제출하기
                        </button>
                    </form>
                ) : (
                    <div className="rsvp-success">
                        <p className="success-message">
                            참석 여부가 등록되었습니다.<br />
                            감사합니다!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RSVP;
