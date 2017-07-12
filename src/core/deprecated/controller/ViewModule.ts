/**
 * @module ViewModule
 * @description 页面模块
 */
export module ViewModule{
    /**
     * @class Input
     * @description 控制输入框
     */
    export class Input{
        /**
         * @method clear
         * @description 清空输入框
         * @param inputId
         * @static
         */
        static clear(inputId:string){
            let input = <HTMLInputElement>document.getElementById(inputId);
            input.value = '';
        }
    }
}
