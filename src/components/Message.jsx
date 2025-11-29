import { useState } from 'react';
import './Message.css';

const Message = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            name: '홍길동',
            date: '2024.01.01.13:13:10',
            message: '축하합니다~행복하게 사세요!',
        },
        {
            id: 2,
            name: '김철수',
            date: '2024.01.01.13:13:10',
            message: '정말 축하드립니다! 행복하세요 :)',
        },
        {
            id: 3,
            name: '이영희',
            date: '2024.01.01.13:13:10',
            message: '축하드려요 행복하게 사세요^^',
        },
    ]);

    const [newMessage, setNewMessage] = useState({
        name: '',
        message: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;
    const totalPages = Math.ceil(messages.length / messagesPerPage);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.name || !newMessage.message) return;

        const message = {
            id: messages.length + 1,
            name: newMessage.name,
            date: new Date().toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).replace(/\./g, '.').replace(/,/g, ''),
            message: newMessage.message,
        };

        setMessages([message, ...messages]);
        setNewMessage({ name: '', message: '' });
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
                    {displayedMessages.map((msg) => (
                        <div key={msg.id} className="message-item">
                            <div className="message-header">
                                <span className="message-name">{msg.name}</span>
                                <span className="message-date">{msg.date}</span>
                            </div>
                            <p className="message-text">{msg.message}</p>
                        </div>
                    ))}
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

