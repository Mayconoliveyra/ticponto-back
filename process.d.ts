declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: 'dev' | 'test' | 'production';

    ENABLED_CORS?: string[];

    DATABASE_HOST?: string;
    DATABASE_USER?: string;
    DATABASE_NAME?: string;
    DATABASE_PORT?: number;
    DATABASE_PASSWORD?: string;

    REDIS_PASSWORD?: string;

    JWT_SECRET?: string;
  }
}
