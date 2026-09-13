# nestjs_backend — Boilerplate v2.0

## 1. 소개

2022년에 만든 NestJS 보일러플레이트를 2026년 기준으로 현대화한 백엔드 보일러플레이트입니다.
이후 **발주·재고 관리 시스템**의 시작 기반으로 사용합니다.

- 도메인 예시: User CRUD(+pagination), Board(파일 업로드 포함), CompanyInfo
- 공통 기반: 환경변수 검증, 전역 Validation/Exception 처리, Health Check, Migration, Logging, Docker, CI

업그레이드 과정 전체 기록은 [UPGRADE_LOG.md](./UPGRADE_LOG.md), Phase별 계획은 [nestjs_backend_upgrade.md](./nestjs_backend_upgrade.md) 참고.

## 2. 기술 스택

| 항목 | 버전 |
|---|---|
| Node.js | 24 (`.nvmrc`) |
| TypeScript | 5.9 (strict) |
| NestJS | 11 |
| TypeORM | 1.1 |
| PostgreSQL | 17 |
| Jest | 28 |
| Docker / Compose | multi-stage 빌드 |
| GitHub Actions | Node 24 기준 CI |

## 3. 프로젝트 구조

```text
src/
├── common/
│   ├── filters/          # GlobalExceptionFilter — 에러 응답 형식 통일
│   ├── interceptors/     # AccessLogInterceptor
│   ├── logger/           # winston 파일 로거 (console/query)
│   └── pagination.ts     # findAndCount 기반 공용 pagination
├── config/
│   ├── config.ts         # 환경변수 → 설정 객체
│   ├── env.validation.ts # class-validator 기반 ENV 검증
│   └── config.multer.ts  # 파일 업로드 저장소 설정
├── database/
│   ├── migrations/
│   ├── database.config.ts # 앱 런타임 TypeORM 설정
│   └── typeorm.config.ts  # Migration CLI 전용 DataSource
├── health/               # GET /health
├── modules/
│   ├── users/            # entities/ dto/ controller/service/module
│   ├── boards/
│   └── company-info/
├── app.module.ts
└── main.ts
```

- Entity는 각 도메인 모듈 내부에 두고, 모듈별로 `TypeOrmModule.forFeature`를 선언합니다.

## 4. 실행 방법

```bash
nvm use            # Node 24
npm ci

# PostgreSQL 실행 (아래 10. Docker 참고)
docker compose up -d postgres

cp .env.example .env   # 값 채우기 (DB_PASSWORD 등)
npm run migration:run
npm run start:dev      # http://localhost:3010
```

확인:

```bash
curl http://localhost:3010/health
# {"status":"ok"}
```

## 5. 환경변수

`.env.example`를 복사해 `.env`를 만듭니다. `.env`는 커밋되지 않습니다.

| 변수 | 설명 | 기본값 |
|---|---|---|
| NODE_ENV | dev / prod / test | dev |
| PORT | 서버 포트 | 3010 |
| DB_HOST | PostgreSQL 호스트 | localhost |
| DB_PORT | PostgreSQL 포트 | 5432 |
| DB_USERNAME | DB 계정 | (필수) |
| DB_PASSWORD | DB 비밀번호 | (필수) |
| DB_DATABASE | DB 이름 | (필수) |
| JWT_ACCESS_SECRET / JWT_REFRESH_SECRET | v2.1 Authentication 예정 | - |

앱 시작 시 `src/config/env.validation.ts`가 검증하며, 필수 값이 없거나 형식이 틀리면 **시작에 실패**합니다.

## 6. PostgreSQL / Migration

- `synchronize: false` — 스키마는 Migration으로만 변경합니다.
- CLI 전용 DataSource: `src/database/typeorm.config.ts` (`.env` 로드)

```bash
npm run migration:generate src/database/migrations/<Name>  # Entity 변경 → 마이그레이션 생성
npm run migration:run
npm run migration:revert
```

## 7. Logging

- **정책**: NestJS `ConsoleLogger` 상속(stdout 유지) + `winston-daily-rotate-file` 파일 로깅.
- 콘솔 로그: `logs/{env}/console/`, TypeORM 쿼리 로그: `logs/{env}/query/` (일 단위 로테이션, 50MB/20개 보관).
- Docker 환경에서는 stdout이 수집 대상이고 파일 로그는 로컬 개발 보조용입니다.

