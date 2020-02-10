const SpecReporter = require('jasmine-spec-reporter').SpecReporter

jasmine.getEnv().clearReporters() // remove default reporter logs
jasmine.getEnv().addReporter(
  new SpecReporter({
    // add jasmine-spec-reporter
    spec: {
      displayPending: true,
    },
  }),
)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
