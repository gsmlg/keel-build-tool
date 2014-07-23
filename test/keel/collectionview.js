define(function(require, exports, module) {
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

});