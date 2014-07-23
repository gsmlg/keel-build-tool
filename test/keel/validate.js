define(function(require, exports, module) {
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

});