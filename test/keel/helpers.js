define(function(require, exports, module) {
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

});