## 8. Validation / Exception

- 전역 `ValidationPipe`: `whitelist` + `forbidNonWhitelisted` + `transform` — DTO에 없는 속성은 400.
- 전역 `GlobalExceptionFilter`: 모든 에러 응답을 아래 형태로 통일합니다.

```json
{
  "statusCode": 404,
  "message": "조회된 고객이 없습니다.",
  "error": "Not Found",
  "timestamp": "2026-09-13T10:13:42.938Z",
  "path": "/user/..."
}
```

## 9. Test

```bash
npm test          # 단위 테스트 (DB 불필요)
npm run test:e2e  # e2e — app e2e는 PostgreSQL 필요, health e2e는 불필요
```

- users.service: 생성(비밀번호 해시 검증)/조회/수정/없는 유저 처리
- env.validation: ENV 검증 규칙
- health: e2e로 `GET /health` 확인

## 10. Docker

```bash
docker compose up -d --build   # app + postgres
npm run migration:run          # 호스트에서 실행 (CLI는 ts 소스 기준)
curl http://localhost:3010/health
```

- Dockerfile: node:24-alpine 3-stage(deps → build → production), production 이미지는 dist + prod 의존성만 포함, **non-root(node)** 로 실행.
- Compose: postgres healthcheck 통과 후 app 기동, 데이터는 named volume(`pgdata`).

## 11. CI

`.github/workflows/ci.yml` — push / PR 시:

```text
npm ci → npm run lint → npm run build → npm test
```

Node 24 기준이며, 실패한 단계는 GitHub Actions 로그에서 단계별로 확인할 수 있습니다.

## 12. 설계 판단

- **NestJS 11 유지, 12 보류** — nest-winston·nestjs-typeorm-paginate가 Nest 12 peer 미지원. 지원되면 재검토.
- **TypeORM 유지 (Prisma/Drizzle 미도입)** — 기존 코드 자산과 학습 곡선을 고려해 ORM 교체 없이 메이저 업그레이드만 수행.
- **TypeORM 업그레이드와 DB 교체 분리** — 장애 원인 추적을 위해 MySQL 위에서 TypeORM 1.x를 먼저 검증한 뒤, 별도 Phase에서 PostgreSQL로 전환.
- **pagination 자체 구현** — nestjs-typeorm-paginate가 TypeORM 1.x 미지원이라 `findAndCount` 기반으로 대체하되 응답 형태는 유지.
- **과도한 추상화 배제** — BaseController/BaseService 등은 실제 반복이 확인되기 전에는 만들지 않음.

## 13. 2022 → 2026 Upgrade 기록

```text
Node.js       18 → 24
TypeScript    4.3 → 5.9 + strict
NestJS        8 → 9 → 10 → 11 (12 검토 후 보류)
TypeORM       0.3 → 1.1
Database      MySQL → PostgreSQL
Config        YAML(비밀번호 하드코딩) → 환경변수 + Schema Validation
Structure     중앙 @database Entity → Domain Module Entity
Added         Migration / Health / Exception Filter / Docker / CI / Test
```

상세 과정: [UPGRADE_LOG.md](./UPGRADE_LOG.md)

## 14. 넣지 않은 것과 이유

| 항목 | 이유 |
|---|---|
| Prisma / Drizzle | ORM 교체는 이번 목표(현대화)와 무관, TypeORM 유지 |
| Redis / Kafka / Queue | 보일러플레이트 범위 밖, 필요 시 프로젝트에서 도입 |
| OAuth / RBAC | v2.1 Authentication(별도 `feat/auth`)에서 검토 |
| WebSocket / SSE | 대상 프로젝트(발주·재고)에 당장 불필요 |
| Kubernetes / Terraform / 모니터링 스택 | 인프라 범위 밖, Compose로 충분 |
| Base* 추상 클래스 | 실제 반복 확인 전 추상화 금지 원칙 |

---

### v2.1 예정 (별도 브랜치 `feat/auth`)

회원가입 / 로그인 / Access·Refresh Token / Rotation / Reuse Detection / Guard / Auth Test
