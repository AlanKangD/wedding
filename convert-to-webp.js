#!/usr/bin/env node

/**
 * 이미지를 WebP 형식으로 변환하는 Node.js 스크립트
 * 사용법: node convert-to-webp.js
 * 또는: npm run convert:webp (package.json에 스크립트 추가 후)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, 'public');

// cwebp가 설치되어 있는지 확인
function checkCwebp() {
    try {
        execSync('which cwebp', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// ImageMagick이 설치되어 있는지 확인
function checkImageMagick() {
    try {
        execSync('which magick', { stdio: 'ignore' });
        return 'magick';
    } catch {
        try {
            execSync('which convert', { stdio: 'ignore' });
            return 'convert';
        } catch {
            return null;
        }
    }
}

// 이미지 변환 함수
function convertToWebp(inputFile, outputFile, converter) {
    try {
        if (converter === 'cwebp') {
            execSync(`cwebp -q 85 "${inputFile}" -o "${outputFile}"`, { stdio: 'inherit' });
        } else if (converter === 'magick') {
            execSync(`magick "${inputFile}" -quality 85 "${outputFile}"`, { stdio: 'inherit' });
        } else if (converter === 'convert') {
            execSync(`convert "${inputFile}" -quality 85 "${outputFile}"`, { stdio: 'inherit' });
        }
        return true;
    } catch (error) {
        console.error(`변환 실패: ${inputFile}`, error.message);
        return false;
    }
}

// 메인 함수
function main() {
    console.log('🖼️  이미지를 WebP 형식으로 변환합니다...\n');

    // 변환 도구 확인
    let converter = null;
    if (checkCwebp()) {
        converter = 'cwebp';
        console.log('✓ cwebp를 사용합니다 (권장)\n');
    } else {
        const magick = checkImageMagick();
        if (magick) {
            converter = magick;
            console.log(`✓ ImageMagick (${magick})을 사용합니다\n`);
        } else {
            console.error('❌ 이미지 변환 도구가 설치되어 있지 않습니다.');
            console.error('\n설치 방법:');
            console.error('  macOS: brew install webp imagemagick');
            console.error('  Ubuntu: sudo apt-get install webp imagemagick');
            console.error('\n또는 convert-to-webp.sh 스크립트를 사용하세요.');
            process.exit(1);
        }
    }

    // public 디렉토리의 JPG 파일 찾기
    const files = fs.readdirSync(publicDir)
        .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
        .map(file => ({
            input: path.join(publicDir, file),
            output: path.join(publicDir, file.replace(/\.(jpg|jpeg)$/i, '.webp')),
            name: file
        }));

    if (files.length === 0) {
        console.log('변환할 JPG 파일을 찾을 수 없습니다.');
        return;
    }

    console.log(`총 ${files.length}개의 파일을 변환합니다:\n`);

    let successCount = 0;
    let failCount = 0;

    // 각 파일 변환
    files.forEach(({ input, output, name }) => {
        const outputName = path.basename(output);
        process.stdout.write(`변환 중: ${name} -> ${outputName}... `);
        
        if (convertToWebp(input, output, converter)) {
            console.log('✓ 성공');
            successCount++;
        } else {
            console.log('✗ 실패');
            failCount++;
        }
    });

    console.log(`\n변환 완료!`);
    console.log(`  성공: ${successCount}개`);
    if (failCount > 0) {
        console.log(`  실패: ${failCount}개`);
    }
    console.log('\n원본 JPG 파일은 그대로 유지됩니다.');
    console.log('변환된 WebP 파일을 확인한 후, 필요시 원본 JPG 파일을 삭제할 수 있습니다.');
}

main();

