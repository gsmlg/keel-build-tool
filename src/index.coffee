Package = require './package'

exports.build = (options)->
  pkg = new Package(options)
  pkg.build()
