module.exports = {
    env: 'test',    
    server: {port: process.env.SERVER_PORT || 3000},
    db: {url:'mongodb://localhost/starwars-api-test'}
}