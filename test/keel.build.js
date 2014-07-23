define(function(require, exports, module){
module.exports = (function(require){
var __modules__ = {};

  __modules__['keel.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./keel/router":"keel\\router.js","./keel/sync":"keel\\sync.js","./keel/template":"keel\\template.js","./keel/helpers":"keel\\helpers.js","./keel/events":"keel\\events.js","./keel/model":"keel\\model.js","./keel/collection":"keel\\collection.js","./keel/view":"keel\\view.js","./keel/layout":"keel\\layout.js","./keel/itemview":"keel\\itemview.js","./keel/collectionview":"keel\\collectionview.js","./keel/compositeview":"keel\\compositeview.js","./keel/tree":"keel\\tree.js","./keel/i18n":"keel\\i18n.js","./keel/validate":"keel\\validate.js","./keel/application":"keel\\application.js","./keel/core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    require('./keel/router');
    require('./keel/sync');
    require('./keel/template');
    require('./keel/helpers');
    require('./keel/events');
    require('./keel/model');
    require('./keel/collection');
    require('./keel/view');
    require('./keel/layout');
    require('./keel/itemview');
    require('./keel/collectionview');
    require('./keel/compositeview');
    require('./keel/tree');
    require('./keel/i18n');
    require('./keel/validate');
    require('./keel/application');

    module.exports = require('./keel/core');

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\router.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone;

    module.exports = Keel.Router = Backbone.Router.extend({
        constructor: function(options) {
            _.extend(this, _.pick(options || {}, ['app', 'layout']));
            return Backbone.Router.apply(this, arguments);
        }
    });

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\core.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    // Define and export the Keel namespace
    var Keel = window.Keel = {};

    // initialzie Keel.UI object
    Keel.UI = {};

    // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
    // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests
    // via the `_method` parameter and set a `X-Http-Method-Override` header.
    Keel.emulateHTTP = false;

    // Turn on `emulateJSON` to support legacy servers
    // that can't deal with direct `application/json` requests.
    // will encode the body as `application/x-www-form-urlencoded`
    // instead and will send the model in a form param named `model`.
    Keel.emulateJSON = false;

    // Get the DOM manipulator for later use
    Keel.$ = Backbone.$ = $;

    // store underscore and Backbone in keel namespace
    Keel._ = _;
    Keel.Backbone = Backbone;

    // Set the default implementation of `Backbone.ajax` to proxy through to `$`
    // Override this if you'd like to use a different library.
    Keel.ajax = function() {
        return Backbone.$.ajax.apply(Backbone.$, arguments);
    };

    Keel.extend = Backbone.Model.extend;

    Keel.$.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            var name = this.name.replace('[]', '');
            if (o[name]) {
                if (!o[name].push) {
                    o[name] = [o[name]];
                }
                o[name].push(this.value || '');
            } else {
                if (this.name.indexOf('[]') < 0) {
                    o[name] = this.value || '';
                } else {
                    o[name] = this.value ? [this.value] : [''];
                }
            }
        });
        return o;
    };

    module.exports = Keel;

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\sync.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./helpers":"keel\\helpers.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        throwError = require('./helpers')
        .throwError;

    // Keel.sync
    // -------------

    var noXhrPatch = typeof window !== 'undefined' &&
        !!window.ActiveXObject &&
        !(window.XMLHttpRequest &&
            (new XMLHttpRequest())
            .dispatchEvent);

    // Map from CRUD to HTTP for our default `Keel.sync` implementation.
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'patch': 'PATCH',
        'delete': 'DELETE',
        'read': 'GET',
        'option': 'POST'
    };

    // Override this function to change the manner in which Keel persists
    // models to the server. You will be passed the type of request, and the
    // model in question. By default, makes a RESTful Ajax request
    // to the model's `url()`. Some possible customizations could be:
    //
    // * Use `setTimeout` to batch rapid-fire updates into a single request.
    // * Send up the models as XML instead of JSON.
    // * Persist models via WebSockets instead of Ajax.
    //
    // Turn on `Keel.emulateHTTP` in order to send `PUT` and `DELETE` requests
    // as `POST`, with a `_method` parameter containing the true HTTP method,
    // as well as all requests with the body as
    // `application/x-www-form-urlencoded` instead of `application/json`
    // with the model in a param named `model`.
    // Useful when interfacing with server-side languages like **PHP** that make
    // it difficult to read the body of `PUT` requests.
    module.exports = Keel.sync = function(method, model, options) {
        var type = methodMap[method];

        // Default options, unless specified.
        _.defaults(options || (options = {}), {
            emulateHTTP: Keel.emulateHTTP,
            emulateJSON: Keel.emulateJSON
        });

        // Default JSON-request options.
        var params = {
            type: type,
            dataType: 'json'
        };

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = _.result(model, 'url') ||
                throwError('You must specified a url for sync', 'urlError');
            if (method === 'option') {
                params.url = params.url +
                    (params.url[params.url.length - 1] === '/' ? '' : '/') +
                    options.action;
            }
        }

        // Ensure that we have the appropriate request data.
        if (options.data == null && model && (method !== 'read')) {
            params.contentType = 'application/json';
            params.data = JSON.stringify(options.attrs ||
                model.toJSON(options));
        }

        // For older servers,
        // emulate JSON by encoding the request into an HTML-form.
        if (options.emulateJSON) {
            params.contentType = 'application/x-www-form-urlencoded';
            params.data = params.data ? {
                model: params.data
            } : {};
        }

        // For older servers, emulate HTTP by
        // mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (options.emulateHTTP && (type !== 'GET' && type !== 'POST')) {
            params.type = 'POST';
            if (options.emulateJSON) {
                params.data._method = type;
            }
            var beforeSend = options.beforeSend;
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', type);
                if (beforeSend) {
                    return beforeSend.apply(this, arguments);
                } else {
                    return void(0);
                }
            };
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !options.emulateJSON) {
            params.processData = false;
        }

        // If we're sending a `PATCH` request,
        // and we're in an old Internet Explorer
        // that still has ActiveX enabled by default,
        // override jQuery to use that for XHR instead.
        // Remove this line when jQuery supports `PATCH` on IE8.
        if (params.type === 'PATCH' && noXhrPatch) {
            params.xhr = function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            };
        }

        // add method to tell filters if this is an option action
        options.requestMethod = method;

        // set request filter
        var computedData = requestFilter(params, options, model);

        // Make the request, allowing the user to override any Ajax options.
        params = computedData.params;

        var xhr = options.xhr = Keel.ajax(params);

        // fire event at ajax start;
        Keel.sync.trigger('request', model, xhr, params);
        model.trigger('request', model, xhr, options);

        // set response filter
        xhr.then(function(resp) {
            return responseFilter(null, model, resp, params);
        }, function(resp) {
            return responseFilter(resp.responseText, model, resp,
                params);
        });

        // fire event after ajax end
        xhr.always(function(resp) {
            Keel.sync.trigger('response', model, resp, options);
        });

        return xhr;

    };

    _.extend(Keel.sync, Keel.Events);

    var requestFilters = [];

    var responseFilters = [];

    /**
     * 添加callback对所有请求进行过滤
     *
     * callback
     * 接受一个参数 hash 对象
     *     params: 传给$.ajax的参数
     *     model: 执行操作的model
     * !需要把修改过的对象返回
     */
    Keel.sync.addRequestFilter = function(callback) {
        requestFilters.push(callback);
    };

    /**
     * 添加callback对所有响应做过滤
     *
     * callback
     * 接受参数为一个对象，包含：
     *     error 错误信息
     *     response ajax响应对象
     *     model 操作模型
     *     params 传入$.ajax的参数
     * !需要把修改过的对象返回
     */
    Keel.sync.addResponseFilter = function(callback) {
        responseFilters.push(callback);
    };

    function requestFilter(params, options, model) {
        params = _.extend(params, options);
        var args = {
            params: params,
            model: model
        };
        return execFilters(requestFilters, args);
    }

    function responseFilter(error, model, resp, params) {
        var args = {
            error: error,
            model: model,
            response: resp,
            params: params
        };
        return execFilters(responseFilters, args)
            .response;
    }

    function execFilters(filters, args) {
        for (var i = 0, j = filters.length; i < j; i++) {
            var filter = filters[i];
            args = filter(args);
        }
        return args;
    }

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\helpers.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core');

    var helpers = module.exports = Keel.hepers = {};

    helpers.throwError = function throwError(message, name) {
        var error = new Error(message);
        error.name = name || 'Error';
        throw error;
    };

    helpers.setObject = function(obj, key, value, unset) {
        var args = [].slice.call(arguments),
            v, i, l;

        if (args.length < 2) {
            return obj;
        }

        var keys = key.split('.');

        if (args.length === 2) {
            v = void 0;
            for (i = 0, l = keys.length; i < l; i++) {
                if (i === (l - 1)) {
                    return i === 0 ?
                        obj[keys[i]] :
                        (typeof v === 'object' ? v[keys[i]] : (v = void(0)));
                } else if (v) {
                    if ((typeof v[keys[i]]) === 'object') {
                        v = v[keys[i]];
                    } else {
                        return void(0);
                    }
                } else {
                    v = obj[keys[i]];
                }
            }
        }
        if (args.length >= 3) {
            v = void 0;
            for (i = 0, l = keys.length; i < l; i++) {
                if (i === (l - 1)) {
                    if (v) {
                        if (unset) {
                            delete v[keys[i]];
                        } else {
                            (v[keys[i]] = value);
                        }
                    } else {
                        if (unset) {
                            delete obj[keys[i]];
                        } else {
                            (obj[keys[i]] = value);
                        }
                    }
                } else if (v) {
                    v = (typeof v[keys[i]] === 'object') ?
                        v[keys[i]] : (v[keys[i]] = {});
                } else {
                    v = obj[keys[i]] || (obj[keys[i]] = {});
                }
            }
        }
        return obj;
    };

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\template.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./helpers":"keel\\helpers.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
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

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\events.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._;

    // shot cut
    var slice = Array.prototype.slice,
        hasPorp = Object.prototype.hasOwnProperty;

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function(obj, action, name, rest) {
        if (!name) {
            return true;
        }

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                if (hasPorp.call(name, key)) {
                    obj[action].apply(obj, [key, name[key]].concat(rest));
                }
            }
            return false;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, length = names.length; i < length; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function(events, args) {
        var ev, i = -1,
            l = events.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l) {
                    (ev = events[i])
                        .callback.call(ev.ctx);
                }
                return;
            case 1:
                while (++i < l) {
                    (ev = events[i])
                        .callback.call(ev.ctx, a1);
                }
                return;
            case 2:
                while (++i < l) {
                    (ev = events[i])
                        .callback.call(ev.ctx, a1, a2);
                }
                return;
            case 3:
                while (++i < l) {
                    (ev = events[i])
                        .callback.call(ev.ctx, a1, a2, a3);
                }
                return;
            default:
                while (++i < l) {
                    (ev = events[i])
                        .callback.apply(ev.ctx, args);
                }
                return;
        }
    };

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = {

        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        on: function(name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !
                callback) {
                return this;
            }
            this._events = this._events || {};
            var events = this._events[name] || (this._events[name] = []);
            events.push({
                callback: callback,
                context: context,
                ctx: context || this
            });
            return this;
        },

        // Bind an event to only be triggered a single time.
        // After the first time the callback is invoked,
        // it will be removed.
        once: function(name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) ||
                !
                callback) {
                return this;
            }
            var self = this;
            var once = _.once(function() {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function(name, callback, context) {
            if (!this._events || !eventsApi(this, 'off', name, [
                callback,
                context
            ])) {
                return this;
            }

            // Remove all callbacks for all events.
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }

            var names = name ? [name] : _.keys(this._events);
            for (var i = 0, length = names.length; i < length; i++) {
                name = names[i];

                // Bail out if there are no events stored.
                var events = this._events[name];
                if (!events) {
                    continue;
                }

                // Remove all callbacks for this event.
                if (!callback && !context) {
                    delete this._events[name];
                    continue;
                }

                // Find any remaining events.
                var remaining = [];
                for (var j = 0, k = events.length; j < k; j++) {
                    var event = events[j];
                    if (
                        callback && callback !== event.callback &&
                        callback !== event.callback._callback ||
                        context && context !== event.context
                    ) {
                        remaining.push(event);
                    }
                }

                // Replace events if there are any remaining.
                // Otherwise, clean up.
                if (remaining.length) {
                    this._events[name] = remaining;
                } else {
                    delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback
        // to receive the true name of the event as the first argument).
        trigger: function(name) {
            if (!this._events) {
                return this;
            }
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) {
                return this;
            }
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) {
                triggerEvents(events, args);
            }
            if (allEvents) {
                triggerEvents(allEvents, arguments);
            }
            return this;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
            }
            var remove = !name && !callback;
            if (!callback && typeof name === 'object') {
                callback = this;
            }
            if (obj) {
                (listeningTo = {})[obj._listenId] = obj;
            }
            for (var id in listeningTo) {
                if (hasPorp.call(listeningTo, id)) {
                    obj = listeningTo[id];
                    obj.off(name, callback, this);
                    if (remove || _.isEmpty(obj._events)) {
                        delete this._listeningTo[id];
                    }
                }
            }
            return this;
        }

    };

    var listenMethods = {
        listenTo: 'on',
        listenToOnce: 'once'
    };

    // Inversion-of-control versions of `on` and `once`. Tell *this* object to
    // listen to an event in another object ... keeping track of what it's
    // listening to.
    _.each(listenMethods, function(implementation, method) {
        Events[method] = function(obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') {
                callback = this;
            }
            obj[implementation](name, callback, this);
            return this;
        };
    });

    // Aliases for backwards compatibility.
    Events.bind = Events.on;
    Events.unbind = Events.off;
    Events.emit = Events.trigger;

    module.exports = Events;

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\model.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./sync":"keel\\sync.js","./events":"keel\\events.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone,
        sync = require('./sync'),
        Events = require('./events');

    module.exports = Keel.Model = Backbone.Model.extend({
        sync: function() {
            return sync.apply(this, arguments);
        },

        option: function(action, options) {
            options = options || {};
            var suc = options.suc,
                err = options.error,
                model = this;
            options.success = function(resp) {
                if (suc) {
                    suc(model, resp, options);
                }
                model.trigger('sync', model, resp, options);
            };
            options.error = function(resp) {
                if (err) {
                    err(model, resp, options);
                }
                model.trigger('error', model, resp, options);
            };
            return this.sync('option', this,
                _.extend(options, {
                    action: action
                }));
        },

        description: function() {
            return this.id;
        },

        select: function() {
            if (this.collection) {
                this.collection.selectModel(this);
            }
        },

        deselect: function() {
            if (this.collection) {
                this.collection.deselectModel(this);
            }
        },

        isSelected: function() {
            if (this.collection) {
                return _.contains(this.collection.getSelectedModels(),
                    this);
            } else {
                return false;
            }
        }

    });

    _.extend(Keel.Model.prototype, Events);
};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\collection.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./model":"keel\\model.js","./sync":"keel\\sync.js","./events":"keel\\events.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone,
        Model = require('./model'),
        sync = require('./sync'),
        Events = require('./events');

    module.exports = Keel.Collection = Backbone.Collection.extend({
        model: Model,

        sync: function() {
            return sync.apply(this, arguments);
        },

        option: function(action, options) {
            options = options || {};
            var suc = options.suc,
                err = options.error,
                collection = this;
            options.success = function(resp) {
                if (suc) {
                    suc(collection, resp, options);
                }
                collection.trigger('sync', collection, resp, options);
            };
            options.error = function(resp) {
                if (err) {
                    err(collection, resp, options);
                }
                collection.trigger('error', collection, resp, options);
            };
            return this.sync('option',
                this,
                _.extend(options, {
                    action: action
                }));
        },

        constructor: function(models, options) {
            options = options || {};
            this.singleSelect = !!options.singleSelect;
            this._selectedModels = this.singleSelect ? null : [];
            Backbone.Collection.prototype.constructor.apply(this,
                arguments);
            this.on('remove', this.deselectModel, this);
        },

        singleSelect: false,

        selectModel: function(model) {
            if (this.singleSelect) {
                if (this._selectedModels === model) {
                    return;
                }
                this.deselectModel();
                this._selectedModels = model;
                model.trigger('select', model, this, this._selectedModels);
            } else {
                if (this.indexOf(model) !== -1 &&
                    _.indexOf(this._selectedModels, model) === -1) {
                    this._selectedModels.push(model);
                    model.trigger('select', model, this, this._selectedModels);
                }
            }
        },

        deselectModel: function(model) {
            if (this.singleSelect) {
                if (this._selectedModels) {
                    model = this._selectedModels;
                    model.trigger('deselect',
                        model, this, this._selectedModels);
                    this._selectedModels = null;
                }
            } else {
                var index = _.indexOf(this._selectedModels, model);
                if (index !== -1) {
                    this._selectedModels.splice(index, 1);
                    model.trigger('deselect',
                        model, this, this._selectedModels);
                }
            }
        },

        setSelectModels: function(models) {
            if (this.singleSelect) {
                throw new Error(
                    'single select mode not support this method');
            } else {
                models = _.intersection(this.models, models);
                var deSelectModels = _.difference(this._selectedModels,
                    models);
                var newSelectModels = _.difference(models,
                    this._selectedModels);
                this._selectedModels = models;
                _.each(deSelectModels, function(model) {
                    model.trigger('deselect', model, this, models);
                }, this);
                _.each(newSelectModels, function(model) {
                    model.trigger('select', model, this, models);
                }, this);
            }
        },

        getSelectedModels: function() {
            if (this.singleSelect) {
                return this._selectedModels;
            }
            return _.clone(this._selectedModels);
        },

        _batchOperation: function(models, action) {
            var dfd = new Keel.$.Deferred(),
                len = models.length,
                errors = [],
                done = 0;

            function callback(resp, model) {
                done++;
                dfd.notify(resp, model);
                if (resp !== undefined) {
                    errors.push({
                        model: model,
                        response: resp
                    });
                }
                if (done === len) {
                    if (errors.length > 0) {
                        dfd.reject(errors);
                    } else {
                        dfd.resolve();
                    }
                }
            }

            _.each(models, function(model) {
                action.call(null, model)
                    .done(function() {
                        callback(void(0), model);
                    })
                    .fail(function(resp) {
                        callback(resp, model);
                    });
            });

            return dfd.promise();
        },

        updateModels: function(models, attrs, options) {
            options = options || {};
            _.defaults(options, {
                wait: true
            });
            return this._batchOperation(models, function(model) {
                return model.save(attrs, options);
            });
        },

        destroyModels: function(models, options) {
            options = options || {};
            _.defaults(options, {
                wait: true
            });
            return this._batchOperation(models, function(model) {
                return model.destroy(options);
            });
        }

    });

    _.extend(Keel.Collection.prototype, Events);
};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\view.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./template":"keel\\template.js","./events":"keel\\events.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var _ = require('underscore'),
        Backbone = require('backbone'),
        Keel = require('./core'),
        template = require('./template'),
        Events = require('./events');

    module.exports = Keel.View = Backbone.View.extend({
        constructor: function() {
            var $super = Backbone.View.prototype.constructor;
            var response = $super.apply(this, arguments);
            this.bindModelEvents();
            return response;
        },

        bindUIElements: function() {
            if (_.isEmpty(this.ui)) {
                return this;
            }

            // store the ui hash in _uiBindings so they can be reset later
            // and so re-rendering the view will be able to find the bindings
            if (!this._uiBindings) {
                this._uiBindings = this.ui;
            }

            // get the bindings result, as a function or otherwise
            var bindings = _.result(this, '_uiBindings');

            // empty the ui so we don't have anything to start with
            this.ui = {};

            // bind each of the selectors
            _.each(_.keys(bindings), function(key) {
                var selector = bindings[key];
                if (selector) {
                    this.ui[key] = this.$(selector);
                } else {
                    this.ui[key] = this.$el;
                }
            }, this);
            return this;
        },

        // This method unbinds the elements specified in the `ui` hash
        unbindUIElements: function() {
            if (!this.ui || !this._uiBindings) {
                return this;
            }

            // delete all of the existing ui bindings
            _.each(this.ui, function($el, name) {
                delete this.ui[name];
            }, this);

            // reset the ui element to the original bindings configuration
            this.ui = this._uiBindings;
            delete this._uiBindings;
            return this;
        },

        resetUI: function() {
            this.unbindUIElements();
            this.bindUIElements();
            return this;
        },

        modelEvents: {},

        collectionEvents: {},

        bindModelEvents: function() {
            if (this.model && !_.isEmpty(this.modelEvents)) {
                _.each(this.modelEvents, function(method, modelEvent) {
                    method = _.isString(method) ? this[method] :
                        method;
                    this.stopListening(this.model, modelEvent,
                        method);
                    this.listenTo(this.model, modelEvent, method);
                }, this);
            }
            if (this.collection && !_.isEmpty(this.collectionEvents)) {
                _.each(this.collectionEvents,
                    function(method, collectionEvent) {
                        method = _.isString(method) ? this[method] :
                            method;
                        this.stopListening(this.collection,
                            collectionEvent, method);
                        this.listenTo(this.collection, collectionEvent,
                            method);
                    }, this);
            }
            return this;
        },

        template: function(data) {
            var html = this.templateID ? Keel.$(this.templateID)
                .html() :
                '';
            return template(html, data);
        },

        serialize: function() {
            var data = {};
            if (this.model) {
                data = this.model.toJSON();
            }
            if (this.collection) {
                data = _.extend(data, {
                    collection: this.collection.toJSON
                });
            }
            return data;
        },

        render: function() {
            this.$el.html(this.template(this.serialize()));
            this.resetUI();
            return this;
        }

    });

    _.extend(Keel.View.prototype, Events);

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\layout.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./view":"keel\\view.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        View = require('./view');

    module.exports = Keel.Layout = View.extend({
        constructor: function(options) {
            this._isRender = false;
            this.cid = _.uniqueId('view');
            options = options || {};
            var viewOptions = [
                'model', 'collection', 'el',
                'id', 'attributes', 'className',
                'tagName', 'events'
            ];
            _.extend(this, _.pick(options, viewOptions));
            this._ensureElement();
            this.delegateEvents();
            this.__regions__ = {};
            this.initialize.apply(this, arguments);
        },

        _addViewToRegion: function(selector, view) {
            if (this.__regions__[selector] !== view) {
                this.removeView(selector);
            }
            this.__regions__[selector] = view;
            return this;
        },

        _insertToDom: function(selector, view, noRender) {
            var el = this.$(selector);
            if (el.length) {
                el.html(view.el);
                view.delegateEvents();
                if (!noRender) {
                    view.render();
                }
            } else {
                delete this.__regions__[selector];
                throw new Error(
                    'The selector did not match any element');
            }
        },

        getView: function(name) {
            return this.__regions__[name];
        },
        addView: function(selector, view, noRender) {
            this._addViewToRegion(selector, view);
            if (this._isRender) {
                this._insertToDom(selector, view, noRender);
            }
            return this;
        },

        removeView: function(selector) {
            var view = this.__regions__[selector];
            if (view) {
                delete this.__regions__[selector];
                view.remove();
            }
            return this;
        },

        eachView: function(callback, context) {
            context = context || this;
            _.each(this.__regions__, function(view, selector) {
                callback.call(context, view, selector, this);
            }, this);
            return this;
        },

        render: function() {
            Keel.View.prototype.render.apply(this, arguments);
            this._isRender = true;
            this.eachView(function(view, selector) {
                this._insertToDom(selector, view);
            });
            return this;
        },

        remove: function() {
            this._isRender = false;
            this.eachView(function(view) {
                view.remove();
            });
            this.stopListening();
            this.undelegateEvents();
        }
    });
};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\itemview.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./view":"keel\\view.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        View = require('./view');

    module.exports = Keel.ItemView = View.extend({
        constructor: function(options) {
            _.extend(this, _.pick(options || {}, ['serialize',
                'template'
            ]));
            return Keel.View.prototype.constructor.apply(this,
                arguments);
        },

        modelEvents: {
            'change': 'render'
        },

        getAttrs: function() {
            return {};
        },

        render: function() {
            var returnValue = Keel.View.prototype.render.apply(this,
                arguments);
            this.$el.attr(this.getAttrs());
            return returnValue;
        }

    });
};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\collectionview.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./itemview":"keel\\itemview.js","./view":"keel\\view.js","./helpers":"keel\\helpers.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        ItemView = require('./itemview'),
        View = require('./view'),
        throwError = require('./helpers')
        .throwError;

    module.exports = Keel.CollectionView = View.extend({
        itemView: ItemView,

        itemOptions: {},

        constructor: function(options) {
            _.extend(this, _.pick(options || {}, ['itemView',
                'itemOptions'
            ]));
            Keel.View.prototype.constructor.apply(this, arguments);
            this._initItems();
            this._initViewEvents();
        },

        viewEvents: {},

        collectionEvents: {
            'add': 'addItem',
            'remove': 'removeItem',
            'reset sort': 'render'
        },

        _initViewEvents: function() {
            _.each(this.viewEvents, function(cb, e) {
                if (_.isFunction(cb)) {
                    this.on(e, cb, this);
                } else if (cb in this) {
                    this.on(e, this[cb], this);
                }
            }, this);
        },

        // _itemViews = []
        _initItems: function() {
            if (this._itemViews) {
                this._clearItems();
            } else {
                this._itemViews = [];
            }
        },

        // remove all item views
        _clearItems: function() {
            _.each(this._itemViews, function(itemView) {
                this._removeItem(itemView);
            }, this);
            this._itemViews = [];
            this.$el.empty();
        },

        // find itemView in list by model
        _findByModel: function(model) {
            return _.find(this._itemViews, function(itemView) {
                return model === itemView.model;
            });
        },

        itemViewEventsPrefix: 'item',

        _getItemView: function() {
            var itemView = this.itemView;

            if (!itemView) {
                throwError('An `itemView` must be specified',
                    'NoItemViewError');
            }

            return itemView;
        },

        _prepareItem: function(item) {
            item.collectionView = this;
            var prefix = this.itemViewEventsPrefix;
            this.listenTo(item, 'all', function() {
                var args = [].slice.call(arguments);
                args[0] = prefix + ':' + args[0];
                args.splice(1, 0, item);
                this.trigger.apply(this, args);
            });
        },

        // create Item View
        _createItem: function(model) {
            var ItemView = this._getItemView();
            var options = _.extend({
                model: model
            }, this.itemOptions);
            var itemView = new ItemView(options);
            this._prepareItem(itemView);
            itemView.render();
            return itemView;
        },

        // remove target Item View
        _removeItem: function(itemView) {
            var index = _.indexOf(this._itemViews, itemView);
            if (index !== -1) {
                this.stopListening(itemView);
                this._itemViews.splice(index, 1);
                itemView.remove();
                itemView.trigger('removed', itemView);
                itemView = null;
            }
        },

        _appendItem: function(itemView, index) {
            var nextElement = this.$el.children()
                .eq(index);
            if (nextElement.length) {
                nextElement.before(itemView.el);
            } else {
                this.$el.append(itemView.el);
            }
            return itemView.render();
        },

        // get models on view; It's useful if has pagination
        getDisplayModels: function() {
            return this.collection.models;
        },

        // addItem
        addItem: function(model, collection, options, models) {
            var itemView = this._createItem(model);
            models = models || this.getDisplayModels();
            var index = _.indexOf(models, model);
            if (index === -1) {
                return false;
            }
            this._appendItem(itemView, index);
            this._itemViews.splice(index, 0, itemView);
            this.trigger('addItemView', this, itemView);
            return itemView;
        },

        // create list
        addItems: function(models) {
            _.each(models, function(model) {
                this.addItem(model, this.collection, {}, models);
            }, this);
            return this;
        },

        // remove item by model
        removeItem: function(model) {
            var itemView = this._findByModel(model);
            if (itemView) {
                this._removeItem(itemView);
            }
        },

        // render
        render: function() {
            this._clearItems();
            var models = this.getDisplayModels();
            this.addItems(models);
            return this;
        },

        // remove
        remove: function() {
            this._clearItems();
            Keel.View.prototype.remove.apply(this, arguments);
            return this;
        }

    });

    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter',
        'select',
        'reject', 'every', 'all', 'some', 'any', 'include', 'contains',
        'invoke',
        'max', 'min', 'toArray', 'size', 'first', 'head', 'take',
        'initial',
        'rest', 'tail', 'drop', 'last', 'without', 'difference',
        'indexOf',
        'shuffle', 'lastIndexOf', 'isEmpty', 'chain'
    ];

    _.each(methods, function(name) {
        Keel.CollectionView.prototype[name] = function() {
            var args = [].slice.call(arguments);
            args.unshift(this._itemViews);
            return _[name].apply(_, args);
        };
    });

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\compositeview.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./collectionview":"keel\\collectionview.js","./helpers":"keel\\helpers.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        CollectionView = require('./collectionview'),
        throwError = require('./helpers')
        .throwError;

    module.exports = Keel.CompositeView = CollectionView.extend({
        itemView: null,

        _getItemView: function() {
            var itemView = this.itemView || this.constructor;

            if (!itemView) {
                throwError('An `itemView` must be specified',
                    'NoItemViewError');
            }

            return itemView;
        },

        _appendItem: function(itemView, index) {
            var $container = this._getItemViewContainer();
            var nextElement = $container.children()
                .eq(index);
            if (nextElement.length) {
                nextElement.before(itemView.el);
            } else {
                $container.append(itemView.el);
            }
        },

        render: function() {
            this._clearItems();
            this._resetItemViewContainer();
            this.renderModel();
            if (this.collection) {
                this.addItems(this.getDisplayModels());
            }
            return this;
        },

        renderModel: function() {
            return this.$el.html(this.template(this.serialize()));
        },

        _getItemViewContainer: function() {
            if ('$itemViewContainer' in this) {
                return this.$itemViewContainer;
            }

            var container;
            if (this.itemViewContainer) {
                container = this.$(this.itemViewContainer);
                if (container.length <= 0) {
                    throwError('The specified `itemViewContainer`' +
                        'was not found: ' +
                        this.itemViewContainer,
                        'ItemViewContainerMissingError');
                }
            } else {
                container = this.$el;
            }

            this.$itemViewContainer = container;
            return container;
        },

        _resetItemViewContainer: function() {
            if (this.$itemViewContainer) {
                delete this.$itemViewContainer;
            }
        }

    });
};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\tree.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js","./model":"keel\\model.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Model = require('./model');

    module.exports = Keel.TreeModel = Model.extend({
        parse: function(data) {
            if (data.children) {
                _.each(data.children, _.bind(this.addChild, this));
                delete data.children;
            }
            return data;
        },

        isLeaf: function() {
            return _.isUndefined(this.children);
        },

        isRoot: function() {
            return _.isUndefined(this.parent);
        },

        addChild: function(attributes) {
            if (this.isLeaf()) {
                this.children = [];
            }
            this.children.push(this._createChild(attributes));
        },

        eachChild: function(iterator, context) {
            if (this.isLeaf()) {
                return;
            }
            _.each(this.children, function(child) {
                child.eachChild(iterator, context);
                iterator.call(context, child);
            });
        },

        eachParent: function(iterator, context) {
            if (this.isRoot()) {
                return;
            }
            this.parent.eachParent(iterator, context);
            iterator.call(context, this.parent);
        },

        getRoot: function() {
            if (this.isRoot()) {
                return this;
            }
            return this.parent.getRoot();
        },

        getLevel: function() {
            if (this.isRoot()) {
                return 0;
            }
            return this.parent.getLevel() + 1;
        },

        getFirstLeaf: function() {
            if (this.isLeaf()) {
                return this;
            }
            return _.first(this.children)
                .getFirstLeaf();
        },

        getLeafById: function(id) {
            if (this.isLeaf()) {
                if (this.id === id) {
                    return this;
                } else {
                    return void(0);
                }
            } else {
                var ret, leaf;
                _.find(this.children, function(child) {
                    return (leaf = child.getLeafById(id)) && (ret =
                        leaf);
                });
                return ret;
            }
        },

        _createChild: function(attributes) {
            var child = new this.constructor(attributes, {
                parse: true
            });
            child.parent = this;

            // proxy event
            var that = this;
            child.on('all', function() {
                that.trigger.apply(that, arguments);
            });
            return child;
        }
    });
};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\i18n.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._;

    module.exports = Keel.i18n = {};

    /**
     * I18n store
     */
    var i18nStore = {};
    var setI18nStore = function(data) {
        if (_.isObject(data)) {
            i18nStore = _.clone(data);
        }
    };

    /**
     * Load i18n message
     */
    var defaultOptions = {
        url: '#',
        async: false,
        dataType: 'json'
    };
    var loadI18nStore = function(options) {
        return Keel.ajax(_.extend({}, defaultOptions, options, {
            success: function(data) {
                setI18nStore(data);
            }
        }));
    };

    /**
     * Lookup i18n message
     */
    var keySplitter = /\./;
    var lookup = function(key) {
        return i18nStore[key] ||
            recursiveLookup(i18nStore, key.split(keySplitter));
    };

    var recursiveLookup = function(configs, keys) {
        if (_.isUndefined(configs)) {
            return void(0);
        }
        var childConfigs = configs[keys.shift()];
        if (keys.length === 0) {
            return childConfigs;
        } else {
            return recursiveLookup(childConfigs, keys);
        }
    };

    /**
     * interpolate i18n message
     * matches placeholders like "%{foo}"
     */
    var interpolatePattern = /%\{(\w+)\}/g;
    var interpolate = function(message, values) {
        if (_.isUndefined(values)) {
            return message;
        }

        var match;
        while (match = interpolatePattern.exec(message)) {
            message = message.replace(match.shift(), values[match.shift()]);
        }
        return message;
    };

    /**
     * init i18n
     */
    Keel.i18n.init = function(options) {
        options = options || {};
        if (options.i18nStore) {
            return setI18nStore(options.i18nStore);
        } else {
            return loadI18nStore(_.pick(options, ['url', 'async']));
        }
    };

    /**
     *  get i18n message by key
     */
    Keel.i18n.t = function(key, options) {
        options = options || {};
        var message = lookup(key);
        if (_.isUndefined(message)) {
            return key;
        }
        if (_.isObject(message)) {
            return _.clone(message);
        }
        return interpolate(message, options.values);
    };

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\validate.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._;

    module.exports = Keel.Validate = {};

    //init validate for element
    //errorClass String 默认:"error",指定错误提示的css类名,可以自定义错误提示的样式
    //validClass String 默认:"valid",指定验证通过的css类名,可以自定义提示的样式
    //errorElement String 默认:"label"，使用什么标签标记错误
    //ignore:对某些元素不进行验证
    //submitHandler:通过验证后运行的函数,里面要加上表单提交的函数,否则表单不会提交
    //Onubmit Boolean 默认:true，是否提交时验证
    //rules:验证规则
    //showErrors:显示错误信息的回调函数

    Keel.Validate.init = function(selector, options) {
        options = _.pick(options || {}, [
            'errorClass', 'validClass', 'errorElement',
            'ignore', 'onsubmit', 'submitHandler',
            'rules', 'showErrors'
        ]);
        Keel.$(selector)
            .validate(options);
    };

    //return the result of validate
    Keel.Validate.valid = function(selector) {
        return Keel.$(selector)
            .valid();
    };

    //add validate message
    Keel.Validate.addMessages = function(setiing) {
        Keel.$.extend(Keel.$.validator.messages, setiing);
    };

    //add validate method
    Keel.Validate.addMethod = function(name, method, message) {
        Keel.$.validator.addMethod(name, method, message);
    };

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

  __modules__['keel\\application.js'] = (function(){
  var module = function(){
  var e = {};
  var m = {};
  m.exports = e;
  var loader = function (name) {
  var maps = {"./core":"keel\\core.js"};
  var moduleName = maps[name];
  if (moduleName) {
  return __modules__[moduleName]();
  } else {
  return require(name);
  }
  };
  var func = function (require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone,
        Application;

    Application = function Application(options) {
        'use strict';
        this.layout = options.layout;
        this.routers = options.routers || [];
        this.metadata = options.metadata || {};

        this._defers = [];

        this.initRoutes();
        this.initialize.apply(this, arguments);

        this._ready();
    };

    Application.extend = Keel.extend;

    _.extend(Application.prototype, Keel.Events, {
        constructor: Application,

        initialize: function() {},

        defer: function() {
            var def = new Keel.$.Deferred(),
                that = this;
            this._defers.push(def);
            return function() {
                def.resolveWith(that);
            };
        },

        _ready: function() {
            this.deferred = Keel.$.when.apply(Keel.$, this._defers);
        },

        ready: function(callback) {
            this.deferred.done(callback);
        },
        fail: function(callback) {
            this.deferred.fail(callback);
        },

        run: function(options) {
            this.layout.render();
            Backbone.history.start(options);
        },

        stop: function() {
            Backbone.history.stop();
        },

        reload: function() {
            Backbone.history.loadUrl();
        },

        navigate: function(uri, options) {
            Backbone.history.navigate(uri, options);
        },

        getFragment: function() {
            return Backbone.history.getFragment();
        },

        getMetadata: function(id) {
            return this.metadata[id];
        },

        addRouter: function(Router) {
            var router = new Router({
                app: this,
                layout: this.layout
            });
            this._routers.push(router);
        },

        initRoutes: function() {
            this._routers = [];
            _.each(this.routers, function(Router) {
                this.addRouter(Router);
            }, this);
        }
    });

    module.exports = Keel.Application = Application;

};
  var out = func.call(null, loader, e, m);
  return out ? out : m.exports;
  }
  var module_obj = null;
  return function(){
  if (module_obj===null) {
  module_obj = module();
  }
  return module_obj;
  }
  }())

return __modules__['keel.js']();
}(require));
});
