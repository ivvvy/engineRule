/**
 * Created by xinyu.cai on 2017/8/28.
 */
define(['jquery', 'vue', 'Utils', 'Engine'], function ($, Vue, Utils, Engine) {
    new Vue({
        el: "#body",
        data: {
            openSource: false,
            formData: {
                strategyName: "",   //名称
                description: "",    //描述
                sort: "",           //分类
                strategyJson: "",   //策略json定义
                strategyType: "MATRIX",
                strategyBody: "",       //策略drl内容
                compilingStatus: "1",        //编译状态{"编译失败":"0","编译成功":"1", "编写中":"2"}
            },
            right: {},
            setIndex: -1,
            rows: {},
            cols: {},
            results: {},
            variate: {},
            tableData: {},
        },
        filters: {
            leftComparatorReverse: function (comparator) {
                return {
                        ">=": "=<",
                        ">": "<",
                        "<=": "=>",
                        "<": ">"
                    }[comparator] || comparator;
            }
        },
        created: function () {
            if (!this.results.outcomes) Vue.set(this.results, "outcomes", []);
        },
        mounted: function () {

        },
        methods: {
            //行变量
            openRowVarList: function (event) {
                var _self = this;
                Utils.openModal({
                    title: "选择变量",
                    width: 600,
                    currentView: "variateSearch",
                    componentParam: this.rows,
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.rows, 'name', item.temp.variate.name);
                            Vue.set(_self.rows, 'paramType', item.temp.variate.paramType);
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            //列变量
            openColVarList: function (event) {
                var _self = this;
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
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            //结果变量
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
            syncopateVar: function (type, conditions) {
                var _self = this;
                Utils.openModal({
                    title: "切分" + (type || "") + "变量",
                    width: 600,
                    currentView: "syncopateVar",
                    componentParam: (conditions || []).slice(0),
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            if (type == "行") Vue.set(_self.rows, "conditions", item.temp.scores);
                            if (type == "列") Vue.set(_self.cols, "conditions", item.temp.scores);
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            //编辑结果
            editResultOutcome: function (outcome, index) {
                this.setIndex = index;
                if (!!outcome) this.right = $.extend({}, outcome);
                else this.right = {type: "const"};
            },
            //设置结果
            resetOutcome: function () {
                if (!this.results.outcomes) Vue.set(this.results, "outcomes", []);
                Vue.set(this.results.outcomes, this.setIndex, $.extend({operator: "="}, this.right));
            },
            //获取矩阵json数据
            getMatrixJSON: function () {
                var matrixData = {
                    tableName: this.formData.strategyName || "",
                    cols: [this.cols],
                    rows: [this.rows],
                    results: [this.results]
                };

                return matrixData;
            },
            //查看源代码
            readSourceCode: function () {
                this.openSource = !this.openSource;
                if (this.openSource) {
                    this.$nextTick(function () {
                        this.formData.strategyBody = new Engine.Table("ace-area").translateMatrix(this.getMatrixJSON());
                    });
                }
            }

        }

    });
});