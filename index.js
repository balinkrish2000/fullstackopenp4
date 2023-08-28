const app = require('./app')
const { info, error } = require('./utils/logger')
const config = require('./utils/config')

const PORT = config.PORT
app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})