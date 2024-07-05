const container = process.env.APPLE_CK_CONTAINER;
const environment = process.env.APPLE_CK_ENVIRONMENT;

export const getApiURL = () => {
  if (!container || !environment) {
    throw new Error("Invalid environment variables");
  }

  return `https://api.apple-cloudkit.com/database/1/${container}/${environment}/private`;
};
