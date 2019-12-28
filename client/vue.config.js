// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      "^/api/v1": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true
      },
      "^/foo": {
        target: "<other_url>"
      }
    }
  }
};
