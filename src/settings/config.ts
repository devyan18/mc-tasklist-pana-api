export const config = {
  port: process.env.PORT || 4000,
  uri: process.env.MONGODB_URI || 'mongodb://localhost/mongodb',
  secret: process.env.SECRET_KEY || 'secret',
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  accessCookieName: process.env.ACCESS_COOKIE_NAME ?? 'access_token',
};
