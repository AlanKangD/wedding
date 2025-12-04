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

// 필수 값 확인
if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
    // Firebase 설정이 완전하지 않음
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
} catch (error) {
    throw error;
}

export { database };
export default app;

