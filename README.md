# 나동규 · 이엄지의 결혼 알림장

**2027년 2월 14일**, 부부가 되는 두 사람의 소식을 전하는 모바일 알림장입니다. 별도의 결혼식은 진행하지 않으며 예식장, 오시는 길, 참석 안내는 없습니다.

파란 하늘 아래 두 사람이 인사하는 사진으로 시작해, 낮 → 오후 → 해 질 녘 → 밤으로 이어지는 "둘이 보낸 하루"를 따라 사진 35장을 보여 주고, 다시 아침 하늘 아래 감사 인사로 끝납니다. 색은 사진의 하늘·잔디·하트 풍선에서 가져왔고 글꼴은 함렛(Hahmlet) 하나만 씁니다. HTML·CSS·JavaScript로 작성했으며 백엔드가 없습니다.

배포 주소: https://kaineus.github.io/mobile-invitation/

## 로컬 실행

Node.js 22 이상에서 실행한 뒤 http://127.0.0.1:4173 을 여세요.

```sh
npm run dev
```

```sh
npm run lint
npm run build
npm run preview
```

Windows PowerShell에서 `npm.ps1` 실행 정책 오류가 나면 `npm` 대신 `npm.cmd`를 사용하세요. 시스템 실행 정책을 변경할 필요는 없습니다.

`lint`는 JavaScript 구문을 검사합니다. `build`는 날짜와 필수 이름을 검증하고 배포할 파일만 `dist/`로 복사하며, 공유용 제목·설명을 설정에서 생성합니다. 모듈을 사용하므로 HTML 파일을 더블클릭하지 말고 로컬 서버로 확인하세요.

## 문구와 사진 수정

`invitation.js`에서 이름, 날짜, 인사말, 사진 구성을 수정하세요.

- `date`: `2027-02-14` 형식의 날짜입니다. 달력, 디데이, 기념일 다운로드에 반영됩니다.
- `headline`, `subline`: 첫 화면 하늘에 놓이는 글입니다.
- `message`: 소중한 분들께 전할 편지입니다. 빈 문자열은 문단 사이의 빈 줄입니다.
- `groom.family`, `bride.family`: 선택 사항입니다. 입력하면 소개란 이름 아래에 표시됩니다.
- `chapters`: 낮·오후·해 질 녘·밤 네 장면입니다. 장면마다 큰 사진 한 장(`lead`)과 옆으로 넘겨 보는 사진들(`photos`)이 있고, `line` 네 개는 이어 읽으면 한 문장이 됩니다.
- `accounts`: 선택 사항입니다. 비워 두면 "마음 전하실 곳"을 표시하지 않습니다. **이 저장소는 공개 저장소이므로 계좌번호를 넣으면 누구나 볼 수 있고 git 기록에도 남습니다.**
- `welcomeConfetti`: 첫 화면 사진이 뜨면 양옆에서 한 번 터지는 꽃가루입니다. `false`로 끌 수 있고, 기기의 동작 줄이기 설정이 켜져 있으면 재생하지 않습니다.
- `siteUrl`: 배포 주소입니다. 도메인을 바꾸면 함께 바꾸세요. 메신저 공유 미리보기 사진 주소에 쓰입니다.

### 사진 바꾸기

사진은 `id`로 가리키며 `assets/photos/<id>-640.webp`, `<id>-1280.webp` 두 크기가 있어야 합니다(첫 화면과 마지막 사진은 `-1920`도 사용). 원본(`웨딩/` 폴더, 4GB가 넘어 `.gitignore`로 제외)에서 다시 만들려면 `scripts/photos.mjs`의 목록을 고친 뒤 실행하세요. 공유 미리보기용 `assets/og.jpg`도 함께 만들어집니다.

```sh
npm install
npm run photos
```

`npm run build`는 `invitation.js`가 가리키는 사진 파일이 모두 있는지 확인하고, 없으면 파일 이름과 함께 실패합니다.

공유는 휴대폰의 기본 공유창을 사용하고, 지원하지 않으면 링크를 복사합니다. 결혼기념일 저장은 시간·장소 없는 종일 일정 `.ics` 파일을 내려받습니다. 디데이는 열람자의 시간대와 관계없이 한국 시간을 기준으로 계산합니다. 검색 엔진에는 노출되지 않도록 `noindex`를 넣어 두었습니다. 축하 메시지 수집(방명록)처럼 서버가 필요한 기능은 포함하지 않습니다.

## GitHub Pages

`main`에 push하면 `.github/workflows/pages.yml`이 구문 검사 → 빌드 → Pages 배포를 실행합니다. GitHub **Settings → Pages → Build and deployment → Source**는 **GitHub Actions**로 설정합니다. 진행 상황은 저장소의 **Actions**에서 확인합니다.

```sh
git add .
git commit -m "feat: update wedding announcement"
git push origin main
```

원격 저장소는 HTTPS로 연결했습니다. SSH 키가 등록되면 `git remote set-url origin git@github.com:kaineus/mobile-invitation.git`으로 바꿀 수 있습니다.

## 나중에 도메인 연결하기

현재 `kaineus.github.io/mobile-invitation/` 주소는 무료로 사용할 수 있습니다. 별도 도메인이 없어도 배포할 수 있습니다. 무료 도메인/서브도메인 제공 업체는 DNS 레코드 수정 권한과 제공 기간·갱신 조건을 확인한 뒤 선택하세요. 별도 도메인은 아직 등록하거나 연결하지 않았습니다.

1. 사용할 도메인을 확보하고 GitHub에서 도메인 소유권을 검증합니다.
2. 저장소 **Settings → Pages → Custom domain**에 주소를 입력합니다.
3. 서브도메인은 DNS `CNAME`을 `kaineus.github.io`로 설정합니다. `/mobile-invitation/` 경로는 DNS에 넣지 않습니다.
4. 루트 도메인은 GitHub 문서의 최신 `A` 또는 `ALIAS`/`ANAME` 레코드를 사용합니다.
5. DNS 반영과 인증서 발급 후 **Enforce HTTPS**를 켭니다.

모든 리소스가 상대 경로여서 도메인이 바뀌어도 동작합니다. GitHub Actions 배포 방식에서는 `CNAME` 파일 대신 저장소 Pages 설정에서 도메인을 관리합니다.

- [GitHub Pages 배포 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [사용자 지정 도메인 연결](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
