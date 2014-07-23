define(function(require, exports, module) {
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

});