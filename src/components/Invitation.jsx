import './Invitation.css';

const Invitation = () => {
    return (
        <section className="invitation">
            <div className="invitation-content">
                <h2 className="section-title">invitation</h2>
                <p className="invitation-text">
                    서로가 마주보며 다져온 사랑을<br />
                    이제 함께 한 곳을 바라보며<br />
                    걸어가고자 합니다.<br />
                    저희 두 사람이 사랑의 이름으로<br />
                    지켜나갈 수 있도록<br />
                    앞날을 축복해 주시면<br />
                    고맙겠습니다.
                </p>
                <div className="divider"></div>
                <div className="names-section">
                    <div className="names-row">
                        <div className="person">
                            <span className="role">신랑</span>
                            <span className="name">강동원</span>
                        </div>
                        <div className="person">
                            <span className="role">신부</span>
                            <span className="name">오다영</span>
                        </div>
                    </div>
                    <div className="parents-section">
                        <div className="parents-group">
                            <div className="parent">
                                <span className="parent-role">아버지</span>
                                <span className="parent-name">강문봉</span>
                            </div>
                            <div className="parent">
                                <span className="parent-role">어머니</span>
                                <span className="parent-name">김미영</span>
                            </div>
                        </div>
                        <span className="parents-connector">의</span>
                        <div className="parents-group">
                            <div className="parent">
                                <span className="parent-role">아버지</span>
                                <span className="parent-name">오명훈</span>
                            </div>
                            <div className="parent">
                                <span className="parent-role">어머니</span>
                                <span className="parent-name">김연숙</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Invitation;
