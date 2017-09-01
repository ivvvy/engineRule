/**
 * Created by xinyu.cai on 2017/8/28.
 */
define(['jquery', 'vue', 'Utils'], function ($, Vue, Utils) {
    new Vue({
        el: "#body",
        data: {
            right: {},
            rows: {},
            cols: {},
            results:{},
            variate: {},
            tableData: {},
        },
        mounted: function () {

        },
        methods: {
            openRowVarList: function (event) {
                var _self = this;
                var el=event.target;
                Utils.openModal({
                    title: "选择变量",
                    width: 600,
                    currentView: "variateSearch",
                    componentParam: this.rows,
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.rows, 'name', item.temp.variate.name);
                            console.log("rows:"+JSON.stringify(_self.rows));
                            Vue.set(_self.rows, 'paramType', item.temp.variate.paramType);
                            if(_self.rows!==""){
                                $(el).siblings(".rowModal").show();
                            }
                            delete item.temp;


                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            openColVarList: function (event) {
                var _self = this;
                var el=event.target;
                Utils.openModal({
                    title: "选择变量",
                    width: 600,
                    currentView: "variateSearch",
                    componentParam: this.cols,
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.cols, 'name', item.temp.variate.name);
                            Vue.set(_self.cols, 'paramType', item.temp.variate.paramType);
                            if(_self.cols!==""){
                                $(el).siblings(".colModal").show();
                            }
                            delete item.temp;


                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            openResVarList: function () {
                var _self = this;
                Utils.openModal({
                    title: "选择变量",
                    width: 600,
                    currentView: "variateSearch",
                    componentParam: this.results,
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.results, 'name', item.temp.variate.name);
                            Vue.set(_self.results, 'paramType', item.temp.variate.paramType);
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            //切分变量
            syncopateVar: function () {
                var _self = this;
                Utils.openModal({
                    title: "切分行变量",
                    width: 600,
                    currentView: "addSegmentation",
                    componentParam: this.variate.scores,
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.variate, "scores", item.temp.scores);
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            showTable: function () {

            }

        }

    });
});