define(function(require, exports, module) {
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
});