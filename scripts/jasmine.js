const Jasmine = require('jasmine')
const SpecReporter = require('jasmine-spec-reporter').SpecReporter

const specReporter = new SpecReporter({
  spec: {
    displayPending: true,
    displayStacktrace: 'pretty',
  },
})

const jasmine = new Jasmine()

jasmine.loadConfig({ spec_dir: 'dist', spec_files: ['**/*.spec.js'] })
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

jasmine.clearReporters()
jasmine.addReporter(specReporter)

jasmine.execute()
jasmine.onComplete(passed => {
  const code = passed ? 0 : 1
  process.exit(code)
})
