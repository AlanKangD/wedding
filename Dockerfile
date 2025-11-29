# 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# .env 파일 복사 (빌드 시 환경 변수 사용)
# 주의: .dockerignore에서 .env를 제외하지 않았는지 확인
COPY .env .env 2>/dev/null || echo ".env 파일이 없습니다. 빌드 인자로 환경 변수를 전달하세요."

# 환경 변수를 빌드 인자로 받기 (docker-compose에서 전달)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_DATABASE_URL
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_KAKAO_MAP_API_KEY

# 환경 변수를 빌드 타임에 주입 (ARG 값이 있으면 사용, 없으면 .env 파일 사용)
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_DATABASE_URL=${VITE_FIREBASE_DATABASE_URL}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV VITE_KAKAO_MAP_API_KEY=${VITE_KAKAO_MAP_API_KEY}

# 빌드 전 환경 변수 확인 (디버깅용)
RUN echo "Building with Firebase Project ID: ${VITE_FIREBASE_PROJECT_ID}" || true
RUN echo "Building with Database URL: ${VITE_FIREBASE_DATABASE_URL}" || true

# 프로덕션 빌드
RUN npm run build

# 프로덕션 서빙 단계
FROM nginx:alpine

# 빌드된 파일을 nginx에 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]

