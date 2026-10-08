# 나동규 · 이엄지의 결혼 알림장

**2027년 2월 14일**, 부부가 되는 두 사람의 소식을 전하는 모바일 알림장입니다. 별도의 결혼식은 진행하지 않으며 예식장, 오시는 길, 참석 안내는 없습니다.

은은한 블루와 고운 바탕체로 구성했습니다. 사진은 메인 1장, 갤러리 6장의 스켈레톤으로 표시합니다. HTML·CSS·JavaScript로 작성했으며 설치할 패키지나 백엔드가 없습니다.

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

`invitation.js`에서 이름, 날짜, 인사말과 사진을 수정하세요.

- `date`: `2027-02-14` 형식의 날짜입니다. 달력, 디데이, 기념일 다운로드에 반영됩니다.
- `message`: 소중한 분들께 전할 편지입니다. 빈 문자열은 문단 사이의 빈 줄입니다.
- `cover.src`: `./assets/cover.jpg`처럼 입력합니다. 사진은 `assets/` 안에 넣으세요.
- `photos`: `{ src: './assets/photo-1.jpg', alt: '사진 설명' }` 형태로 수정합니다. 빈 경로는 스켈레톤을 유지하고 실제 사진을 누르면 확대됩니다.

공유는 휴대폰의 기본 공유창을 사용하고, 지원하지 않으면 링크를 복사합니다. 클립보드 권한이 없으면 직접 복사할 수 있는 창이 열립니다. 결혼기념일 저장은 시간·장소 없는 종일 일정 `.ics` 파일을 내려받습니다. 디데이는 열람자의 시간대와 관계없이 한국 시간을 기준으로 계산합니다.

Google Fonts를 불러올 수 없으면 시스템 바탕체로 표시됩니다. 사진 업로드 관리 화면이나 축하 메시지 수집 기능은 포함하지 않습니다. 공유 미리보기용 사진이 필요하면 실제 사진의 공개 절대 URL로 `index.html`에 `og:image` 메타 태그를 추가하세요. JavaScript 미사용 시 표시할 기본 이름·날짜·안내 문구는 `index.html`에도 들어 있습니다.

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
