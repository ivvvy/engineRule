/**
 * Created by xinyu.cai on 2017/8/31.
 */
define(['jquery', 'vue', 'Utils'], function ($, Vue, Utils) {
    new Vue({
        el: "#body",
        data: {
            line:{},
            right:{},
            operates:Utils.Const.ResultOperators,
            show:false,
            condition:{},
            col:{},
            rows:[['请选择变量','请选择变量'],['请输入条件','请输入结果']]


        },
        mounted: function () {
            this.showTable();
        },
        methods: {
            showTable:function(){


            },
            openVarList: function () {
                var _self = this;
                //if(_self.col=="请选择变量"){
                    Utils.openModal({
                        title: "选择变量",
                        width: 600,
                        currentView: "variateSearch",
                        componentParam: {},
                        action: {
                            ok: function (item) {
                                item = item || {temp: {}};
                                Vue.set(_self.col, 'name', item.temp.variate.name);
                                Vue.set(_self.col, 'paramType', item.temp.variate.paramType);
                                delete item.temp;
                            },
                            cancel: function (item) {
                                item = item || {temp: {}};
                                delete item.temp;
                            }
                        }
                    });
                //}

            },
            changeOperator: function () {
                if (this.line.operator.indexOf("null") >= 0) Vue.set(this.line, "right", {});
                else Vue.set(this.line, "right", {type: "const"});

            },
            getRightPart: function () {
                Utils.openModal({body: JSON.stringify(this.right)});
            },
        }
    })
});