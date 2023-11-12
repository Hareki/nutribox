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
      CRYPTOJS_IV: string;

      NEXT_PUBLIC_IK_ENDPOINT_URL: string;
      NEXT_PUBLIC_IK_PUBLIC_KEY: string;
      NEXT_PUBLIC_IK_AUTHENTICATION_ENDPOINT: string;
      IK_PRIVATE_KEY: string;

      MAILER_EMAIL: string;
      MAILER_PASSWORD: string;

      GOOGLE_API_KEY: string;
      NEXT_PUBLIC_PROVINCE_API_URL: string;

      NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
      PAYPAL_SECRET: string;

      EXCHANGE_RATE_API_URL: string;
      EXCHANGE_RATE_API_KEY: string;
    }
  }
}
