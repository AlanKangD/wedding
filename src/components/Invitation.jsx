import './Invitation.css';

const Invitation = () => {
    return (
        <section className="invitation">
            <div className="invitation-content">
                <h2 className="section-title">invitation</h2>
                <p className="invitation-text">
                    서로의 하루에 스며들며 <br />
                    작은 기쁨과 위로를 나누던 두 사람이<br />
                    이제는 같은 길을 바라보며<br />
                    한 걸음, 한 걸음 함께 걸어가려 합니다.<br />

                    그동안 쌓아온 마음을 믿고<br />
                    앞으로의 계절도 함께 지켜가려 합니다.<br />
                    저희의 새로운 시작을 따뜻하게 축복해 주신다면<br />
                    더없는 기쁨이 될 것입니다.
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
                                <span className="parent-role">신랑 아버지</span>
                                <span className="parent-name">강문봉</span>
                            </div>
                            <div className="parent">
                                <span className="parent-role">신랑 어머니</span>
                                <span className="parent-name">김미영</span>
                            </div>
                        </div>
                        <span className="parents-connector"></span>
                        <div className="parents-group">
                            <div className="parent">
                                <span className="parent-role">신부 아버지</span>
                                <span className="parent-name">오명훈</span>
                            </div>
                            <div className="parent">
                                <span className="parent-role">신부 어머니</span>
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
