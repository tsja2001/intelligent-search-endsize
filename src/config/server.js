const dotenv = require('dotenv')

// console.log(process.env.SERVER_PORT); // undefind

dotenv.config()

console.log(process.env.SERVER_PORT) // 8000

module.exports = { SERVER_PORT } = process.env
