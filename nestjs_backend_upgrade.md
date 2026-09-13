# nestjs_backend 현대화 Phase별 기준선

> Repository: `https://github.com/YoungSik-Oh/nestjs_backend`  
> 목적: 2022년에 만든 NestJS 보일러플레이트를 2026년 기준으로 현대화하고, 이후 **발주·재고 관리 시스템**의 기반으로 사용한다.  
> 최종 DB: **PostgreSQL**

---

# 0. 전체 진행 원칙

이번 작업은 단순한 패키지 업데이트가 아니다.

각 Phase가 끝날 때마다 **다음 단계로 넘어가도 되는지 명확한 기준선(Gate)**을 확인한다.

- 한 번에 여러 메이저 버전을 올리지 않는다.
- Framework 업그레이드와 DB 교체를 동시에 하지 않는다.
- 각 Phase 종료 시 `lint → build → test → run`을 확인한다.
- 정상 상태에서만 Commit한다.
- 타입 오류를 `any`로 덮지 않는다.
- 임시방편으로 다음 Phase로 넘어가지 않는다.
- 보일러플레이트에 불필요한 기능을 추가하지 않는다.
- 문제가 생기면 **어느 Phase에서 깨졌는지 추적할 수 있도록 변경 범위를 분리한다.**
- 최종 목적은 보일러플레이트 자체가 아니라 **발주·재고 관리 프로젝트를 시작할 기반 확보**다.

---

# 1. 전체 Phase 요약

| Phase | 작업 | 다음 Phase 진입 기준 |
|---|---|---|
| Phase 0 | 보안 / Branch 준비 | `upgrade/v2` 생성, Credential 확인 완료 |
| Phase 1 | 기존 코드 기준선 확보 | Node 18에서 기존 코드 상태 파악 완료 |
| Phase 2 | Secret / Config 1차 정리 | Secret 제거, `.env` 구조 적용 |
| Phase 3 | NestJS 8 → 9 | lint/build/test/run 성공 |
| Phase 4 | NestJS 9 → 10 | lint/build/test/run 성공 |
| Phase 5 | Node 24 + TypeScript 5 | Node24/TS5에서 기존 기능 정상 |
| Phase 6 | NestJS 10 → 11 | lint/build/test/run 성공 |
| Phase 7 | NestJS 12 검토 | 호환되면 적용, 문제면 11 유지 |
| Phase 8 | TypeORM 0.3 → 1.x | 기존 DB 기준 CRUD/Relation 정상 |
| Phase 9 | **MySQL → PostgreSQL** | PostgreSQL에서 CRUD/Migration 정상 |
| Phase 10 | TypeScript strict | `strict: true`에서 build 성공 |
| Phase 11 | Project 구조 현대화 | Domain Module 구조 정상 |
| Phase 12 | Backend 공통 기반 | Config/Exception/Health/Migration/Logging 완료 |
| Phase 13 | Test 정비 | 핵심 테스트 통과 |
| Phase 14 | Docker | App + PostgreSQL Container 정상 |
| Phase 15 | GitHub Actions | PR에서 lint/build/test 성공 |
| Phase 16 | README / v2.0 완료 | 새 환경에서 문서만 보고 실행 가능 |
| Phase 17 | 발주·재고 프로젝트 시작 | Boilerplate 작업 종료 |
| v2.1 | Authentication | 필요 시 별도 `feat/auth` |

---

# Phase 0 — 보안 확인 + Branch 준비

## 목표
기존 Public Repository의 Secret 노출 여부를 확인하고, 모든 현대화 작업을 별도 Branch에서 진행한다.

```bash
git checkout main
git pull
git checkout -b upgrade/v2
```

실제 사용한 Credential이면 파일 정리보다 Rotation을 먼저 한다.

## 완료 기준선

```text
[ ] upgrade/v2 브랜치 생성
[ ] main에서 직접 작업하지 않음
[ ] 노출된 Credential이 실제 값인지 확인
[ ] 실제 값이면 Rotation 완료
[ ] 작업 시작 상태 기록
```

