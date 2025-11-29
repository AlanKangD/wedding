# Docker 배포 가이드

## 빌드 및 실행

### Docker Compose 사용 (권장)

```bash
# 이미지 빌드 및 컨테이너 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 컨테이너 중지
docker-compose down
```

### Docker 명령어 직접 사용

```bash
# 이미지 빌드
docker build -t wedding-app .

# 컨테이너 실행
docker run -d -p 3000:80 --name wedding-app wedding-app

# 컨테이너 중지 및 제거
docker stop wedding-app
docker rm wedding-app
```

## 접속

- 로컬: http://localhost:3000
- 서버: http://서버IP:3000

## 포트 변경

`docker-compose.yml` 파일에서 포트를 변경할 수 있습니다:

```yaml
ports:
  - "원하는포트:80"
```

## 환경 변수

프로덕션 환경에서는 `.env` 파일의 환경 변수가 빌드 시점에 포함됩니다.

카카오맵 API 키 등은 빌드 전에 `.env` 파일에 설정해야 합니다.

## 문제 해결

### 컨테이너 로그 확인
```bash
docker-compose logs wedding
```

### 컨테이너 내부 접속
```bash
docker exec -it wedding-app sh
```

