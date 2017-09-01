/**
 * Created by ZhaiFenfang on 2017/8/23.
 */
define(['vue', 'Engine', 'underscore', 'Utils'], function (Vue, Engine, _, Utils) {
    new Vue({
        el: "#body",
        data: {
            openSource: false,

            formData: {
                strategyName: "",   //名称
                description: "",    //描述
                sort: "",           //分类
                strategyJson: "",   //策略json定义
                strategyType: "RULE",
                strategyBody: "",       //策略drl内容
                compilingStatus: "2",        //编译状态{"编译失败":"0","编译成功":"1", "编写中":"2"}
            },
            //formData: {
            //    "strategyName": "RULE_OVERDATE",
            //    "description": "逾期规则",
            //    "sort": "反欺诈",
            //    "strategyJson": "{\"ruleName\":\"RULE_OVERDATE\",\"then\":[{\"type\":\"if\",\"constraint\":[{\"left\":{\"name\":\"STAN_PRODUCT_NUM\",\"paramType\":\"INPUT\"},\"right\":{\"type\":\"const\",\"value\":\"\\\"反欺诈\\\"\"},\"operator\":\"==\"},{\"type\":\"&&\",\"left\":{\"name\":\"STAN_LOAN_WAY\",\"paramType\":\"INPUT\"},\"right\":{\"type\":\"const\",\"value\":\"\\\"线下贷\\\"\"},\"operator\":\"==\"}],\"result\":[{\"operator\":\"=\",\"left\":{\"name\":\"STAN_LOAN_TYPE\",\"paramType\":\"OUTPUT\"},\"right\":{\"type\":\"const\",\"value\":\"\\\"逾期\\\"\"}}]}]}",
            //    "strategyType": "RULE",
            //    "strategyBody": "rule \"RULE_OVERDATE\"\n\tdialect \"mvel\"\nwhen\n\tapp : HashMap()\nthen\n\tHashMap input = app.INPUT;\n\tHashMap output = app.OUTPUT;\n\tHashMap temp = app.TEMP;\n\n\tif( (input.STAN_PRODUCT_NUM == \"反欺诈\") && (input.STAN_LOAN_WAY == \"线下贷\")){\n\t\toutput.STAN_LOAN_TYPE = \"逾期\";\n\t}\nend\n"
            //},

            referData: [],

            ifPart: {type: "if", constraint: [], result: [{}]},
            elsePart: {type: "else", result: [{}]},

            controlNo: Utils.getParameterByNameFromUrl("controlNo"),
            hasServerData: false
        },
        created: function () {
            if (!!this.controlNo) {
                var _self = this;
                $.postJSON("/platform/strategy/detail", {controlNo: this.controlNo}, function (res) {
                    if (!!res && res.retCode == "00") {
                        _self.formData = res.data || {};
                        _self.convertFormData();
                    }
                    _self.hasServerData = !!res && res.retCode == "00" && res.data.strategyType.toUpperCase() == "RULE";
                });

            } else this.convertFormData();
        },
        updated: function () {
            $('.constraintOuter.disabled select').prop("disabled", true);
            $('.constraintOuter.disabled input').prop("disabled", true);
            $('.constraintOuter.disabled .constraintOperate').remove();
            $('.constraintOuter.disabled .thenOperate').remove();
        },
        methods: {
            //转换strategyJson成ifPart和elsePart
            convertFormData: function () {
                try {
                    var json = !!this.formData.strategyJson && JSON.parse(this.formData.strategyJson);
                    if (!!json.ruleName && !this.formData.strategyName) this.formData.strategyName = json.ruleName;
                    if (!!json && !!json.then && json.then.length) {
                        var part = _.find(json.then, function (item) {
                            return item.type == "if" || !item.type;
                        });
                        if (!!part) this.ifPart = part;

                        part = _.find(json.then, function (item) {
                            return item.type == "else";
                        });
                        if (!!part) this.elsePart = part;
                    }
                } catch (e) {
                }
            },
            //是否有编辑按钮
            withEdit: function () {
                var currentUser = Utils.getCurrentUser().userId;
                var row = this.formData;
                return (row.isLock == 1 && currentUser == row.userId) || row.isLock != 1;
            },
            getRuleJson: function () {
                var ruleJSON = {
                    ruleName: "",
                    then: []
                };
                ruleJSON.ruleName = this.formData.strategyName;
                var hasIfConstraint = this.ifPart.constraint.length > 0 && !!this.ifPart.constraint[0].operator;
                if (hasIfConstraint) ruleJSON.then.push(this.ifPart);

                var hasElseThen = this.elsePart.result.length > 0 && !!this.elsePart.result[0].operator;
                if (hasElseThen) ruleJSON.then.push(this.elsePart);

                var onlyHasThen = !hasIfConstraint && this.ifPart.result.length > 0 && !!this.ifPart.result[0].operator;
                if (onlyHasThen) ruleJSON.then = this.ifPart.result;

                return ruleJSON;
            },
            //查看源代码
            readSourceCode: function () {
                this.openSource = !this.openSource;
                if (this.openSource) {
                    this.$nextTick(function () {
                        this.formData.strategyBody = new Engine.Rule("ace-area").translate(this.getRuleJson());
                    });
                }
            },
            //保存|更新
            saveRule: function () {
                var ruleData = this.getRuleJson();
                this.formData.strategyJson = JSON.stringify(ruleData);
                var engine = new Engine.Rule("ace-area");
                this.formData.strategyBody = engine.translate(ruleData);
                this.referData = _.uniq(engine.getReferVarList(), function (item) {
                    return item.controlNo + item.elementName;
                });

                _.map(this.referData, function (item) {
                    item.refTypeName = "RULE";
                    item.refvarName = ruleData.ruleName;
                    return item;
                });

                var url = "/platform/strategy/add";
                var data = {
                    saveData: this.formData,
                    refInfo: this.referData
                };
                if (this.hasServerData) {
                    url = "/platform/strategy/update";
                    data = {
                        updateData: this.formData,
                        refInfo: this.referData
                    }
                }

                //1：调用编译接口

                //2：编译失败，提示保存

                //3：编译成功，直接保存，关闭页面

                $.postJSON(url, data, function (res) {
                    if (!!res && res.retCode == "00") {
                        Utils.showTip("保存成功");
                        window.setTimeout(function () {
                            //if (!!window.opener) window.opener.location.reload();
                            window.close();
                        }, 2000);
                    } else Utils.showTip(res.retMsg || "保存失败", "fail");
                }, function () {
                    Utils.showTip("保存失败", "fail");
                });
            },
            //编辑
            editRule: function () {
                var row = this.formData;
                $.postJSON("/platform/reference/query", {refvarNum: row.controlNo}, function (res) {
                    if (!!res && res.retCode == "00") {
                        var beRefList = (res.data || {}).beRefInfo;
                        if (!!beRefList && !!beRefList.length) {
                            Utils.openModal({
                                title: "编辑提示",
                                body: '<div style="font-size:14px;margin-bottom: 20px;">' + row.strategyName + '正被下表所示内容引用，若要编辑，请先解除下述引用！' + '</div>',
                                okText: "知道了",
                                cancelText: "",
                                currentView: 'be-reference-list',
                                componentParam: {beRefInfo: beRefList}
                            });
                        } else {
                            //2：编辑
                            var strategyType = _.find(Utils.Const.StrategyTypeList, function (item) {
                                return item.value.toLowerCase() == row.strategyType.toLowerCase()
                            });
                            if (!!strategyType) {
                                window.open(strategyType.createUrl + "?controlNo=" + row.controlNo, "_self");
                            }
                        }
                    }
                });
            },
            //取消|返回
            cancelEdit: function () {
                window.close();
            }
        }
    });
});