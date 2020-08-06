module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
        }
    },
    pages: {
        main: 'src/pages/Main/main.js',
        settings: 'src/pages/Settings/main.js'
    }
}