# PRD: Urban Purifier (도시 재건: 오염 구역 정화)

## 1. Project Overview
지뢰찾기의 핵심 메커니즘(주변 지뢰 개수 탐색)을 활용하여, 오염된 땅을 정화하고 도시를 재건하는 전략 퍼즐 웹게임입니다. 사용자는 '정화'를 통해 안전한 공간을 확보하고, 그곳에 건물을 지어 자원을 생산하며 도시를 확장합니다.

## 2. Core Features
- **Minesweeper Core**: 격자 기반의 오염 핵(지뢰) 탐지 및 숫자 표시 시스템.
- **Purification System**: 안전한 타일 클릭 시 정화 애니메이션과 함께 지형 변화.
- **Construction & Resources**: 정화된 타일에 에너지 생산 건물, 레이더 등을 건설.
- **Resource Management**: 에너지를 소모하여 정화 타워 설치(깃발 기능) 및 아이템 사용.
- **Persistence**: PostgreSQL을 연동하여 유저의 도시 상태(타일 상태, 건물 위치) 저장.

## 3. Target Audience
- 퍼즐 게임과 시뮬레이션 게임을 동시에 즐기는 웹 사용자.
- 짧은 시간 동안 전략적인 플레이를 원하는 유저.

## 4. Success Metrics
- 사용자의 재방문율 (도시가 유지되므로 지속적인 플레이 유도).
- 맵 정화 완료율 및 도시 확장 규모.