**다음 Phase 진입 조건:** Secret 상태가 확인되고 `upgrade/v2` Branch가 준비되었을 것.

---

# Phase 1 — 기존 코드 기준선 확보

## 목표
2022년 코드가 아무것도 수정하지 않은 상태에서 어디까지 동작하는지 확인한다.

```bash
node -v
npm -v
npm ci
npm run build
npm test
npm run start:dev
```

기존 Application은 MySQL 연결이 필요하므로, 실행 실패 시 DB 환경 문제와 코드 문제를 구분한다.

## 확인 대상

```text
User CRUD
Board
CompanyInfo
Logger
Access Log Interceptor
Config
Entity
Entity Relation
Test
DB 연결 방식
```

## 완료 기준선

```text
[ ] npm ci 결과 확인
[ ] build 결과 확인
[ ] 기존 test 결과 확인
[ ] Application 실행 여부 확인
[ ] DB 연결 문제와 코드 문제 구분
[ ] User / Board / CompanyInfo 구조 파악
[ ] Entity Relation 파악
[ ] Logger / Interceptor 파악
[ ] 기존 문제 목록 작성
```

Commit:

```text
chore: 업그레이드 기준선 확보
```

**다음 Phase 진입 조건:** 기존 코드 상태를 설명할 수 있고, 실패 원인이 있다면 기록했을 것.

---

# Phase 2 — Secret 제거 + Config 1차 정리

## 목표
Repository에서 실제 Secret을 제거하고 환경변수 기반 구조로 전환한다.

```text
.env
.env.example
```

`.env.example`

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

## 완료 기준선

```text
[ ] .env가 .gitignore에 포함됨
[ ] .env.example 존재
[ ] 실제 Secret이 Repository에 없음
[ ] Application이 환경변수에서 설정을 읽음
[ ] build 정상
[ ] 기존 동작 유지
```

Commit:

```text
chore: 환경변수 기반 설정 구조로 전환
```

**다음 Phase 진입 조건:** 민감정보가 Git에서 분리되고 기존 Application 동작이 유지될 것.

---

# Phase 3 — NestJS 8 → 9

## 검증

```bash
npm run lint
npm run build
npm test
npm run start:dev
```

## 완료 기준선

```text
[ ] NestJS 9
[ ] Dependency conflict 없음
[ ] lint 성공
[ ] build 성공
[ ] test 성공
[ ] 기존 API Regression 없음
```

Commit:

```text
chore: NestJS 9 업그레이드 및 호환성 수정
```

---

# Phase 4 — NestJS 9 → 10

## 완료 기준선

```text
[ ] NestJS 10
[ ] lint 성공
[ ] build 성공
[ ] test 성공
[ ] 기존 기능 Regression 없음
```

Commit:

```text
chore: NestJS 10 업그레이드 및 호환성 수정
```

---

# Phase 5 — Node.js 24 + TypeScript 5

`.nvmrc`

```text
24
```

`package.json`

```json
{
  "engines": {
    "node": ">=24"
  }
}
```

TypeScript:

```bash
npm i -D typescript@^5 @types/node@^24
```

우선 `target`만 `ES2023`으로 조정하고 `strict`는 아직 켜지 않는다.

## 완료 기준선

```text
[ ] node -v → v24
[ ] TypeScript 5.x
[ ] npm install 정상
[ ] build 성공
[ ] test 성공
[ ] Application 실행 성공
```

Commit:

```text
chore: Node.js 24 및 TypeScript 5 환경으로 전환
```

---

# Phase 6 — NestJS 10 → 11

기존 `lint`에 `--fix`가 포함되어 있다면 검증용과 수정용으로 분리한다.

```json
{
  "scripts": {
    "lint": "eslint \"{src,test}/**/*.ts\"",
    "lint:fix": "eslint \"{src,test}/**/*.ts\" --fix"
  }
}
```

필요 시 ESLint 9, Prettier 3은 별도 Commit으로 분리한다.

## 완료 기준선

```text
[ ] NestJS 11
[ ] npm run lint가 파일을 수정하지 않음
[ ] lint 성공
[ ] build 성공
[ ] test 성공
[ ] Application 실행 성공
```

