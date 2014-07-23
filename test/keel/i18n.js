define(function(require, exports, module) {
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

});