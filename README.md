# Urban Purifier 🏙️♻️

지뢰찾기의 핵심 메커니즘과 도시 재건을 결합한 웹 기반 전략 퍼즐 게임입니다.

## 🎮 게임 소개

오염된 도시를 정화하고 건물을 지어 자원을 생산하며 도시를 확장해나가는 게임입니다.

### 핵심 기능
- **지뢰찾기 스타일 탐지**: 주변 오염 핵 개수를 표시
- **Flood Fill 정화**: 인접한 안전 지역을 한번에 정화
- **건물 건설**: 정화된 타일에 에너지 생산 시설 건설
- **자원 관리**: 에너지와 HP 관리

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript + Vite + Phaser 3
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **CI/CD**: GitHub Actions
- **Hosting**: 
  - Frontend: [Vercel](https://frontend-tau-ebon-75.vercel.app)
  - Backend: Railway

## 📋 요구 사항

- Node.js 18+
- npm 또는 yarn
- Git

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/tramper2/urban-purifier.git
cd urban-purifier
```

### 2. 설치

**프론트엔드:**
```bash
cd Source/frontend
npm install
```

**백엔드:**
```bash
cd Source/backend
npm install
```

### 3. 데이터베이스 설정

```bash
cd Source
docker-compose up -d
```

### 4. Prisma 마이그레이션

```bash
cd Source/backend
npx prisma migrate dev
npx prisma generate
```

### 5. 실행

**백엔드 (포트 3001):**
```bash
cd Source/backend
npm run start:dev
```

**프론트엔드 (포트 5173):**
```bash
cd Source/frontend
npm run dev
```

## 🎮 게임 방법

1. **새 게임 시작** 버튼 클릭
2. **오염된 타일(보라색)** 클릭 → 정화됨
3. **정화된 타일(초록색)** 클릭 → 건물 메뉴 오픈
4. **건물 선택** → 해당 타일에 건설

## 📁 프로젝트 구조

```
urban-purifier/
├── Doc/                    # 프로젝트 문서
│   ├── PRD.md            # 제품 요구서
│   ├── Spec.md           # 기술 스펤크
│   ├── TRD.md            # 기술 아키텍처
│   └── Assets.md         # 에셋 사양
├── Instruct/              # 개발 지침
│   └── StepByStep.md     # 단계별 개발 가이드
├── Source/                # 소스 코드
│   ├── backend/          # NestJS 백엔드
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── game/
│   │   │   ├── prisma/
│   │   │   └── main.ts
│   │   └── prisma/
│   ├── frontend/         # React 프론트엔드
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── game/
│   │   │   └── assets/
│   │   └── package.json
│   └── docker-compose.yml # PostgreSQL 컨테이너
└── .github/workflows/    # CI/CD
```

## 🔧 API 엔드포인트

### Backend (http://localhost:3001)

- `POST /game/start` - 새 게임 생성
- `POST /game/click` - 타일 클릭/정화
- `POST /game/build` - 건물 건설
- `GET /game/state/:sessionId` - 게임 상태 조회

## 🎨 에셋

- **Environment Tiles**: 타일 스프라이트 시트
- **Number Icons**: 숫자 아이콘
- **Building Sprites**: 건물 스프라이트

## 🚀 배포

### 자동 배포
- **프론트엔드**: Vercel (main 브랜치 푸시 시 자동 배포)
- **백엔드**: Railway (GitHub Actions 통해 자동 배포)

### 수동 배포
```bash
# Frontend
cd Source/frontend
vercel --prod

# Backend
cd Source/backend
railway deploy
```

## 📝 개발 가이드

프로젝트 설정 및 코딩 표준은 `Doc/Agent_Instructions.md`를 참고하세요.

## 🐛 문제 해결

**백엔드가 시작되지 않음:**
- PostgreSQL 컨테이너 실행 확인: `docker ps`
- Prisma 클라이언트 생성: `npx prisma generate`

**프론트엔드에서 API 연결 실패:**
- 백엔드가 실행 중인지 확인
- 포트 번호 확인 (프론트엔드: 5173, 백엔드: 3001)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 기여

이 프로젝트에 기여하고 싶으시면 Pull Request를 보내주세요!

---

**개발자**: Claude Code & User Collaboration  
**버전**: 1.0.0