Commit:

```text
chore: NestJS 11 업그레이드 및 호환성 수정
```

---

# Phase 7 — NestJS 12 검토

NestJS 11을 안전지대로 확보한 뒤 다음 패키지 호환성을 확인한다.

```text
@nestjs/typeorm
@nestjs/config
nest-winston
nestjs-typeorm-paginate
```

문제 없으면 NestJS 12로 올리고, 문제가 있으면 NestJS 11을 유지한다.

## 완료 기준선

성공:

```text
[ ] NestJS 12
[ ] CommonJS 유지
[ ] lint/build/test/run 정상
```

보류:

```text
[ ] NestJS 11 유지
[ ] NestJS 12 보류 이유 기록
```

---

# Phase 8 — TypeORM 0.3 → 1.x

## 목표
DB Engine은 아직 MySQL을 유지하면서 ORM 자체만 업그레이드한다.

확인 대상:

```text
find
findOne
findOneBy
save
update
remove
User → Board Relation
null 조건
pagination
```

## 완료 기준선

```text
[ ] TypeORM 1.x
[ ] Entity 정상 로딩
[ ] Repository 정상 동작
[ ] User CRUD 정상
[ ] Relation Query 정상
[ ] Pagination 처리 정상 또는 대안 결정
[ ] Migration CLI 실행 가능
[ ] TypeORM 관련 Test 정상
```

Commit:

```text
refactor: TypeORM 1.x 마이그레이션
```

**다음 Phase 진입 조건:** 기존 MySQL 환경에서 TypeORM 1.x가 완전히 정상 동작할 것.

---

# Phase 9 — MySQL → PostgreSQL 전환

## 목표

```text
MySQL
  ↓
PostgreSQL
```

Package:

```bash
npm uninstall mysql2
npm install pg
```

환경변수:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=nestjs
```

TypeORM:

```text
type=mysql
→
type=postgres
```

MySQL 종속 Column Type이 있는지 확인한다.

날짜 Column은 필요하면 다음 형태를 검토한다.

```ts
@CreateDateColumn({
  type: 'timestamptz',
})
createdAt: Date;

@UpdateDateColumn({
  type: 'timestamptz',
})
updatedAt: Date;
```

## 완료 기준선

```text
[ ] mysql2 제거
[ ] pg 설치
[ ] PostgreSQL 실행
[ ] TypeORM PostgreSQL 연결 성공
[ ] PostgreSQL Migration 생성 성공
[ ] Migration 실행 성공
[ ] Table 생성 확인
[ ] User Create 정상
[ ] User Read 정상
[ ] User Update 정상
[ ] User Delete 정상
[ ] Relation Query 정상
[ ] Date Column 정상
```

Commit:

```text
refactor: 데이터베이스를 PostgreSQL로 전환
```

**다음 Phase 진입 조건:** MySQL 없이 PostgreSQL만으로 핵심 CRUD가 정상 동작할 것.

---

# Phase 10 — TypeScript strict 전환

순서:

```text
1. forceConsistentCasingInFileNames: true
2. noImplicitAny: true
3. strictNullChecks: true
4. strict: true
```

## 완료 기준선

```text
[ ] forceConsistentCasingInFileNames 적용
[ ] noImplicitAny 적용
[ ] strictNullChecks 적용
[ ] strict: true
[ ] 불필요한 any 없음
[ ] 불필요한 ! 남용 없음
[ ] build 성공
[ ] test 성공
```

Commit:

```text
chore: TypeScript strict 모드 전환
```

---

# Phase 11 — Project 구조 현대화

최종 목표 구조:

```text
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── logger/
├── config/
├── database/
│   ├── migrations/
│   └── typeorm.config.ts
├── health/
├── modules/
│   └── users/
│       ├── dto/
│       ├── entities/
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
├── app.module.ts
└── main.ts
```

Entity:

```text
@database/entity/user.entity.ts
→
modules/users/entities/user.entity.ts
```

VO:

```text
user-regist.vo.ts
→ create-user.dto.ts

