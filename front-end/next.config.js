module.exports = {
  async rewrites() {
    return [
      {
        source: '/users/:path*',
        destination: 'http://localhost:3000/users/:path*',
      },
    ];
  },
};
