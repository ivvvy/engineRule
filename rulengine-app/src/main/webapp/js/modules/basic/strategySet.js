/**
 * Created by ZhaiFenfang on 2017/8/31.
 */
define(['vue', 'Utils', 'ELEMENT'], function (Vue, Utils, ELEMENT) {
    Vue.use(ELEMENT);
    new Vue({
        el: "#body",
        data: {
            formData: {
                strategyList: [
                    {
                        "controlNo": "RULE201708290004",
                        "versions": "V1.0.0",
                        "orgId": "1008610086",
                        "sort": "反欺诈",
                        "description": "规则2",
                        "creater": "8008208820",
                        "updater": "8008208820",
                        "status": null,
                        "isLock": null,
                        "userId": null,
                        "strategyType": "RULE",
                        "strategyName": "RULE_TEST_2",
                        "strategyBody": "rule \"RULE_TEST_2\"\n\tdialect \"mvel\"\nwhen\n\tapp : HashMap()\nthen\n\tHashMap input = app.INPUT;\n\tHashMap output = app.OUTPUT;\n\tHashMap temp = app.TEMP;\n\n\tif( (input.STAN_PRODUCT_NUM == \"现金贷\")){\n\t\toutput.STAN_LOAN_TYPE = \"拒绝\";\n\t}\nend\n",
                        "strategyJson": "{\"ruleName\":\"RULE_TEST_2\",\"then\":[{\"type\":\"if\",\"constraint\":[{\"left\":{\"name\":\"STAN_PRODUCT_NUM\",\"paramType\":\"INPUT\"},\"right\":{\"type\":\"const\",\"value\":\"\\\"现金贷\\\"\"},\"operator\":\"==\"}],\"result\":[{\"operator\":\"=\",\"left\":{\"name\":\"STAN_LOAN_TYPE\",\"paramType\":\"OUTPUT\"},\"right\":{\"type\":\"const\",\"value\":\"\\\"拒绝\\\"\"}}]}]}",
                        "show": null,
                        "rowVar": null,
                        "lineVar": null,
                        "resultVar": null,
                        "compilingStatus": 2
                    }
                ]
            }
        },
        methods: {
            //策略类型
            strategyTypeFormatter: function (row, column, cellValue) {
                var strategyType = _.find(Utils.Const.StrategyTypeList, function (item) {
                    return item.value.toLowerCase() == cellValue.toLowerCase()
                });
                if (!!strategyType) return strategyType.name;
                return cellValue;
            },
            handleMouseEnter: function (row, column, cell) {
                Vue.set(row, "showOperate", true);
            },
            handleMouseOut: function (row, column, cell) {
                Vue.delete(row, "showOperate");
            },
            //选择策略
            selectStrategy: function () {
                var _self = this;
                Utils.openModal({
                    title: "选择策略",
                    currentView: "select-strategy",
                    width: 800,
                    componentParam: {
                        selected: this.formData.strategyList || []
                    },
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            _self.formData.strategyList = item.temp.selectedList || [];
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            //查看策略详情
            showDetail: function (row) {
                var strategyType = _.find(Utils.Const.StrategyTypeList, function (item) {
                    return item.value.toLowerCase() == row.strategyType.toLowerCase()
                });
                if (!!strategyType) {
                    window.open(strategyType.detailUrl + "?controlNo=" + row.controlNo, "_blank");
                }
            },
            //已处理策略
            removeStrategy: function (row) {
                var index = _.findIndex(this.formData.strategyList, function (item) {
                    return item.controlNo == row.controlNo;
                });
                if (index >= 0) {
                    Vue.delete(this.formData.strategyList, index);
                }
            },
            //取消
            cancelEdit: function () {
                window.close();
            }
        }
    })
});