user-update.vo.ts
→ update-user.dto.ts
```

날짜 처리:

```ts
@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
```

## 완료 기준선

```text
[ ] @database/entity 구조 제거
[ ] Entity가 각 Domain Module 내부에 존재
[ ] Global DatabaseModule에서 Entity 일괄 Export하지 않음
[ ] VO → DTO
[ ] Naming 정리
[ ] createdAt / updatedAt 적용
[ ] 기존 API Regression 없음
[ ] build/test 정상
```

---

# Phase 12 — Backend 공통 기반 완성

구성:

```text
Config Validation
Global ValidationPipe
Global Exception Filter
Health Check
Migration
Logging
```

Health:

```http
GET /health
```

```json
{
  "status": "ok"
}
```

Migration:

```ts
synchronize: false
```

Logging은 다음 중 결정한다.

```text
A. Winston + stdout
B. NestJS Logger + stdout
C. dev/prod 별도 출력
```

## 완료 기준선

```text
[ ] 올바르지 않은 ENV → 시작 실패
[ ] 올바른 ENV → 정상 시작
[ ] ValidationPipe 정상
[ ] HTTP Error Response 형식 통일
[ ] GET /health → 200
[ ] synchronize: false
[ ] migration:generate 정상
[ ] migration:run 정상
[ ] migration:revert 정상
[ ] Logging 정책 확정 및 적용
```

---

# Phase 13 — Test 정비

최소 Test:

```text
User Create
User Find
User Update
존재하지 않는 User
GET /health
ENV Validation
```

## 완료 기준선

```text
[ ] User Create Test
[ ] User Find Test
[ ] User Update Test
[ ] 없는 User 처리 Test
[ ] Health e2e Test
[ ] ENV Validation Test
[ ] npm test 전체 성공
```

---

# Phase 14 — Docker

구조:

```text
Docker Compose
├── app
└── postgres
```

Dockerfile:

```text
Multi-stage Build
Production Dependency 분리
non-root User
.dockerignore
```

## 완료 기준선

```text
[ ] PostgreSQL Container 정상
[ ] App Container 정상
[ ] App → PostgreSQL 연결
[ ] Migration 실행
[ ] /health 정상
[ ] multi-stage Dockerfile
[ ] non-root App Container
[ ] .dockerignore 적용
```

---

# Phase 15 — GitHub Actions

Pipeline:

```text
Push / Pull Request
        ↓
npm ci
        ↓
npm run lint
        ↓
npm run build
        ↓
npm test
```

Node.js 24 기준.

## 완료 기준선

```text
[ ] PR 생성 시 Workflow 실행
[ ] npm ci 성공
[ ] lint 성공
[ ] build 성공
[ ] test 성공
[ ] 실패 단계가 GitHub에서 확인 가능
```

---

# Phase 16 — README + Boilerplate v2.0 종료

README 포함 내용:

```text
1. 소개
2. 기술 스택
3. 프로젝트 구조
4. 실행 방법
5. 환경변수
6. PostgreSQL / Migration
7. Logging
8. Validation / Exception
9. Test
10. Docker
11. CI
12. 설계 판단
13. 2022 → 2026 Upgrade 기록
14. 넣지 않은 것과 이유
```

Upgrade 기록:

```text
Node.js       18 → 24
TypeScript    4.3 → 5.x + strict
NestJS        8 → 9 → 10 → 11 (12 검토)
TypeORM       0.3 → 1.x
Database      MySQL → PostgreSQL
Config        YAML → Environment Variable + Schema Validation
Structure     Central Entity → Domain Module Entity
Added         Migration / Health / Docker / CI / Test
```

PostgreSQL 전환 설명 예:

> TypeORM 메이저 업그레이드와 DB Engine 교체를 동시에 진행하면 장애 원인 추적이 어려워질 수 있어, 먼저 기존 MySQL 환경에서 TypeORM 1.x 업그레이드를 검증한 뒤 별도 Phase에서 PostgreSQL로 전환했습니다.

## 완료 기준선

```text
[ ] 새 개발자가 README만 보고 실행 가능
[ ] .env.example 있음
[ ] PostgreSQL 실행법 있음
[ ] Migration 실행법 있음
[ ] Test 실행법 있음
[ ] Docker 실행법 있음
[ ] 프로젝트 구조 설명 있음
[ ] 2022 → 2026 변경사항 있음
[ ] 주요 기술 선택 이유 있음
```

---

# Boilerplate v2.0 최종 Gate

```bash
npm run lint
npm run build
npm test

