import copy from "./modules/copy";

const directivesList = {
    copy
}

const directives = {
    install: function (app) {
        Object.keys(directivesList).forEach(key => {
            // 注册所有自定义指令
            app.directive(key, directivesList[key]);
        });
    }
};

export default directives;