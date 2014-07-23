define(function(require, exports, module) {
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

});