docker compose up -d
npm run migration:run
npm run start:dev
```

Health:

```bash
curl http://localhost:3000/health
```

결과:

```json
{
  "status": "ok"
}
```

최종 Checklist:

```text
[ ] Node.js 24
[ ] NestJS 11 이상
[ ] NestJS 12 호환성 검토 완료
[ ] TypeScript 5 + strict
[ ] TypeORM 1.x
[ ] PostgreSQL
[ ] Config Validation
[ ] Domain Module 구조
[ ] DTO
[ ] Migration
[ ] Health
[ ] Exception Filter
[ ] Logging
[ ] Test
[ ] Docker
[ ] GitHub Actions
[ ] README
```

여기까지 완료되면 **Boilerplate 작업은 종료한다.**

---

# Phase 17 — 발주·재고 관리 프로젝트 시작

예상 Repository:

```text
restaurant-inventory-management
```

또는:

```text
inventory-order-management
```

기본 Stack:

```text
NestJS
TypeScript
TypeORM
PostgreSQL
Jest
Docker
GitHub Actions
```

예상 Domain:

```text
src/
└── modules/
    ├── items/
    ├── suppliers/
    ├── inventory/
    ├── inbound/
    ├── consumption/
    ├── order-schedules/
    └── purchase-orders/
```

---

# v2.1 — Authentication은 별도 작업

필요하면 v2.0 완료 후:

```bash
git checkout -b feat/auth
```

범위:

```text
회원가입
로그인
Access Token
Refresh Token
Refresh Token Hash 저장
Rotation
Reuse Detection
Logout
Guard
Auth Test
```

---

# 이번 Repository에서 하지 않을 것

```text
Prisma
Drizzle
Redis
Kafka
Queue
OAuth
RBAC
WebSocket
SSE
Kubernetes
EKS
Terraform
Argo CD
Karpenter
Prometheus
Grafana
```

ORM은 TypeORM을 유지한다.

DB는 최종적으로 PostgreSQL을 사용한다.

과도한 추상화도 하지 않는다.

```text
BaseController
BaseService
BaseRepository
AbstractCrudService
```

같은 구조는 실제 반복이 확인되기 전에는 만들지 않는다.

---

# 최종 실행 흐름

```text
2022 NestJS Boilerplate
        ↓
기존 상태 확인
        ↓
Secret 정리
        ↓
NestJS 8 → 9 → 10
        ↓
Node 24 + TypeScript 5
        ↓
NestJS 11 / 12 검토
        ↓
TypeORM 0.3 → 1.x
        ↓
MySQL → PostgreSQL
        ↓
TypeScript strict
        ↓
Domain 구조 현대화
        ↓
Config / Validation / Exception / Migration / Health
        ↓
Test
        ↓
Docker
        ↓
GitHub Actions
        ↓
README
        ↓
Boilerplate v2.0
        ↓
발주·재고 관리 시스템
```

---

# 최종 원칙

> **Phase가 끝났는지는 느낌으로 판단하지 않는다. 각 Phase의 완료 기준선을 통과했는지로 판단한다.**

> **Framework 업그레이드, ORM 업그레이드, DB 교체를 분리해 문제 발생 시 원인을 추적할 수 있게 한다.**

> **보일러플레이트를 완벽하게 만드는 것이 목적이 아니라, 실제 백엔드 프로젝트를 안정적으로 시작할 수 있는 기반을 만드는 것이 목적이다.**

> **Boilerplate v2.0이 완료되면 더 꾸미지 않고 발주·재고 관리 프로젝트로 넘어간다.**
