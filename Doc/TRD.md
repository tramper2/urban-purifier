# TRD: Urban Purifier Technical Stack & Architecture
모든 소스는 Source 폴더내에 적당한 폴더를 생성해서 작성한다
## 1. Technology Stack
- **Frontend**: React (v18+), TypeScript, Tailwind CSS.
- **Game Engine**: Phaser 3 (Canvas 기반 렌더링).
- **Backend**: NestJS (Node.js framework), TypeScript.
- **Database**: PostgreSQL (Prisma ORM 추천).
- **CI/CD**: GitHub Actions.
- **Hosting**: Vercel (Frontend), Railway/AWS (Backend/DB).

## 2. System Architecture
- **Client-Side**: Phaser 3가 게임 보드를 관리하고, React는 HUD(UI) 및 상점 시스템을 담당.
- **Server-Side**: 치트 방지를 위해 지뢰 배치 로직 및 정화 판정은 서버에서 수행.
- **Data Flow**: 
  1. 클라이언트 클릭 -> 2. 서버 검증 -> 3. DB 업데이트 -> 4. 클라이언트 결과 반영.

## 3. Database Schema (PostgreSQL)
- `users`: 유저 식별 정보.
- `game_sessions`: 현재 활성화된 도시 정보 (자원량, 맵 크기 등).
- `map_tiles`: 각 타일의 좌표(x, y), 상태(Polluted, Cleansed, Building), 오염 핵 여부, 설치된 건물 타입.

## 4. API Endpoints
- `POST /game/start`: 새로운 맵 생성 및 초기화.
- `POST /game/clear-tile`: 특정 좌표 정화 시도 (결과 반환).
- `POST /game/build`: 특정 좌표에 건물 건설.
- `GET /game/state`: 현재 저장된 도시 상태 불러오기.