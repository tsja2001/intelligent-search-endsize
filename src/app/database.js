const mysql2 = require('mysql2/promise')
const mysql = require('mysql2')

const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

console.log('MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS', MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS);

const host = MYSQL_ADDRESS.split(':')[0]
const port = MYSQL_ADDRESS.split(':')[1]

console.log('host', host)
console.log('port', port)

// 1.创建连接池
const connectionPool = mysql.createPool({
  host: host,
  database: 'search',
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  port: port
})


// 2.获取连接是否成功
connectionPool.getConnection((err, connection) => {
  // 1.判断是否有错误信息
  if (err) {
    console.log('获取连接失败~', err)
    return
  }

  // 2.获取connection, 尝试和数据库建立一下连接
  connection.connect(err => {
    if (err) {
      console.log('和数据库交互失败', err)
    } else {
      console.log('数据库连接成功, 可以操作数据库~')
    }
  })
})


// 3.获取连接池中连接对象(promise)
const connection = connectionPool.promise()
// module.exports = connection


module.exports = {
  connection,
}
