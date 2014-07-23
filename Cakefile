{print} = require 'util'
{spawn} = require 'child_process'
BIN = 'node_modules/.bin/coffee'
BIN += '.cmd' if process.platform is 'win32'

task 'build', 'Build lib/ from src/', ->
  coffee = spawn BIN, ['-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'watch', 'Watch src/ for changes', ->
  coffee = spawn BIN, ['-w', '-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
