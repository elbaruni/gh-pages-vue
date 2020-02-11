/* module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: "/contracts/"
}; */
module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: process.env.NODE_ENV === "production" ? "/contracts/" : "/"
};
