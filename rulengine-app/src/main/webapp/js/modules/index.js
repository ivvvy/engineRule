define(['vue', 'Utils'], function (Vue, Utils) {

    var module = new Vue({
        el: "#body",
        data: {
            line: {},
            right: {},
            constraint: []
        },
        methods: {
            openModal: function () {
                Utils.openModal({body: "<h2>首页</h2>"});
            },
            openTip: function () {
                Utils.showTip("导入成功", "success");
            },
            getRightPart: function () {
                Utils.openModal({body: JSON.stringify(this.right)});
            },
            getLinePart: function () {
                Utils.openModal({body: JSON.stringify(this.line)});
            },
            getConstraintPart: function () {
                Utils.openModal({body: JSON.stringify(this.constraint)});
            }
        }
    });

});