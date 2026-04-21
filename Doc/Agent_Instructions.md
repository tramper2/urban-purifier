# Agent Instructions: Development Guidelines

## 1. Code Quality & Standards
- **Strict Typing**: 모든 인터페이스와 함수에 TypeScript 타입을 엄격히 적용할 것. `any` 금지.
- **Atomic Commits**: 각 기능 단위(예: API 생성, UI 컴포넌트 생성)로 작업을 쪼개서 진행하고, 단계마다 동작 확인을 요청할 것.
- **Error Handling**: 백엔드 API 응답 시 에러 코드를 명확히 정의하고, 프론트엔드에서는 Toast 알림 등을 통해 사용자에게 피드백을 줄 것.

## 2. Implementation Priority
1. **Phase 1 (Core)**: PostgreSQL 스키마 설계 및 NestJS + Prisma 기초 설정.
2. **Phase 2 (Logic)**: 서버 사이드 지뢰 배치 및 Flood Fill 정화 알고리즘 구현.
3. **Phase 3 (Frontend)**: Phaser 3 캔버스 연동 및 기본 그리드 렌더링.
4. **Phase 4 (Bridge)**: React UI(자원 표시)와 Phaser(게임 보드) 간의 상태 동기화.
5. **Phase 5 (Polish)**: 타일 정화 애니메이션 및 건물 건설 UI 구현.

## 3. Communication
- 파일 구조를 변경하거나 큰 로직을 수정하기 전에는 반드시 사용자에게 구조를 제안하고 승인을 받을 것.
- `package.json`에 새로운 라이브러리를 추가할 때는 이유를 명시할 것.

