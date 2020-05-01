const { join } = require('path')
const getFolderSize = require('get-folder-size')
const filesize = require('filesize')

const argv = process.argv
const path = join(process.cwd(), argv[argv.length - 1])

getFolderSize(path, (err, size) => {
  if (err) throw err
  const formatedSize = filesize(size)
  console.log(formatedSize)
  process.exit(0)
})
