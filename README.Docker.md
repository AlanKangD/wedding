# Docker 배포 가이드

## 환경 변수 설정

Docker 빌드 전에 서버에 `.env` 파일이 있어야 합니다.

### 서버에서 .env 파일 생성

```bash
# .env 파일 생성
cat > .env << 'EOF'
VITE_KAKAO_MAP_API_KEY=your_kakao_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF
```

## 빌드 및 실행

```bash
# Docker Compose로 빌드 및 실행
docker compose up -d --build

# 로그 확인
docker compose logs -f

# 컨테이너 중지
docker compose down
```

## 문제 해결

### 환경 변수가 적용되지 않는 경우

1. `.env` 파일이 서버에 있는지 확인
2. `.env` 파일의 값이 올바른지 확인
3. 빌드 후 재시작: `docker compose down && docker compose up -d --build`

### 포트 충돌

포트 3000이 이미 사용 중인 경우 `docker-compose.yml`에서 포트를 변경:

```yaml
ports:
  - "8080:80"  # 8080 포트로 변경
```
