export enum Environment {
  Development = 'development',
  Production = 'production',
}

export const getEnvironment = () =>
  process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Development;
