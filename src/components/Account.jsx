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
            bank: '농협',
            account: '178408-51-002856',
            holder: '오다영'
        },
        {
            name: '오명훈',
            bank: '농협',
            account: '178408-51-002856',
            holder: '오명훈'
        },
        {
            name: '김연숙',
            bank: '농협',
            account: '178408-51-002856',
            holder: '김연숙'
        }
    ];

    // 탭 상태 관리
    const [activeTab, setActiveTab] = useState('groom');
    
    // 아코디언 상태 관리 (각 항목의 열림/닫힘 상태)
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (side, index) => {
        const key = `${side}-${index}`;
        const isCurrentlyExpanded = expandedItems[key];
        
        // 현재 항목이 열려있으면 닫기, 닫혀있으면 다른 항목들을 모두 닫고 현재 항목만 열기
        if (isCurrentlyExpanded) {
            // 현재 항목이 열려있으면 닫기
            setExpandedItems(prev => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
        } else {
            // 현재 항목이 닫혀있으면 다른 항목들을 모두 닫고 현재 항목만 열기
            setExpandedItems({ [key]: true });
        }
    };

    // 은행명을 은행 코드로 변환하는 매핑
    const bankCodeMap = {
        '농협': '011',
        'NH농협': '011',
        '국민은행': '004',
        'KB국민은행': '004',
        '신한은행': '088',
        '우리은행': '020',
        '하나은행': '081',
        'KEB하나은행': '081',
        'SC제일은행': '023',
        '한국씨티은행': '027',
        '대구은행': '031',
        '부산은행': '032',
        '광주은행': '034',
        '제주은행': '035',
        '전북은행': '037',
        '경남은행': '039',
        '새마을금고': '045',
        '신협': '048',
        '상호저축은행': '050',
        '카카오뱅크': '090',
        '토스뱅크': '092',
        'K뱅크': '089',
        'IBK기업은행': '003',
        '기업은행': '003',
        '수협은행': '007',
        '수협': '007',
    };

    // 계좌번호에서 하이픈 제거
    const formatAccountNumber = (account) => {
        return account.replace(/-/g, '');
    };

    // 은행명을 은행 코드로 변환
    const getBankCode = (bankName) => {
        return bankCodeMap[bankName] || '';
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(() => {
            alert('복사에 실패했습니다.');
        });
    };

    const openKakaoPay = (accountInfo) => {
        const { bank, account, holder } = accountInfo;
        
        // 계좌번호를 클립보드에 복사
        navigator.clipboard.writeText(account).then(() => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const bankCode = getBankCode(bank);
            const formattedAccount = formatAccountNumber(account);
            const encodedName = encodeURIComponent(holder);
            
            if (isMobile) {
                // 모바일: 카카오페이 앱 딥링크 시도 (계좌 정보 포함)
                let deepLink = 'kakaotalk://kakaopay/money/send';
                
                // 계좌 정보가 있으면 딥링크에 파라미터 추가
                if (bankCode && formattedAccount) {
                    deepLink = `kakaotalk://kakaopay/money/send?bank=${bankCode}&account=${formattedAccount}&name=${encodedName}`;
                }
                
                // 딥링크 시도
                window.location.href = deepLink;
                
                // 앱이 없거나 딥링크가 작동하지 않으면 웹으로 이동
                setTimeout(() => {
                    window.open('https://kakaopay.me', '_blank');
                }, 1000);
            } else {
                // 데스크톱: 카카오페이 웹으로 이동
                window.open('https://kakaopay.me', '_blank');
            }
            
            alert('계좌번호가 복사되었습니다. 카카오페이에서 송금해주세요.');
        }).catch(() => {
            alert('계좌번호 복사에 실패했습니다.');
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
                            <button
                                className="kakaopay-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openKakaoPay(account);
                                }}
                            >
                                <span>카카오페이로 보내기</span>
                            </button>
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

