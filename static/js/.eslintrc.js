module.exports = {
    parser: 'babel-eslint',
    extends: 'standard',
    env: {
        browser: true
    },
    plugins: ['html'],
    rules: {
        indent: [2, 4]
    },
    globals: {
        FS: true,
        Util: true,
        AudioPlayer: true,
        AutoScrollAnimator: true
    }
}
