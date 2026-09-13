import 'reflect-metadata';
import { validate } from './env.validation';

describe('env.validation', () => {
  const validEnv = {
    NODE_ENV: 'dev',
    PORT: '3010',
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_USERNAME: 'postgres',
    DB_PASSWORD: 'postgres',
    DB_DATABASE: 'nestjs',
  };

  it('올바른 ENV는 통과한다', () => {
    const result = validate(validEnv);
    expect(result.DB_HOST).toBe('localhost');
    expect(result.DB_PORT).toBe(5432);
  });

  it('NODE_ENV와 PORT는 없어도 통과한다', () => {
    const rest: Record<string, unknown> = { ...validEnv };
    delete rest.NODE_ENV;
    delete rest.PORT;
    expect(() => validate(rest)).not.toThrow();
  });

  it('DB_HOST가 없으면 실패한다', () => {
    const rest: Record<string, unknown> = { ...validEnv };
    delete rest.DB_HOST;
    expect(() => validate(rest)).toThrow('환경변수 검증 실패');
  });

  it('DB_PORT가 숫자가 아니면 실패한다', () => {
    expect(() => validate({ ...validEnv, DB_PORT: 'abc' })).toThrow(
      '환경변수 검증 실패',
    );
  });

  it('허용되지 않은 NODE_ENV 값은 실패한다', () => {
    expect(() => validate({ ...validEnv, NODE_ENV: 'staging' })).toThrow(
      '환경변수 검증 실패',
    );
  });
});
