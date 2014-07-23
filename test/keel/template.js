define(function(require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        setKey = require('./helpers').setObject;

    var _escape = function(str) {
        if (!str) {
            return '';
        }
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;'
        };
        var reg = /[&<>'"]/g;
        return ('' + str).replace(reg, function(match) {
            return map[match];
        });
    };

    // When customizing `templateSettings`,
    // if you don't want to define an interpolation,
    // evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        '\'': '\'',
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    module.exports = Keel.template = function(text, data, settings) {
        var render;
        settings = _.defaults({},
            settings,
            Keel.template.settings,
            _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.escape || noMatch).source, (settings.interpolate ||
                noMatch).source, (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = '__p+=\'';
        var safeVariables = [];
        text.replace(matcher,
            function(match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset)
                    .replace(escaper, function(match) {
                        return '\\' + escapes[match];
                    });

                if (escape) {
                    source += '\';' +
                        'try{' +
                        '__t=((__t=("' + _escape(escape) +
                        '"))==null?' +
                        '"":_.escape(__t));' +
                        '__p+=__t;}catch(e){};__p+=\'';
                }
                if (interpolate) {
                    source += '\';' +
                        'try{' +
                        '__t=((__t=("' + interpolate + '"))==null?' +
                        '"":__t);' +
                        '__p+=__t;}catch(e){};__p+=\'';
                }
                if (evaluate) {
                    source += '\';\n' + evaluate + '\n__p+=\'';
                }
                if (match) {
                    var matched = match.match(
                        /\b([a-zA-Z_][\w\.]*)\b/g);
                    safeVariables = safeVariables.concat(matched);
                }
                index = offset + match.length;
                return match;
            });
        source += '\';\n';

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) {
            source = 'with(obj||{}){\n' + source + '}\n';
        }

        var o = {};
        for (var i = 0; i < safeVariables.length; i++) {
            var key = safeVariables[i];
            if (!key) {
                continue;
            }
            setKey(o, key, '');
        }

        source = 'var __t,__p="",__j=Array.prototype.join,' +
            'print=function(){__p+=__j.call(arguments,"")};\n' +
            'var __tpl = window.Keel.template;' +
            '_.defaults(obj, __tpl.templateHelpers);\n' +
            '_.defaults(obj, ' + JSON.stringify(o) + ');\n' +
            source + 'return __p;';

        try {
            /* jshint ignore:start */
            render = new Function(settings.variable || 'obj', source);
            /* jshint ignore:end */
            // this could be store for precompile
            render.sourceCode = render.toString();
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) {
            return render(data);
        }

        var template = function(data) {
            return render.call(this, data);
        };

        // Provide the compiled function source as
        // a convenience for precompilation.
        template.source = 'function(obj){\n' + source + '}';

        return template;
    };

    _.extend(Keel.template, {
        templateHelpers: {
            '_': _
        },
        addHelpers: function(name, method) {
            var newHelpers = {};
            if (_.isString(name)) {
                newHelpers[name] = method;
            } else if (_.isObject(name)) {
                newHelpers = name;
            } else {
                return false;
            }
            return _.extend(Keel.template.templateHelpers, newHelpers);
        },
        settings: {
            evaluate: /\{\%([\s\S]+?)\%\}/g,
            interpolate: /\{\=([\s\S]+?)\}\}/g,
            escape: /\{\{([\s\S]+?)\}\}/g
        },
        get: function(view, name) {
            name = name || 'template';
            var source = view[name];
            if (_.isFunction(source)) {
                return source;
            }
            return Keel.template(Keel.$(source).html());
        }
    });

});