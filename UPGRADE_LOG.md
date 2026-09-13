# Upgrade Log — Boilerplate v2

> 각 Phase의 실제 진행 결과와 발견 사항을 기록한다.
> 계획: [nestjs_backend_upgrade.md](./nestjs_backend_upgrade.md)

---

## Phase 0 — 보안 확인 + Branch 준비 (2026-09-13)

- `upgrade/v2` 브랜치 생성 완료. main에서 직접 작업하지 않음.
- Secret 스캔 결과:
  - `src/config/dev.yml`, `src/config/prod.yml`에 DB 비밀번호 `***REMOVED***` 하드코딩 (localhost MySQL root 계정). 외부 서비스 credential은 아니므로 Rotation 대상 없음. 단, **동일 비밀번호를 다른 곳에 재사용 중이라면 변경 필요.**
  - JWT/암호화 Secret(`access_key`, `refresh_key`, `refresh_encrypt_key`)은 placeholder이며 실제 사용 코드 없음.
- Secret 파일 자체 제거는 Phase 2에서 수행. Git 히스토리에는 남아 있음 (Public repo — 히스토리 정리는 별도 판단).

## Phase 1 — 기존 코드 기준선 확보 (2026-09-13)

환경: Windows 11, Node v24.15.0 (nvm), npm 11.12.1
(계획서는 Node 18 기준이었으나 로컬에 Node 24만 설치되어 있고 최종 목표가 Node 24이므로, 기준선을 Node 24에서 확보하고 그 사실을 기록한다.)

| 항목 | 결과 |
|---|---|
| `npm ci` | ✅ 성공 (810 packages) |
| `npm run build` | ✅ 성공 (dist 생성). TS 4.3의 deprecated API 경고 출력됨 |
| `npm test` | ⚠️ 7 suites 중 2 통과 / 5 실패 — 코드 문제가 아니라 jest 설정 문제 |
| 실행 (dist/main.js, NODE_ENV=dev) | ✅ 성공 — 포트 3010 리스닝, TypeORM MySQL 연결 성공 |

### 실행 확인 (Docker MySQL 8.0, database `sideproject`)

- 테이블은 `synchronize: false`라 자동 생성되지 않음 → 일회성 스크립트로 TypeORM synchronize 실행해 USER/BOARD/COMPANY_INFO 생성 후 확인.
- User CRUD 실제 호출 결과: **Create ✅ / List(pagination) ✅ / Read ✅ / Update ✅ / Delete ✅ / 삭제 후 조회 404 ✅**
- Board 목록 조회 ✅ (빈 목록).
- CompanyInfo: **컨트롤러가 빈 껍데기** (`@Controller('companyinfo')`만 있고 라우트 없음) → 모든 요청 404. Service는 구현되어 있음. (2022년 커밋 메시지 "controller 작성해야함"과 일치)

### 기존 문제 목록

**테스트**
1. jest `rootDir: src`에 `src/...` 절대 경로 import를 해석할 moduleNameMapper가 없어 5개 suite가 모듈 해석 실패로 실행 불가. (Phase 13에서 정비)

**설정/보안**
2. dev.yml / prod.yml에 DB 비밀번호 하드코딩. 두 파일 내용이 사실상 동일. (Phase 2)
3. `start:prod`가 `--watch` 모드로 실행됨.
4. `lint` 스크립트에 `--fix`가 포함되어 검증과 수정이 분리 안 됨. (Phase 6)
5. `@types/js-yaml`, `@types/multer`가 devDependencies가 아닌 dependencies에 있음.
5-1. `config.multer.ts`가 `uuid` 패키지를 import하지만 package.json에 직접 의존성으로 없음 (transitive로 동작 중).
5-2. CompanyInfo 컨트롤러 미구현 (라우트 없음 → 전부 404).

**코드 버그 (기존)**
6. `companyinfo.service.ts` `updateCompanyInfo`: `save({ ...savedData, data })` — `data`를 스프레드하지 않아 업데이트가 적용되지 않음.
7. `board.service.ts` `updateBoard`: 조회만 하고 실제 업데이트를 수행하지 않음. `findOneBoard`의 `ctgy` 파라미터 미사용.
8. `board.service.ts` `insertBoard`: `writer: writerID` — string을 User relation 필드에 직접 할당 (타입 불일치).
9. `user.service.ts`: 사용하지 않는 `import e from 'express'`.

**네이밍/오타**
10. `fildOneUser`(→ findOneUser), `BaordCategory`(→ BoardCategory), `accessExpriesIn`(→ ExpiresIn), `orginName` 등. (Phase 11 정리)

**DB/Entity**
11. 날짜 컬럼이 MySQL 종속 `datetime` 타입 + `new Date().toJSON()` 문자열 저장. `@CreateDateColumn`/`@UpdateDateColumn` 미사용. (Phase 9/11)
12. `Board.contents`/`file`이 MySQL 종속 `longtext`, `hit`가 `unsigned bigint`. (Phase 9)
13. Entity가 `@database/entity`에 중앙 집중, DatabaseModule이 일괄 export. (Phase 11)
14. `User.boards`가 `lazy: true` relation.
15. `synchronize: false`인데 Migration 체계 없음 — 테이블은 수동 생성 전제. (Phase 12)

