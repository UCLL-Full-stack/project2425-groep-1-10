const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  async rewrites() {
    return [
      {
        source: '/users/:path*',
        destination: 'http://localhost:3000/users/:path*',
      },
    ];
  },
};
