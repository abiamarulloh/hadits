module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        // destination: "http://localhost:3000/api/:path*", // for local
        // destination: "https://hadist-app-backend.herokuapp.com/api/:path*", // for prod heroku
        destination: "https://api.hadits.amarabi.my.id/api/:path*", // for prod amarabi.com
      },
    ];
  };
  return {
    rewrites,
  };
};