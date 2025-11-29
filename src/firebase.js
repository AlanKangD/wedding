import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase 설정
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// 환경 변수 확인 (개발 모드에서만)
if (import.meta.env.DEV) {
    console.log('Firebase Config:', {
        apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
        authDomain: firebaseConfig.authDomain || 'missing',
        databaseURL: firebaseConfig.databaseURL || 'missing',
        projectId: firebaseConfig.projectId || 'missing',
        storageBucket: firebaseConfig.storageBucket || 'missing',
        messagingSenderId: firebaseConfig.messagingSenderId || 'missing',
        appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 10)}...` : 'missing',
    });
}

// 필수 값 확인
if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
    console.error('Firebase 설정이 완전하지 않습니다. 환경 변수를 확인하세요.');
}

// Firebase 초기화
let app;
let database;

try {
    // 필수 값 확인
    if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
        throw new Error('Firebase 설정이 완전하지 않습니다. projectId와 databaseURL이 필요합니다.');
    }
    
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    
    console.log('Firebase 초기화 성공');
} catch (error) {
    console.error('Firebase 초기화 실패:', error);
    console.error('Firebase Config:', {
        hasApiKey: !!firebaseConfig.apiKey,
        hasAuthDomain: !!firebaseConfig.authDomain,
        hasDatabaseURL: !!firebaseConfig.databaseURL,
        hasProjectId: !!firebaseConfig.projectId,
        hasStorageBucket: !!firebaseConfig.storageBucket,
        hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
        hasAppId: !!firebaseConfig.appId,
    });
    throw error;
}

export { database };
export default app;

