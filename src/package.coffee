_ = require 'underscore'
fs = require 'fs'
vm = require 'vm'
handlebars = require 'handlebars'
{join, dirname, relative, extname} = require 'path'

handlebars.registerHelper 'json', (o)-> new handlebars.SafeString JSON.stringify o

handlebars.registerHelper 'makeName', (s)->
  str = s.replace '\'', '\\\''
    .replace '\\', '\\\\'
  new handlebars.SafeString str

handlebars.registerHelper 'transRequire', (code, map)->
  requireRegExp = /require\s*\(\s*['"]([^'"\s]+)['"]\s*\)/g
  transed = code.replace requireRegExp, (matched, name)->
    moduleName = map[name]
    if moduleName?
      strName = moduleName.replace '\'', '\\\''
        .replace '\\', '\\\\'
      '__modules__[\''+strName+'\']()'
    else
      matched
  transed

class Package
  commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg
  cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g

  constructor: (options)->
    @_options = _.extend {}, options
    @basePath = @_options.base
    @ignore = options.ignore
    @files = []

  # main method
  build: ->
    @check_and_load()
    @generateModules()
    tpl = fs.readFileSync join(__dirname, '..', 'template.hbs'), 'utf-8'
    template = handlebars.compile tpl
    @output = template({modules: @modules, name: @modules[0].name})

  check_and_load: ->
    file = @_options.input
    @resolve file

  resolve: (file)->
    throw new Error "#{file} not exists!" unless fs.existsSync file
    data = fs.readFileSync file, 'utf-8'
    script = @parse data, file
    dir = dirname file
    @files.push script
    script.deps.forEach (f)=>
      return if f in @ignore
      return if f in _.pluck(@files, 'path')
      @resolve join(@basePath, f)

  parse: (data, file)->
    script = {
      name: relative @basePath, file
      path: file
      code: data
    }
    deps = []

    data.replace commentRegExp, ''
      .replace cjsRequireRegExp, (matched, dep)->
        deps.push dep

    script.originDeps = deps
    script.depsMap = {}
    script.deps = deps.map (dep)=>
      origin = dep
      return dep unless /^(\.)*\//.test dep or dep in @ignore
      dep = join dirname(file), dep
      dep += '.js' unless extname dep is '.js'
      dep = relative @basePath, dep
      script.depsMap[origin] = dep
      dep

    script

  generateModules: ->
    @modules = @files.map (file)=>
      file.moduleCode = @getModuleCode file
      file

  getModuleCode: (file)->
    __func__ = null
    context =
      define: (name, deps, func)->
        if typeof name isnt 'string'
          func = deps
          deps = name
          name = null
        if !Array.isArray deps
          func = deps
          deps = []
        __func__ = func.toString()

    vm.runInNewContext file.code, context, file.name
    __func__

module.exports = Package
