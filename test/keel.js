define('keel', function(require, exports, module) {
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

});