**구조 파악 요약**
- User: uuid(PK, generated uuid) / userID / name / pwd(bcryptjs hash) / email / phone / authority / registAt / updateAt. User CRUD + pagination(nestjs-typeorm-paginate).
- Board: uuid / category(notice|qna) / title / contents / hit / file / 날짜들. `writer` ManyToOne→User (CASCADE). 파일 업로드는 AnyFilesInterceptor.
- CompanyInfo: uuid / name / ceo / email / company_reg_no / company_address. 단순 CRU.
- Config: js-yaml로 dev.yml/prod.yml 로드 → `ConfigModule.forRoot({ load })`.
- Logger: winston-daily-rotate-file 기반 FileConsoleLogger(ConsoleLogger 상속), FileQueryLogger(TypeORM 쿼리 로그 파일 기록).
- Interceptor: AccessLogInterceptor — 요청 헤더 + 응답 전문을 로그로 남김.

## Phase 2 — Secret 제거 + Config 1차 정리 (2026-09-13)

- dev.yml/prod.yml 삭제, config.ts를 process.env 기반으로 재작성 (config key 구조는 그대로 유지해 소비 코드 무변경).
- `.env`(gitignore) / `.env.example` 추가. js-yaml 의존성 제거.
- 검증: build ✅ / .env 기반 실행 + User CRUD ✅ / test 기준선 동일(2 pass, 5 fail — 기존 jest 문제).

## Phase 3 — NestJS 8 → 9 (2026-09-13)

- @nestjs/{common,core,platform-express,cli,schematics,testing} → 9.4.3 (일괄 업그레이드로 peer 충돌 해소, node_modules/lockfile 클린 재설치).
- TypeScript는 기존 `^4.3.5` 범위 내에서 4.9.5로 해석됨 (@nestjs/cli 9 요구사항).
- 코드 수정 필요 없었음 — 기존 코드가 NestJS 9 API와 호환.
- 발견: `npm run lint`가 `--fix` 포함이라 전체 파일의 EOL을 LF로 재작성함(콘텐츠 변경 없음, git diff 비어 있음) → 원복. Phase 6에서 lint/lint:fix 분리 예정.
- 게이트: lint ✅(0 errors, 13 warnings-기존) / build ✅ / test 기준선 동일 ✅ / 실행 + User CRUD·Board 목록 ✅.

## Phase 4 — NestJS 9 → 10 (2026-09-13)

- @nestjs/{common,core,platform-express} 10.4.22, @nestjs/cli·schematics·testing 10.x.
- 생태계 동반 업그레이드: @nestjs/config 2→3.3.0, @nestjs/typeorm 9→10.0.2, @nestjs/mapped-types 1→2.1.1.
- nest-winston·nestjs-typeorm-paginate는 기존 범위 내 최신 해석으로 Nest 10 peer 충족.
- 코드 수정 필요 없었음. TypeScript 4.9.5 유지 (Phase 5에서 5.x 예정).
- 게이트: lint ✅(0 errors) / build ✅ / test 기준선 동일 ✅ / 실행 + User CRUD ✅.

## Phase 5 — Node.js 24 + TypeScript 5 (2026-09-13)

- `.nvmrc`(24), `engines.node >=24` 추가. TypeScript 5.9.3, @types/node 24.
- tsconfig `target: ES2023` (strict는 Phase 10 예정대로 아직 끔).
- ts-jest 28 유지 (peer `typescript >=4.3`이라 TS5 허용, 테스트 기준선 동일 확인) — jest 29 업그레이드는 필요 시 별도.
- TS 4.x에서 나오던 nest build 시 deprecated API 경고 사라짐.
- 게이트: node v24.15.0 / install ✅ / build ✅ / test 기준선 동일 ✅ / 실행 + User CRUD ✅.

## Phase 6 — NestJS 10 → 11 (2026-09-13)

- 사전 커밋(분리): lint/lint:fix 스크립트 분리, Prettier 3 + eslint-plugin-prettier 5 + eslint-config-prettier 9 (Nest 11 schematics가 prettier ^3 peer 요구), `.prettierrc`에 `endOfLine: auto`.
- @nestjs/{common,core,platform-express} 11.2.3 (Express 5 기반), @nestjs/config 4.0.4, @nestjs/typeorm 11.0.3, cli/schematics/testing 11.x, @types/express ^5.
- reflect-metadata 0.1.14 유지 (Nest 11 peer가 ^0.1.12 허용).
- 코드 수정 필요 없었음 — 단순 `:param` 라우트라 Express 5 라우팅 변경 영향 없음.
- 게이트: `npm run lint`가 파일 미수정 ✅ / lint 0 errors ✅ / build ✅ / test 기준선 동일 ✅ / 실행 + User CRUD·Board ✅.

## Phase 7 — NestJS 12 검토 (2026-09-13) → **11 유지, 12 보류**

검토 시점 최신: @nestjs/core 12.0.1 (Node >= 20).

| 패키지 | Nest 12 peer 지원 |
|---|---|
| @nestjs/typeorm 12.0.1 | ✅ (`^10 \|\| ^11 \|\| ^12`, typeorm `^0.3 \|\| ^1.0.0-dev`) |
| @nestjs/config 12.0.0 | ✅ (`^11 \|\| ^12`) |
| @nestjs/mapped-types 12.0.0 | ✅ |
| nest-winston 1.10.2 | ❌ peer `^5 ~ ^11`까지만 |
| nestjs-typeorm-paginate 최신 | ❌ peer `^5 ~ ^11`까지만 |

**보류 이유:**
1. nest-winston, nestjs-typeorm-paginate가 `@nestjs/common ^12`를 peer로 허용하지 않아 의존성 충돌 없이 설치 불가 (게이트 "Dependency conflict 없음" 위반).
2. 12.0.1은 메이저 초기 릴리스로 생태계 추종이 아직 안 됨.

→ 두 패키지가 Nest 12 지원을 추가하면 재검토. CommonJS 유지 중이므로 추후 전환 부담 낮음.
