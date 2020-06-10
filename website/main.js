const express = require('express')
const { join } = require('path')

const PORT = parseInt(process.env.PORT) || 3000
const WEBSITE_ROOT_PATH = __dirname
const API_PATH = join(WEBSITE_ROOT_PATH, 'api')
const ANGULAR_APP_PATH = join(WEBSITE_ROOT_PATH, 'dist', 'value-objects-website')
const ANGULAR_APP_INDEX_PATH = join(ANGULAR_APP_PATH, 'index.html')

const server = express()
  .use(express.static(ANGULAR_APP_PATH, { index: false }))
  .use('/api', express.static(API_PATH))
  .get('*', (_, res) => res.sendFile(ANGULAR_APP_INDEX_PATH))

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
