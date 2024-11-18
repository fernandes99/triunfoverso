export const config = {
  env: process.env.NODE_ENV,
  url: {
    datoGraphQL: process.env.DATOCMS_GRAPQL_URL!
  },
  token: {
    datoCms: process.env.DATOCMS_TOKEN!
  }
};
