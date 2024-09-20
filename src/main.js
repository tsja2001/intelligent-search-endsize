// 1.导入app
const app = require('./app')

app.listen(80, "0.0.0.0", () => {
  console.log('Server is running on port 80')
})
