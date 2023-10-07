export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_DOMAIN_URL: string;

      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: number;
      DB_HOST: string;

      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;

      CRYPTOJS_SECRET: string;

      NEXT_PUBLIC_IK_ENDPOINT_URL: string;
      NEXT_PUBLIC_IK_PUBLIC_KEY: string;
      NEXT_PUBLIC_IK_AUTHENTICATION_ENDPOINT: string;
      IK_PRIVATE_KEY: string;

      MAILER_EMAIL: string;
      MAILER_PASSWORD: string;
    }
  }
}
