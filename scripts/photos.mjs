// 원본 사진(웨딩/ 폴더, 저장소에는 올리지 않음)을 웹용 WebP로 줄여 assets/photos 에 저장합니다.
// 사용: npm install && npm run photos            (전부 다시 만들기)
//       npm run photos -- portrait-bride cover  (적은 id 만 다시 만들기)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = path.resolve('웨딩/웨딩');
const only = process.argv.slice(2);
const output = path.resolve('assets/photos');
const sky = '벨루어/01. 셀렉/01. 깔끔한색감';
const pro = '벨루어/02. 작가셀렉/01. 깔끔한색감';
const studio = '모스앤코튼/인화용';

// [id, 원본 경로, 옵션] — crop 은 원본 대비 비율(left, top, width, height)입니다.
const photos = [
  ['cover', `${studio}/COT_9384.jpg`, { large: true }],
  ['closing', `${sky}/DSC02646 0.jpg`, { large: true }],
  ['portrait-bride', `${studio}/MOS_6705.jpg`, { crop: [0.115, 0.445, 0.38, 0.3404] }],
  ['portrait-groom', `${studio}/MOS_6705.jpg`, { crop: [0.5, 0.445, 0.38, 0.3404] }],
  ['shades-bride', `${studio}/MOS_6983.jpg`, { crop: [0.19, 0.13, 0.32, 0.2844] }],
  ['shades-groom', `${studio}/MOS_6983.jpg`, { crop: [0.48, 0.02, 0.32, 0.2844] }],
  ['studio-shades-close', `${studio}/MOS_7025.jpg`],
  ['studio-glance', `${studio}/MOS_6397.jpg`],
  ['studio-ribbon', `${studio}/MOS_6653.jpg`],
  ['studio-wink', `${studio}/COT_9078.jpg`],
  ['studio-confetti', `${studio}/COT_9409.jpg`],
  ['studio-sunglasses', `${studio}/MOS_7003.jpg`],
  ['studio-veil', `${studio}/MOS_6971.jpg`],
  ['noon-jump', `${sky}/DSC02694 0.jpg`],
  ['noon-lift', `${sky}/DSC04718 0.jpg`],
  ['noon-hearts', `${pro}/DSC04760 0.jpg`],
  ['noon-peace', `${pro}/DSC04674 0.jpg`],
  ['noon-bunny', `${pro}/DSC02757 0.jpg`],
  ['noon-mirror', `${pro}/DSC02941 0.jpg`],
  ['noon-laugh', `${pro}/DSC04623 0.jpg`],
  ['field-bubbles-wide', `${sky}/DSC04843 0.jpg`],
  ['field-kiss', `${sky}/DSC03313 0.jpg`],
  ['field-flowers', `${pro}/DSC03161 0.jpg`],
  ['field-bubbles', `${sky}/DSC04781 0.jpg`],
  ['field-hearts', `${pro}/DSC05022 0.jpg`],
  ['field-lean', `${pro}/DSC03296 0.jpg`],
  ['field-run', `${pro}/DSC04910 0.jpg`],
  ['alley-ginkgo', `${studio}/COT_0320.jpg`],
  ['alley-brick', `${studio}/COT_0399.jpg`],
  ['alley-gaze', `${studio}/COT_9562.jpg`],
  ['alley-stairs', `${studio}/COT_0604.jpg`],
  ['alley-smile', `${studio}/COT_1224.jpg`],
  ['alley-reeds', `${studio}/COT_1342.jpg`],
  ['alley-embrace', `${studio}/COT_9857.jpg`],
  ['night-sparkler', `${pro}/DSC03466 0.jpg`],
  ['night-dusk', `${sky}/DSC05028 0.jpg`],
  ['night-sparklers', `${sky}/DSC03444 0.jpg`],
  ['night-skyline', `${sky}/DSC05114 0.jpg`],
  ['night-bridge', `${sky}/DSC05108 0.jpg`],
  ['night-stairs', `${sky}/DSC05198 0.jpg`],
  ['night-dance', `${pro}/DSC05303 0.jpg`]
];

await mkdir(output, { recursive: true });
for (const [id, file, { crop, large } = {}] of photos) {
  if (only.length && !only.includes(id)) continue;
  const input = path.join(source, file);
  const { width, height } = await sharp(input).metadata();
  const region = crop && {
    left: Math.round(crop[0] * width), top: Math.round(crop[1] * height),
    width: Math.round(crop[2] * width), height: Math.round(crop[3] * height)
  };
  for (const size of large ? [640, 1280, 1920] : [640, 1280]) {
    let image = sharp(input);
    if (region) image = image.extract(region);
    await image.resize({ width: size }).webp({ quality: 76, effort: 5 }).toFile(path.join(output, `${id}-${size}.webp`));
  }
  console.log(id);
}

// 메신저 공유 미리보기(1200×630)용 사진: 인사하는 두 사람과 하늘.
if (only.length && !only.includes('og')) process.exit(0);
const bow = path.join(source, photos.find(([id]) => id === 'closing')[1]);
const meta = await sharp(bow).metadata();
const ogHeight = Math.round(meta.width * 630 / 1200);
await sharp(bow)
  .extract({ left: 0, top: Math.round(meta.height * 0.872) - ogHeight, width: meta.width, height: ogHeight })
  .resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(path.resolve('assets/og.jpg'));
console.log('og.jpg');
