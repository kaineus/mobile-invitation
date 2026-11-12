// 결혼 알림장의 내용은 이 파일에서 수정하세요.
// 사진은 id 로 가리킵니다. assets/photos/<id>-640.webp, <id>-1280.webp 파일이 있어야 하며
// 원본에서 다시 만들려면 scripts/photos.mjs 에 추가한 뒤 `npm run photos` 를 실행하세요.
export const announcement = {
  // 배포 주소. 메신저 공유 미리보기 사진(og:image)의 절대 경로에 쓰입니다.
  siteUrl: 'https://kaineus.github.io/mobile-invitation/',
  // 첫 화면에서 한 번 터지는 꽃가루. false 로 끌 수 있습니다.
  welcomeConfetti: true,
  // family 는 선택 사항입니다. 예: '나○○ · 김○○의 아들'
  groom: { name: '나동규', english: 'Wayne', family: '' },
  bride: { name: '이엄지', english: 'Thumb', family: '' },
  // 결혼식을 진행하지 않으므로 시간 없는 날짜를 사용합니다.
  date: '2027-02-14',
  headline: '인사드립니다',
  subline: '나동규와 이엄지, 부부가 됩니다.',
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
  cover: { id: 'cover', alt: '파란 하늘 아래 잔디 언덕에서 나란히 허리 숙여 인사하는 두 사람' },
  intro: {
    photo: { id: 'intro', alt: '하얀 탁자에 나란히 앉아 웃고 있는 신부 이엄지와 신랑 나동규' },
    photos: [
      { id: 'studio-glance', alt: '손을 잡고 서로를 바라보며 웃는 두 사람' },
      { id: 'studio-ribbon', alt: '하늘색 리본을 두르고 턱을 괸 채 웃는 두 사람' },
      { id: 'studio-wink', alt: '신랑 머리 위에 손을 얹고 윙크하는 신부' },
      { id: 'studio-confetti', alt: '색종이가 흩날리는 바닥에 앉아 볼에 입 맞추는 두 사람' },
      { id: 'studio-sunglasses', alt: '검은 선글라스를 쓰고 장난스럽게 선 두 사람' },
      { id: 'studio-veil', alt: '면사포 아래에서 마주 보며 웃는 두 사람' }
    ]
  },
  // 네 장면의 문장은 이어 읽으면 한 문장이 됩니다.
  chapters: [
    {
      tone: 'noon', time: '낮', line: '하늘이 유난히 파랗던 날,',
      lead: { id: 'noon-jump', alt: '하트 풍선을 들고 뛰어오른 신랑과 그 손을 잡은 신부' },
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
      tone: 'afternoon', time: '오후', line: '풀밭에서 비눗방울을 불고,',
      lead: { id: 'field-bubbles-wide', alt: '비눗방울을 불다 마주 보고 웃는 두 사람', wide: true },
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
      tone: 'sunset', time: '해 질 녘', line: '볕이 길어진 골목을 걷다가,',
      lead: { id: 'alley-ginkgo', alt: '은행나무 길 횡단보도를 손잡고 건너는 두 사람' },
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
      tone: 'night', time: '밤', line: '다리 위에서 작은 불꽃을 켰습니다.',
      lead: { id: 'night-sparkler', alt: '밤의 다리 위에서 불꽃을 함께 들고 있는 두 사람' },
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
  dawn: '그리고 내일도,\n같은 아침을 함께 맞겠습니다.',
  closing: {
    id: 'closing', alt: '파란 하늘 아래 두 팔을 벌리고 깊이 허리 숙여 인사하는 두 사람',
    title: '고맙습니다',
    line: '서로의 가장 가까운 편이 되어\n다정하게 잘 살겠습니다.'
  },
  // 선택 사항: 마음 전하실 곳. 비워 두면 표시하지 않습니다.
  // 예: { label: '신랑 나동규', bank: '○○은행', number: '000-0000-0000' }
  accounts: []
};
