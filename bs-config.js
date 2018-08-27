module.exports = {
  port: process.env.PORT || 8080,
  files: ['./**/*.{html,htm,css,js}'],
  server:{
    baseDir: "./"
  }
};