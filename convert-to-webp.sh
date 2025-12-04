#!/bin/bash

# 이미지를 WebP 형식으로 변환하는 스크립트
# 사용법: ./convert-to-webp.sh

# ImageMagick이 설치되어 있는지 확인
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "ImageMagick이 설치되어 있지 않습니다."
    echo "macOS: brew install imagemagick"
    echo "Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# cwebp가 설치되어 있는지 확인 (더 나은 품질)
if command -v cwebp &> /dev/null; then
    echo "cwebp를 사용하여 변환합니다..."
    CONVERTER="cwebp"
else
    echo "ImageMagick을 사용하여 변환합니다..."
    CONVERTER="magick"
fi

# public 디렉토리로 이동
cd "$(dirname "$0")/public" || exit 1

# JPG 파일들을 WebP로 변환
for file in *.jpg; do
    if [ -f "$file" ]; then
        filename="${file%.*}"
        echo "변환 중: $file -> ${filename}.webp"
        
        if [ "$CONVERTER" = "cwebp" ]; then
            # cwebp 사용 (더 나은 품질, 작은 파일 크기)
            cwebp -q 85 "$file" -o "${filename}.webp"
        else
            # ImageMagick 사용
            magick "$file" -quality 85 "${filename}.webp"
        fi
        
        if [ $? -eq 0 ]; then
            echo "✓ 성공: ${filename}.webp"
        else
            echo "✗ 실패: $file"
        fi
    fi
done

echo ""
echo "변환 완료!"
echo "원본 JPG 파일은 그대로 유지됩니다."
echo "변환된 WebP 파일을 확인한 후, 필요시 원본 JPG 파일을 삭제할 수 있습니다."

