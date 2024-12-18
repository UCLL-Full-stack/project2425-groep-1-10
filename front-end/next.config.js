module.exports = {
  async rewrites() {
    return [
      {
        source: '/users/:path*',
        destination: 'http://localhost:8080/users/:path*',
      },
    ];
  },
};
