module.exports = {
    parser: 'babel-eslint',
    extends: 'standard',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    plugins: ['html', 'import'],
    rules: {
        indent: [2, 4],
        'import/extensions': ['error', 'never']
    }
}
