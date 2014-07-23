define(function(require, exports, module) {
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

});