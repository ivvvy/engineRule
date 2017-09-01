/**
 * Created by ZhaiFenfang on 2017/8/28.
 */
define(['vue', 'Utils', 'jquery', 'Engine'], function (Vue, Utils, $, Engine) {
    new Vue({
        el: "#body",
        data: {
            openSource: false,
            formData: {
                strategyName: "",   //名称
                description: "",    //描述
                sort: "",           //分类
                strategyJson: "",   //策略json定义
                strategyType: "CARD",
                strategyBody: "",       //策略drl内容
                compilingStatus: "1",        //编译状态{"编译失败":"0","编译成功":"1", "编写中":"2"}
            },
            //formData: {
            //    "strategyName": "CARD_TEST",
            //    "description": "欺诈分数评分卡",
            //    "sort": "反欺诈",
            //    "strategyJson": "{\"cardName\":\"CARD_TEST\",\"initValue\":\"12\",\"output\":{\"name\":\"STAN_PRODUCT_NUM\",\"paramType\":\"INPUT\"},\"vars\":[{\"name\":\"APP_COUNT_3M\",\"paramType\":\"INPUT\",\"scores\":[{\"leftLine\":{},\"rightLine\":{\"comparator\":\"<\",\"right\":{\"type\":\"const\",\"value\":\"10\"}},\"result\":{\"operator\":\"+=\",\"type\":\"const\",\"value\":\"20\"}},{\"leftLine\":{\"comparator\":\">=\",\"right\":{\"type\":\"const\",\"value\":\"10\"}},\"rightLine\":{\"comparator\":\"<\",\"right\":{\"type\":\"const\",\"value\":\"20\"}},\"result\":{\"operator\":\"+=\",\"type\":\"const\",\"value\":\"40\"}},{\"leftLine\":{\"comparator\":\">=\",\"right\":{\"type\":\"const\",\"value\":\"20\"}},\"rightLine\":{\"comparator\":\"<\",\"right\":{\"type\":\"const\",\"value\":\"30\"}},\"result\":{\"operator\":\"+=\",\"type\":\"const\",\"value\":\"60\"}},{\"type\":\"else\",\"result\":{\"operator\":\"=\",\"type\":\"const\",\"value\":\"100\"}}]}]}",
            //    "strategyType": "CARD",
            //    "strategyBody": "rule \"CARD_TEST\"\n\tdialect \"mvel\"\nwhen\n\tapp : HashMap()\nthen\n\tHashMap input = app.INPUT;\n\tHashMap output = app.OUTPUT;\n\tHashMap temp = app.TEMP;\n\n\tinput.STAN_PRODUCT_NUM = 12;\n\n\tif( (input.APP_COUNT_3M < 10) ){\n\t\tinput.STAN_PRODUCT_NUM = input.STAN_PRODUCT_NUM + 20;\n\t} else if( (input.APP_COUNT_3M >= 10) && (input.APP_COUNT_3M < 20) ){\n\t\tinput.STAN_PRODUCT_NUM = input.STAN_PRODUCT_NUM + 40;\n\t} else if( (input.APP_COUNT_3M >= 20) && (input.APP_COUNT_3M < 30) ){\n\t\tinput.STAN_PRODUCT_NUM = input.STAN_PRODUCT_NUM + 60;\n\t} else {\n\t\tinput.STAN_PRODUCT_NUM = 100;\n\t}\n\nend\n"
            //},
            initValue: "",      //截距项
            output: {},         //结果变量
            vars: [],            //特征项

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
                    _self.hasServerData = !!res && res.retCode == "00" && res.data.strategyType.toUpperCase() == "CARD";
                });

            } else this.convertFormData();
        },
        updated: function () {
            $('.cardsOuter.disabled input').prop("disabled", true);
            $('.cardsOuter.disabled select').prop("disabled", true);
            $('.cardsOuter.disabled .varOperate').remove();
        },
        methods: {
            //转换strategyJson成initValue，output，vars
            convertFormData: function () {
                try {
                    var json = !!this.formData.strategyJson && JSON.parse(this.formData.strategyJson);
                    if (!!json.cardName && !this.formData.strategyName) this.formData.strategyName = json.cardName;
                    this.initValue = json.initValue || "";
                    this.output = json.output || {};
                    this.vars = json.vars || [];
                } catch (e) {
                }
            },
            //是否有编辑按钮
            withEdit: function () {
                var currentUser = Utils.getCurrentUser().userId;
                var row = this.formData;
                return (row.isLock == 1 && currentUser == row.userId) || row.isLock != 1;
            },
            //选择结果变量
            openOutputVarList: function () {
                var _self = this;
                Utils.openModal({
                    title: "选择变量",
                    width: 600,
                    currentView: "variateSearch",
                    componentParam: this.output,
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.output, 'name', item.temp.variate.name);
                            Vue.set(_self.output, 'paramType', item.temp.variate.paramType);
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },
            //选择特征项变量
            openVarList: function () {
                var _self = this;
                Utils.openModal({
                    title: "选择变量",
                    width: 600,
                    currentView: "variateSearch",
                    componentParam: {},
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            Vue.set(_self.vars, _self.vars.length, $.extend({}, item.temp.variate, {
                                scores: [{type: "else", result: {operator: "=", type: "const", value: ""}}]
                            }));
                            delete item.temp;
                        },
                        cancel: function (item) {
                            item = item || {temp: {}};
                            delete item.temp;
                        }
                    }
                });
            },

            getCardJson: function () {
                var cardJson = {
                    cardName: this.formData.strategyName || "",
                    initValue: this.initValue || "",
                    output: this.output || {},
                    vars: this.vars || []
                };
                return cardJson;
            },
            //查看源代码
            readSourceCode: function () {
                this.openSource = !this.openSource;
                if (this.openSource) {
                    this.$nextTick(function () {
                        this.formData.strategyBody = new Engine.ScoreCard("ace-area").translate(this.getCardJson());
                    });
                }
            },
            //保存|更新
            saveCard: function () {
                var cardData = this.getCardJson();
                this.formData.strategyJson = JSON.stringify(cardData);
                var engine = new Engine.ScoreCard("ace-area");
                this.formData.strategyBody = engine.translate(cardData);
                this.referData = _.uniq(engine.getReferVarList(), function (item) {
                    return item.controlNo + item.elementName;
                });

                _.map(this.referData, function (item) {
                    item.refTypeName = "CARD";
                    item.refvarName = cardData.cardName;
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
                    if (res && res.retCode == "00") {
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
            editCard: function () {
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
})