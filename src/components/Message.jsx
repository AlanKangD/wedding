import { off, onValue, push, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../firebase';
import './Message.css';

const Message = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newMessage, setNewMessage] = useState({
        name: '',
        message: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;
    const totalPages = Math.ceil(messages.length / messagesPerPage);

    // Firebase에서 메시지 불러오기
    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        
        // 실시간으로 메시지 변경 감지
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Firebase에서 가져온 데이터를 배열로 변환 (최신순 정렬)
                const messagesArray = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    .sort((a, b) => {
                        // 날짜 기준 내림차순 정렬 (최신순)
                        return new Date(b.date) - new Date(a.date);
                    });
                setMessages(messagesArray);
            } else {
                setMessages([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('메시지 불러오기 실패:', error);
            setLoading(false);
        });

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
            off(messagesRef);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.name || !newMessage.message) return;

        const message = {
            name: newMessage.name,
            date: new Date().toISOString(), // ISO 형식으로 저장
            displayDate: new Date().toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).replace(/\./g, '.').replace(/,/g, ''),
            message: newMessage.message,
        };

        try {
            // Firebase에 메시지 추가
            const messagesRef = ref(database, 'messages');
            await push(messagesRef, message);
            setNewMessage({ name: '', message: '' });
        } catch (error) {
            console.error('메시지 저장 실패:', error);
            alert('메시지 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const displayedMessages = messages.slice(
        (currentPage - 1) * messagesPerPage,
        currentPage * messagesPerPage
    );

    return (
        <section className="message">
            <div className="message-content">
                <h2 className="section-title">message</h2>
                <p className="message-subtitle">축하 메시지를 남겨주세요.</p>

                <form className="message-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="이름"
                        value={newMessage.name}
                        onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                        required
                        className="message-input"
                    />
                    <textarea
                        placeholder="메시지를 입력해주세요."
                        value={newMessage.message}
                        onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                        required
                        className="message-textarea"
                        rows="3"
                    />
                    <button type="submit" className="message-submit-btn">
                        등록하기
                    </button>
                </form>

                <div className="messages-list">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                            메시지를 불러오는 중...
                        </div>
                    ) : displayedMessages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                            아직 등록된 메시지가 없습니다.
                        </div>
                    ) : (
                        displayedMessages.map((msg) => (
                        <div key={msg.id} className="message-item">
                            <div className="message-header">
                                <span className="message-name">{msg.name}</span>
                                <span className="message-date">{msg.displayDate || msg.date}</span>
                            </div>
                            <p className="message-text">{msg.message}</p>
                        </div>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Message;

