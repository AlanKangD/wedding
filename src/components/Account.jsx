import { useState } from 'react';
import './Account.css';

const Account = () => {
    const [activeTab, setActiveTab] = useState('groom');

    const groomAccount = {
        bank: '국민은행',
        account: '123-456-789012',
        holder: '신랑이름',
    };

    const brideAccount = {
        bank: '신한은행',
        account: '987-654-321098',
        holder: '신부이름',
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(() => {
            alert('복사에 실패했습니다.');
        });
    };

    const currentAccount = activeTab === 'groom' ? groomAccount : brideAccount;

    return (
        <section className="account">
            <div className="account-content">
                <h2 className="section-title">account</h2>
                <p className="account-message">
                    참석이 어려우신 분들을 위해<br />
                    계좌번호를 안내해 드립니다.
                </p>

                <div className="account-tabs">
                    <button
                        className={`account-tab ${activeTab === 'groom' ? 'active' : ''}`}
                        onClick={() => setActiveTab('groom')}
                    >
                        신랑측 계좌
                    </button>
                    <button
                        className={`account-tab ${activeTab === 'bride' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bride')}
                    >
                        신부측 계좌
                    </button>
                </div>

                <div className="account-info-card">
                    <div className="account-detail">
                        <div className="account-row">
                            <span className="account-label">은행</span>
                            <span className="account-value">{currentAccount.bank}</span>
                        </div>
                        <div className="account-row">
                            <span className="account-label">계좌번호</span>
                            <span className="account-value">{currentAccount.account}</span>
                        </div>
                        <div className="account-row">
                            <span className="account-label">예금주</span>
                            <span className="account-value">{currentAccount.holder}</span>
                        </div>
                    </div>
                    <button 
                        className="copy-account-btn"
                        onClick={() => copyToClipboard(currentAccount.account)}
                    >
                        계좌번호 복사
                    </button>
                </div>

                <p className="account-note">
                    * 계좌번호가 복사되었습니다.
                </p>
            </div>
        </section>
    );
};

export default Account;

