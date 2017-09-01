define(['vue', 'Utils'], function (Vue, Utils) {

    new Vue({
        el: "#body",
        data: {},
        mounted: function () {
            var _self = this;
            _self.initPage();
        },
        methods: {
            initPage: function () {
                var jsPlumbToolInstance = new jsPlumbTool();
                //jsPlumbToolInstance.renderGraphTool('container','flowChart');
                jsPlumbToolInstance.renderGraphTool('container', 'tree');
                jsPlumbToolInstance.editNodeAction(function () {
                    $("body").css('background', 'skyblue');
                    return '{"type":"var","name":"STAN_PRODUCT_NUM","paramType":"INPUT"}';
                });
                jsPlumbToolInstance.editLineAction(function () {
                    $("body").css('background', '#8BC34A');
                    return '{"operator":">=","left":{"name":"STAN_LOAN_TYPE","paramType":"INPUT"},"right":{"type":"const","value":"3"}}';
                });
            },
        }
    })
});


