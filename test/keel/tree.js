define(function(require, exports, module) {
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
});