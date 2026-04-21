# API & Data Schema Specification

## 1. Tile Object Interface (TypeScript)
```typescript
interface Tile {
  id: string;          // x-y 형태의 고유 ID
  x: number;
  y: number;
  isPollutant: boolean;
  adjacentCount: number; // 주변 오염 핵 개수
  state: 'POLLUTED' | 'CLEANSED' | 'BUILDING';
  buildingId?: string;  // 설치된 건물 고유 ID
}

PostgreSQL Schema Details (Prisma Style)
User: id, username, totalEnergy, lastSavedAt
CityMap: id, userId, width, height, tiles (JSONB 또는 별도 Table)
Building: id, type, level, productionRate

Core Logic: Purification (Flood Fill)
클릭한 타일이 0일 경우, 재귀적으로 주변 타일을 탐색하여 0이 아닌 타일을 만날 때까지 state를 CLEANSED로 변경함.
서버 사이드에서 검증 후 변경된 타일 목록 전체를 클라이언트에 반환.


