path = require 'path'
join = path.join
fs = require 'fs'

{build} = require join(__dirname, '../src/index')

file = build {
  name: 'keel',
  ignore: ['backbone', 'underscore', 'jquery']
  base: __dirname
  input: join(__dirname, 'keel.js')
  output: join(__dirname, '', 'keel.build.js')
}

fs.writeFileSync join(__dirname, 'keel.build.js'), file
