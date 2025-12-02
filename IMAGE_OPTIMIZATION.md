# 이미지 최적화 가이드

## 적용된 최적화 방법

### 1. Lazy Loading (지연 로딩)
- 갤러리 썸네일과 메인 이미지에 `loading="lazy"` 속성 추가
- 화면에 보이는 이미지만 로드하여 초기 로딩 시간 단축

### 2. 이미지 프리로딩
- 현재 이미지와 다음 이미지를 미리 로드
- 사용자가 다음 이미지를 볼 때 즉시 표시

### 3. 로딩 상태 표시
- 이미지 로딩 중 스피너 표시
- 부드러운 페이드인 애니메이션

### 4. 비동기 디코딩
- `decoding="async"` 속성으로 이미지 디코딩을 비동기 처리
- 메인 스레드 블로킹 방지

## 추가 최적화 방법

### 1. 이미지 압축 (권장)
고화질 이미지를 압축하여 파일 크기 감소:

```bash
# ImageMagick 사용 예시
convert main-photo.jpg -quality 85 -resize 1200x main-photo-optimized.jpg

# 또는 온라인 도구 사용
# - TinyPNG: https://tinypng.com/
# - Squoosh: https://squoosh.app/
```

### 2. WebP 형식 변환 (최고 성능)
WebP 형식은 JPEG보다 25-35% 작은 파일 크기:

```bash
# cwebp 사용
cwebp -q 80 main-photo.jpg -o main-photo.webp
```

컴포넌트에서 WebP 지원 확인:
```jsx
<picture>
  <source srcSet="/main-photo.webp" type="image/webp" />
  <img src="/main-photo.jpg" alt="메인 사진" />
</picture>
```

### 3. Responsive Images
화면 크기에 따라 다른 이미지 제공:

```jsx
<img
  srcSet="/main-photo-small.jpg 400w,
          /main-photo-medium.jpg 800w,
          /main-photo-large.jpg 1200w"
  sizes="(max-width: 400px) 400px,
         (max-width: 800px) 800px,
         1200px"
  src="/main-photo-medium.jpg"
  alt="메인 사진"
/>
```

### 4. 이미지 CDN 사용
CDN을 통해 이미지 전송 속도 향상

### 5. Nginx 이미지 압축
nginx.conf에 이미지 압축 설정 추가 (이미 적용됨)

## 권장 이미지 크기

- **메인 사진**: 최대 1200px 너비, 85% 품질
- **갤러리 메인**: 최대 1000px 너비, 85% 품질
- **썸네일**: 최대 200px 너비, 80% 품질

## 성능 측정

브라우저 개발자 도구에서 확인:
1. Network 탭: 이미지 로딩 시간 확인
2. Lighthouse: 이미지 최적화 점수 확인
3. Performance 탭: 렌더링 성능 확인

