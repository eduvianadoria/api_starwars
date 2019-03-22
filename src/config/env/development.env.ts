module.exports = {
    env: 'development',
    server: {port: process.env.SERVER_PORT || 3000},
    db: {url:'mongodb://localhost/starwars-api-dev'}
}