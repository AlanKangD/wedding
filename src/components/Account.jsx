import { useState } from 'react';
import './Account.css';

const Account = () => {
    // 신랑측 계좌 정보
    const groomAccounts = [
        {
            name: '강동원',
            bank: '농협',
            account: '178408-51-002856',
            holder: '강동원'
        },
        {
            name: '강문봉',
            bank: '농협',
            account: '178408-51-002856',
            holder: '강문봉'
        },
        {
            name: '김미영',
            bank: '농협',
            account: '178408-51-002856',
            holder: '김미영'
        }
    ];

    // 신부측 계좌 정보
    const brideAccounts = [
        {
            name: '오다영',
            bank: '',
            account: '',
            holder: '오다영'
        },
        {
            name: '오명훈',
            bank: '',
            account: '',
            holder: '오명훈'
        },
        {
            name: '김연숙',
            bank: '',
            account: '',
            holder: '김연숙'
        }
    ];

    // 탭 상태 관리
    const [activeTab, setActiveTab] = useState('groom');
    
    // 아코디언 상태 관리 (각 항목의 열림/닫힘 상태)
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (side, index) => {
        const key = `${side}-${index}`;
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(() => {
            alert('복사에 실패했습니다.');
        });
    };

    const renderAccountList = (accounts, side) => {
        return accounts.map((account, index) => {
            const key = `${side}-${index}`;
            const isExpanded = expandedItems[key];
            const hasAccount = account.bank && account.account;

            return (
                <div key={key} className="account-item">
                    <button
                        className="account-item-header"
                        onClick={() => toggleItem(side, index)}
                    >
                        <span className="account-item-name">{account.name}</span>
                        <span className={`account-item-chevron ${isExpanded ? 'expanded' : ''}`}>
                            {isExpanded ? '▲' : '▼'}
                        </span>
                    </button>
                    
                    {isExpanded && hasAccount && (
                        <div className="account-item-content">
                            <div className="account-info-row">
                                <span className="account-bank-number">
                                    {account.bank} {account.account}
                                </span>
                                <button
                                    className="account-copy-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(account.account);
                                    }}
                                    title="계좌번호 복사"
                                >
                                   <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2z"/>
                                    <rect x="5" y="6" width="14" height="16" rx="2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <section className="account">
            <div className="account-content">
                <h2 className="section-title">account</h2>
                <h3 className="account-main-title">축하의 마음 전하기</h3>
                <p className="account-subtitle">
                    축하의 마음을 담아 축의금을 전달해 보세요.
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

                <div className="account-lists">
                    {activeTab === 'groom' && (
                        <div className="account-list">
                            {renderAccountList(groomAccounts, 'groom')}
                        </div>
                    )}
                    {activeTab === 'bride' && (
                        <div className="account-list">
                            {renderAccountList(brideAccounts, 'bride')}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Account;

