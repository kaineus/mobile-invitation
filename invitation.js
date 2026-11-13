// 결혼 알림장의 내용은 이 파일에서 수정하세요.
// 사진은 id 로 가리킵니다. assets/photos/<id>-640.webp, <id>-1280.webp 파일이 있어야 하며
// 원본에서 다시 만들려면 scripts/photos.mjs 에 추가한 뒤 `npm run photos` 를 실행하세요.
export const announcement = {
  // 배포 주소. 메신저 공유 미리보기 사진(og:image)의 절대 경로에 쓰입니다.
  siteUrl: 'https://kaineus.github.io/mobile-invitation/',
  // 첫 화면(색종이 사진)과 마지막 인사 사진에서 터지는 동그란 색종이. false 로 끌 수 있습니다.
  welcomeConfetti: true,
  // family 는 선택 사항입니다. 예: '나○○ · 김○○의 아들'
  // shades 는 소개 사진을 누르면(처음 보일 때는 저절로) 바뀌는 선글라스 사진입니다. 빼면 바뀌지 않습니다.
  groom: {
    name: '나동규', english: 'Wayne', family: '',
    portrait: { id: 'portrait-groom', alt: '짙은 정장에 꽃을 달고 웃는 신랑 나동규' },
    shades: { id: 'shades-groom', alt: '검은 선글라스를 쓰고 씩 웃는 신랑 나동규' }
  },
  bride: {
    name: '이엄지', english: 'Thumb', family: '',
    portrait: { id: 'portrait-bride', alt: '하얀 드레스를 입고 환하게 웃는 신부 이엄지' },
    shades: { id: 'shades-bride', alt: '검은 선글라스를 쓰고 활짝 웃는 신부 이엄지' }
  },
  // 결혼식을 진행하지 않으므로 시간 없는 날짜를 사용합니다.
  date: '2027-02-14',
  // 첫 화면 하늘에 붓글씨로 한 줄씩 써지는 글입니다.
  headline: ['저희,', '부부가 됩니다'],
  message: [
    '저희 두 사람, 부부가 됩니다.',
    '',
    '별도의 결혼식은 올리지 않고',
    '소중한 분들께 이 글로 소식을 전합니다.',
    '',
    '서로의 하루에 가장 다정한 사람이 되어',
    '함께하는 일상을 차곡차곡 쌓아 가겠습니다.',
    '',
    '어디에서든 따뜻한 마음으로 축하해 주세요.',
    '보내 주시는 마음, 오래도록 간직하겠습니다.'
  ],
  cover: { id: 'cover', alt: '색종이가 흩날리는 사진관 바닥에 나란히 앉아 웃고 있는 두 사람' },
  intro: {
    // 소개 사진 아래에 크게 보이는 한 장.
    lead: { id: 'studio-sunglasses', alt: '검은 선글라스를 쓰고 장난스럽게 선 두 사람' },
    photos: [
      { id: 'studio-glance', alt: '손을 잡고 서로를 바라보며 웃는 두 사람' },
      { id: 'studio-ribbon', alt: '하늘색 리본을 두르고 턱을 괸 채 웃는 두 사람' },
      { id: 'studio-wink', alt: '신랑 머리 위에 손을 얹고 윙크하는 신부' },
      { id: 'studio-confetti', alt: '색종이가 흩날리는 바닥에 앉아 볼에 입 맞추는 두 사람' },
      { id: 'studio-shades-close', alt: '선글라스를 쓴 채 마주 보며 웃는 두 사람' },
      { id: 'studio-veil', alt: '면사포 아래에서 마주 보며 웃는 두 사람' }
    ]
  },
  // 사진 묶음마다 큰 사진 한 장(lead)이 있고, photos 의 처음 두 장은 비스듬히 놓인 인화 사진으로,
  // 나머지는 옆으로 흘러가는 줄로 보입니다.
  // lead.effect 는 그 사진 위에서 움직이는 작은 효과입니다: 'balloons'(하트 풍선), 'bubbles'(비눗방울),
  // 'leaves'(은행잎), 'sparks'(불꽃, at 은 사진 안에서 불꽃이 있는 위치 [가로, 세로] 0~1). 빼면 효과가 없습니다.
  gallery: [
    {
      lead: { id: 'noon-jump', alt: '하트 풍선을 들고 뛰어오른 신랑과 그 손을 잡은 신부', effect: 'balloons' },
      photos: [
        { id: 'noon-lift', alt: '면사포를 쓴 신부를 번쩍 안아 올린 신랑' },
        { id: 'noon-hearts', alt: '빨간 하트 풍선을 하나씩 들고 마주 보는 두 사람' },
        { id: 'noon-peace', alt: '카메라를 향해 브이를 그리는 두 사람' },
        { id: 'noon-bunny', alt: '쪼그려 앉은 신랑 머리 위로 토끼 귀를 만드는 신부' },
        { id: 'noon-mirror', alt: '잔디 위 거울에 비친 두 사람과 곰 인형 한 쌍' },
        { id: 'noon-laugh', alt: '팔짱을 끼고 환하게 웃는 두 사람' }
      ]
    },
    {
      lead: { id: 'field-bubbles-wide', alt: '비눗방울을 불다 마주 보고 웃는 두 사람', wide: true, effect: 'bubbles' },
      photos: [
        { id: 'field-kiss', alt: '웃는 신부의 머리에 입 맞추는 신랑' },
        { id: 'field-flowers', alt: '작은 꽃다발을 들고 볼을 맞댄 두 사람' },
        { id: 'field-bubbles', alt: '나란히 서서 비눗방울을 부는 두 사람' },
        { id: 'field-hearts', alt: '하트 풍선을 안고 마주 보는 두 사람' },
        { id: 'field-lean', alt: '손을 잡고 양쪽으로 몸을 기울인 두 사람' },
        { id: 'field-run', alt: '손을 잡고 풀밭을 달려가는 두 사람의 뒷모습' }
      ]
    },
    {
      lead: { id: 'alley-ginkgo', alt: '은행나무 길 횡단보도를 손잡고 건너는 두 사람', effect: 'leaves' },
      photos: [
        { id: 'alley-brick', alt: '붉은 벽돌 건물에 나란히 기대선 두 사람' },
        { id: 'alley-gaze', alt: '저녁 볕 속에서 손을 잡고 마주 보는 두 사람' },
        { id: 'alley-stairs', alt: '계단 난간 너머로 이마를 맞댄 두 사람' },
        { id: 'alley-smile', alt: '턱을 괴고 나란히 웃는 두 사람' },
        { id: 'alley-reeds', alt: '노랗게 물든 풀밭에 나란히 선 두 사람' },
        { id: 'alley-embrace', alt: '석조 건물 앞에서 서로를 끌어안은 두 사람' }
      ]
    },
    {
      lead: { id: 'night-sparkler', alt: '밤의 다리 위에서 불꽃을 함께 들고 있는 두 사람', effect: 'sparks', at: [0.33, 0.67] },
      photos: [
        { id: 'night-dusk', alt: '분홍빛 노을과 강 건너 빌딩을 뒤로하고 마주 선 두 사람' },
        { id: 'night-sparklers', alt: '양손에 불꽃을 들고 웃는 두 사람' },
        { id: 'night-skyline', alt: '도시의 야경을 뒤로하고 난간에 걸터앉은 두 사람' },
        { id: 'night-bridge', alt: '다리 위에서 손을 잡고 마주 보는 두 사람' },
        { id: 'night-stairs', alt: '계단참에서 서로를 끌어안은 두 사람' },
        { id: 'night-dance', alt: '가로등 아래 밤길에서 춤추는 두 사람' }
      ]
    }
  ],
  closing: {
    id: 'closing', alt: '파란 하늘 아래 잔디 언덕에서 나란히 허리 숙여 인사하는 두 사람',
    title: '고맙습니다',
    line: '서로의 가장 가까운 편이 되어\n다정하게 잘 살겠습니다.'
  },
  // 마음 전하실 곳(계좌번호). 평소 주소에서는 보이지 않고,
  // 주소 끝에 ?mode=heart 를 붙인 링크로 열었을 때만 보입니다.
  //   소식만 전하는 링크: https://kaineus.github.io/mobile-invitation/
  //   계좌가 보이는 링크: https://kaineus.github.io/mobile-invitation/?mode=heart
  // 주의: 이 저장소는 공개이므로 여기에 적은 계좌번호는 누구나 볼 수 있습니다.
  gift: {
    mode: 'heart',
    title: '마음 전하실 곳',
    note: '멀리서 마음을 전하고 싶으신 분들을 위해\n조심스럽게 적어 둡니다.',
    // 아래는 자리만 잡아 둔 값입니다. 실제 은행과 계좌번호로 바꿔 주세요.
    accounts: [
      { label: '신랑 나동규', bank: '○○은행', number: '000-00-0000000', holder: '나동규' },
      { label: '신부 이엄지', bank: '○○은행', number: '000-00-0000000', holder: '이엄지' }
    ]
  }
};
