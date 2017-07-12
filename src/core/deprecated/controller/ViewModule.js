/**
 * @module ViewModule
 * @description 页面模块
 */
/**
 * @module ViewModule
 * @description 页面模块
 */ export var ViewModule;
(function (ViewModule) {
    /**
     * @class Input
     * @description 控制输入框
     */
    class Input {
        /**
         * @method clear
         * @description 清空输入框
         * @param inputId
         * @static
         */
        static clear(inputId) {
            let input = document.getElementById(inputId);
            input.value = '';
        }
    }
    ViewModule.Input = Input;
})(ViewModule || (ViewModule = {}));
//# sourceMappingURL=ViewModule.js.map