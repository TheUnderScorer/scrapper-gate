export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

export const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'staging':
      return Environment.Staging;

    case 'production':
      return Environment.Production;

    default:
      return Environment.Development;
  }
};
