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
            //formData: {
            //    "strategyName": "MATRIX_TEST",
            //    "description": "欺诈评分矩阵",
            //    compilingStatus: "1",
            //    "sort": "反欺诈",
            //    "strategyJson": "{\"tableName\":\"MATRIX_TEST\",\"cols\":[{\"name\":\"STAN_MARKET_SCNE\",\"paramType\":\"INPUT\",\"conditions\":[{\"leftLine\":{\"right\":{\"type\":\"const\",\"value\":\"\"}},\"rightLine\":{\"right\":{\"type\":\"const\",\"value\":\"100\"},\"comparator\":\"<=\"},\"result\":{\"operator\":\"=\",\"type\":\"const\",\"value\":\"\"},\"comparator\":\"<=\"}]}],\"rows\":[{\"name\":\"STAN_PRODUCT_NUM\",\"paramType\":\"INPUT\",\"conditions\":[{\"leftLine\":{\"right\":{\"type\":\"const\",\"value\":\"5\"},\"comparator\":\">=\"},\"rightLine\":{\"comparator\":\"<=\",\"right\":{\"type\":\"const\",\"value\":\"15\"}},\"result\":{\"operator\":\"=\",\"type\":\"const\",\"value\":\"\"},\"comparator\":\">=,<=\"},{\"leftLine\":{\"right\":{\"type\":\"const\",\"value\":\"\"}},\"rightLine\":{\"comparator\":\"<=\",\"right\":{\"type\":\"const\",\"value\":\"25\"}},\"result\":{\"operator\":\"=\",\"type\":\"const\",\"value\":\"\"},\"comparator\":\"<=\"}]}],\"results\":[{\"outcomes\":[{\"operator\":\"=\",\"type\":\"const\",\"value\":\"100\"},{\"operator\":\"=\",\"type\":\"const\",\"value\":\"200\"}],\"name\":\"STAN_LOAN_WAY\",\"paramType\":\"INPUT\"}]}",
            //    "strategyType": "MATRIX",
            //    "strategyBody": "rule \"MATRIX_TEST\"\n\tdialect \"mvel\"\nwhen\n\tapp : HashMap()\nthen\n\tHashMap input = app.INPUT;\n\tHashMap output = app.OUTPUT;\n\tHashMap temp = app.TEMP;\n\n\tif((input.STAN_PRODUCT_NUM >= 5) && (input.STAN_PRODUCT_NUM <= 15) && (input.STAN_MARKET_SCNE <= 100)){\n\t\tinput.STAN_MARKET_SCNE <= 100;\n\t} else if( (input.APP_COUNT_3M >= 10) && (input.APP_COUNT_3M < 20) ){\n\t\tinput.STAN_PRODUCT_NUM = input.STAN_PRODUCT_NUM + 40;\n\t} else if((input.STAN_PRODUCT_NUM <= 25) && (input.STAN_MARKET_SCNE <= 100)){\n\t\tinput.STAN_LOAN_WAY = 200;\n\t}\n\nend\n"
            //},
            right: {},
            rowIndex: -1,
            colIndex: -1,
            rows: {},
            cols: {},
            results: {},
            variate: {},
            operates: Utils.Const.ResultOperators,
            hasServerData: false,
            validateResult: {},
            show: false,
            controlNo: Utils.getParameterByNameFromUrl("controlNo"),

            outcomes: [], //结果二维数组
        },
        computed: {
            rowsCount: function () {
                return (this.rows.conditions || []).length;
            },
            colsCount: function () {
                return (this.cols.conditions || []).length;
            }
        },
        watch: {
            right: function (newRight) {
                if (!newRight.operator) this.right.operator = "=";
            }
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
            if (!!this.controlNo) {
                var _self = this;
                $.postJSON("/platform/strategy/detail", {controlNo: this.controlNo}, function (res) {
                    if (!!res && res.retCode == "00") {
                        _self.formData = res.data || {};
                        _self.convertFormData();
                    }
                    _self.hasServerData = !!res && res.retCode == "00" && res.data.strategyType.toUpperCase() == "MATRIX";
                });

            } else this.convertFormData();
        },
        updated: function () {
            if ($(".matrixTable").hasClass("disable")) {
                this.colIndex = -1;
                this.rowIndex = -1;
            }
        },
        methods: {
            //转换strategyJson成cols，rows，result
            convertFormData: function () {
                try {
                    var json = !!this.formData.strategyJson && JSON.parse(this.formData.strategyJson);
                    if (!!json.tableName && !this.formData.strategyName) this.formData.strategyName = json.tableName;
                    this.rows = json.rows[0] || {};
                    this.cols = json.cols[0] || {};
                    this.results = json.results[0] || {};
                    var outcomes = this.results.outcomes || [];
                    for (var i = 0; i < this.rowsCount; i++) {
                        var row = [];
                        for (var j = 0; j < this.colsCount; j++) {
                            row.push(outcomes[i * this.colsCount + j]);
                        }
                        this.outcomes.push(row);
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
                            Vue.set(_self.rows, 'controlNo', item.temp.variate.controlNo);
                            Vue.set(_self.rows, 'versions', item.temp.variate.versions);
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
                            Vue.set(_self.cols, 'controlNo', item.temp.variate.controlNo);
                            Vue.set(_self.cols, 'versions', item.temp.variate.versions);
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
                            Vue.set(_self.results, 'controlNo', item.temp.variate.controlNo);
                            Vue.set(_self.results, 'versions', item.temp.variate.versions);
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
                    componentParam: (conditions || []).slice(),
                    action: {
                        ok: function (item) {
                            item = item || {temp: {}};
                            if (type == "行") {
                                Vue.set(_self.rows, "conditions", item.temp.scores);
                                var oldOutcomes = _self.outcomes.slice();
                                _self.outcomes = [];
                                for (var i = 0; i < item.temp.scores.length; i++) {
                                    if (!oldOutcomes[i]) Vue.set(_self.outcomes, i, Array.apply(null, Array(_self.colsCount)).map(function (item, i) {
                                        return {type: "const", operator: "=", value: ""};
                                    }));
                                    else Vue.set(_self.outcomes, i, oldOutcomes[i]);
                                }
                            }
                            if (type == "列") {
                                Vue.set(_self.cols, "conditions", item.temp.scores);
                                for (var i = 0; i < _self.rowsCount; i++) {
                                    var row = _self.outcomes[i].slice();
                                    _self.outcomes[i] = [];
                                    for (var j = 0; j < item.temp.scores.length; j++) {
                                        if (!row[j])Vue.set(_self.outcomes[i], j, {
                                            type: "const",
                                            operator: "=",
                                            value: ""
                                        });
                                        else Vue.set(_self.outcomes[i], j, row[j]);
                                    }
                                }
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
            changeOperator: function () {
                Vue.set(this.result, "right", {operator: "=", type: "const"});
            },
            //编辑结果
            editResultOutcome: function (outcome, rowIndex, colIndex) {
                this.rowIndex = rowIndex;
                this.colIndex = colIndex;
                this.show = true;
                if (!!outcome) this.right = $.extend({}, outcome);
                else this.right = {operator: "=", type: "const"};
            },
            //设置结果
            resetOutcome: function () {
                Vue.set(this.outcomes[this.rowIndex], this.colIndex, $.extend({}, this.right));
                this.$forceUpdate();
            },
            //获取矩阵json数据
            getMatrixJSON: function () {

                this.results.outcomes = [];
                for (var i = 0; i < this.outcomes.length; i++) {
                    var row = this.outcomes[i];
                    for (var j = 0; j < row.length; j++) {
                        this.results.outcomes.push(this.outcomes[i][j]);
                    }
                }
                var matrixData = {
                    tableName: this.formData.strategyName || "",
                    cols: [this.cols],
                    rows: [this.rows],
                    results: [this.results]
                };
                console.log("cols" + JSON.stringify(this.cols));
                console.log("rows" + JSON.stringify(this.rows));
                console.log("results" + JSON.stringify(this.results));

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
            },
            validate: function () {
                var _self = this;
                ["strategyName", "description", "sort"].forEach(function (key) {
                    Vue.set(_self.validateResult, key, Utils.Validate[key].call(window, _self.formData[key]));
                });

                //行变量
                if (!this.rows.name)Vue.set(this.validateResult, "rows", {result: false, message: "行变量不能为空"});
                else Vue.set(this.validateResult, "rows", {result: true, message: ""});

                //列变量
                if (!this.cols.name)Vue.set(this.validateResult, "cols", {result: false, message: "列变量不能为空"});
                else Vue.set(this.validateResult, "cols", {result: true, message: ""});

                //结果变量
                if (!this.results.name)Vue.set(this.validateResult, "results", {result: false, message: "结果变量不能为空"});
                else Vue.set(this.validateResult, "results", {result: true, message: ""});

                var result = true;
                _.map(this.validateResult, function (validate) {
                    result = result && validate.result;
                });
                return result;
            },
            //保存|更新
            save: function () {
                if (!this.validate()) return false;

                var MatrixData = this.getMatrixJSON();
                this.formData.strategyJson = JSON.stringify(MatrixData);
                var engine = new Engine.Table("ace-area");
                this.formData.strategyBody = engine.translateMatrix(MatrixData);
                this.referData = _.uniq(engine.getReferVarList(), function (item) {
                    return item.controlNo + item.elementName;
                });

                _.map(this.referData, function (item) {
                    item.refTypeName = "MATRIX";
                    item.refvarName = MatrixData.tableName;
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
            editMatrix: function () {
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