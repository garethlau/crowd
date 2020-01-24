// vue.config.js
const path = require('path');

module.exports = {
    devServer: {
        proxy: {
            '^/api/v1': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            },
            '^/api/v1/comment': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            },
            '^/api/v1/resource/file': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            },
            '^/api/v1/resource': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            },
            '^/foo': {
                target: '<other_url>'
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [path.resolve(__dirname, './src/styles/global.scss')]
        }
    }
};
