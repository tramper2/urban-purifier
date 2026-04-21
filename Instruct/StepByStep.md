"우리는 'Urban Purifier'라는 웹게임을 만들 거야. Doc 폴더내의 모든 .md 파일들을 읽고 전체 설계를 파악해줘. 이해가 끝났다면 **Step 1(백엔드 인프라 및 DB 세팅)**부터 시작하자. 먼저 프로젝트 구조와 docker-compose.yml, schema.prisma 파일을 제안해줘." 그리고 완료되면 다음 스텝으로 진행해

Step 1: 인프라 및 백엔드 기초 세팅 (Claude Code)
작업: Docker-compose로 PostgreSQL 띄우기, NestJS 프로젝트 생성, Prisma 스키마 정의.

이유: 데이터 구조가 먼저 잡혀야 게임의 상태(정화 여부, 건물 위치)를 저장할 수 있습니다.

Step 2: 핵심 알고리즘 및 API 구현 (Claude Code)
작업: 서버 사이드 지뢰 배치 로직, Flood Fill 정화 알고리즘, 타일 클릭 API 구현.

이유: 치트 방지를 위해 모든 판정 로직을 서버에 먼저 구축합니다.

Step 3: 비주얼 에셋 생성 (Antigravity)
작업: Assets.md의 프롬프트를 사용하여 타일셋, 숫자 아이콘, 건물 스프라이트 시트 생성.

이유: 게임 화면을 그리기 전에 재료(이미지)가 준비되어 있어야 Phaser 개발이 수월합니다.

Step 4: 프론트엔드 게임 보드 구현 (Antigravity + Claude Code)
작업: React 환경에 Phaser 3 설정, 생성된 에셋 로드, 그리드 렌더링.

이유: 준비된 에셋과 서버 API를 연결하여 실제 '플레이 가능한' 화면을 만듭니다.

Step 5: 시스템 결합 및 UI 디테일 (공통)
작업: React HUD(에너지 표시, 건물 상점) 연동, 정화 애니메이션 폴리싱, 배포 자동화(GitHub Actions) 설정.

이유: 최종적으로 게임의 완성도를 높이고 서비스를 퍼블리싱합니다.


