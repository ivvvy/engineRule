﻿/**
 * Created by ZhaiFenfang on 2017/8/21.
 * Vue全局组件的定义
 */
define(["jquery", "underscore", "vue", 'Utils',
        'text!html/templates/layoutMain.html', 'text!html/templates/subMenu.html', 'text!html/templates/rightPart.html',
        'text!html/templates/linePart.html', 'text!html/templates/constraintPart.html', 'text!html/templates/resultPart.html',
        'text!html/templates/cardVarPart.html', 'text!html/templates/syncopateVar.html', 'text!html/templates/referenceList.html',
        'text!html/templates/selectStrategyList.html',
        'text!html/templates/variateList.html', 'text!html/templates/asyncList.html', 'text!html/templates/fnList.html',
        'text!html/templates/beReferenceList.html', 'text!html/templates/versionTest.html', 'text!html/templates/versionTestEntry.html'],
    function ($, _, Vue, Utils, LayoutTmp, SubMenuTpl, RightPartTpl, LinePartTpl, ConstraintPartTpl, ResultPartTpl, CardVarTpl,
              SyncopateVarTpl, ReferenceListTpl, SelectStrategyListTpl, VariateListTpl, asyncAlertList, FnListTpl, BeReferenceListTpl, versionTestList, versionTestEntryList) {
        //function ($, _, Vue, Utils, LayoutTmp, SubMenuTpl, RightPartTpl, LinePartTpl, ConstraintPartTpl, ResultPartTpl, CardVarTpl,
        //SyncopateVarTpl, ReferenceListTpl, BeReferenceListTpl, VariateListTpl, asyncAlertList, FnListTpl) {

        window.GlobalComponents = {
            //左侧菜单
            submenu: Vue.component('submenu', {
                template: SubMenuTpl,
                props: ["submenu", "menulist"],
                data: function () {
                    return {menu: this.submenu};
                },
                methods: {
                    openSubMenu: function () {
                        this.$emit('click');
                    }
                },
                filters: {
                    menuLinkFilter: function (href) {
                        if (!!href) return "/rulengine-app/html/" + href;
                        return "#";
                    }
                }
            }),
            //页面框架[header,menu]
            layoutMain: Vue.component('layout-main', {
                template: LayoutTmp,
                props: ["module", "path"],
                data: function () {
                    this.menulist = (this.path || "").split("->");
                    return {
                        userInfo: {
                            name: "测试",
                            role: "管理员"
                        },
                        menu: [
                            {name: "首页", link: "index.html", icon: "home"},
                            {
                                name: "系统管理", link: "", icon: "sys", childMenu: [
                                {name: "机构管理", link: "orgManager.html"},
                                {name: "用户管理", link: "orgUserManager.html"},
                                {name: "角色管理", link: "roleManager.html"}
                            ]
                            },
                            {
                                name: "规则工程", link: "", icon: "rule", childMenu: [
                                {
                                    name: "底层", link: "", childMenu: [
                                    {name: "变量", link: "basic/variateList.html"},
                                    {name: "策略", link: "basic/strategyList.html"},
                                    {name: "策略集", link: "basic/strategySetList.html"},
                                    {name: "决策流", link: "basic/decisionFlowList.html"}
                                ]
                                },
                                {
                                    name: "定制层", link: "", childMenu: [
                                    {name: "变量", link: "customise/variateList.html"},
                                    {name: "策略", link: "customise/strategyList.html"},
                                    {name: "策略集", link: "customise/strategySetList.html"},
                                    {name: "决策流", link: "customise/decisionFlowList.html"}
                                ]
                                },
                                {name: "策略发布", link: "strategyPublish.html"}
                            ]
                            }
                        ]
                    };
                },
                methods: {
                    openSubMenu: function (e) {
                        var target = $(e.target).parents("li").first(),
                            subMenu = target.find("ul").first();
                        if (target && subMenu) {
                            target.toggleClass("open").siblings().removeClass("open");
                        }
                    }
                },
                filters: {
                    menuLinkFilter: function (href) {
                        if (!!href) return "/rulengine-app/html/" + href;
                        return "#";
                    }
                }
            }),
            //右半部分控件
            rightPart: Vue.component('right-part', {
                template: RightPartTpl,
                props: ["right", "withfn"],
                data: function () {
                    if (!this.right) Vue.set(this, "right", {type: "const"});
                    if (!!this.right && !this.right.type) Vue.set(this.right, "type", "const");
                    return {};
                },
                methods: {
                    changeType: function () {
                        var _self = this, type = this.right.type;
                        for (var key in this.right) {
                            Vue.delete(_self.right, key);
                        }
                        Vue.set(this.right, "type", type);
                    },
                    //打开变量选择框
                    openVarList: function () {
                        var _self = this;
                        Utils.openModal({
                            title: "选择变量",
                            width: 600,
                            currentView: "variateSearch",
                            componentParam: this.right,
                            action: {
                                ok: function (item) {
                                    item = item || {temp: {}};
                                    Vue.set(_self.right, 'name', item.temp.variate.name);
                                    Vue.set(_self.right, 'paramType', item.temp.variate.paramType);
                                    delete item.temp;
                                },
                                cancel: function (item) {
                                    item = item || {temp: {}};
                                    delete item.temp;
                                }
                            }
                        });
                    },
                    //打开函数选择框
                    openFNList: function () {
                        var _self = this;
                        Utils.openModal({
                            title: "选择函数",
                            width: 500,
                            currentView: "functionSearch",
                            componentParam: this.right,
                            action: {
                                ok: function (item) {
                                    item = item || {temp: {}};
                                    Vue.set(_self.right, 'name', item.temp.fn.name);
                                    Vue.set(_self.right, 'parameters', item.temp.fn.parameters);
                                    delete item.temp;
                                },
                                cancel: function (item) {
                                    item = item || {temp: {}};
                                    delete item.temp;
                                }

                            }
                        });
                    }
                }
            }),
            //规则整行控件
            linePart: Vue.component('line-part', {
                template: LinePartTpl,
                props: ["line", "type"],
                data: function () {
                    var operates = this.type == "constraint" ? Utils.Const.ConstraintOperators : Utils.Const.ResultOperators;
                    if (!this.line.operator) Vue.set(this.line, "operator", "");
                    if (!!this.line && !this.line.left) Vue.set(this.line, "left", {});
                    if (!!this.line && !this.line.right) Vue.set(this.line, "right", {});
                    return {
                        operates: operates
                    };
                },
                methods: {
                    changeOperator: function () {
                        if (this.line.operator.indexOf("null") >= 0) Vue.set(this.line, "right", {});
                        else Vue.set(this.line, "right", {type: "const"});
                    },
                    openVarList: function () {
                        var _self = this;
                        Utils.openModal({
                            title: "选择变量",
                            width: 600,
                            currentView: "variateSearch",
                            componentParam: this.line.left,
                            action: {
                                ok: function (item) {
                                    item = item || {temp: {}};
                                    Vue.set(_self.line.left, 'name', item.temp.variate.name);
                                    Vue.set(_self.line.left, 'paramType', item.temp.variate.paramType);
                                    delete item.temp;
                                },
                                cancel: function (item) {
                                    item = item || {temp: {}};
                                    delete item.temp;
                                }
                            }
                        });
                    }
                }
            }),
            //规则/决策流条件部分
            constraintPart: Vue.component('constraint-part', {
                template: ConstraintPartTpl,
                props: ["type", "constraint", "level"],
                data: function () {
                    if (!!this.constraint && this.constraint.length == 0) Vue.set(this.constraint, 0, {
                        left: {}, right: {}
                    });
                    return {}
                },
                methods: {
                    //添加
                    addConstraintItem: function () {
                        var itemLength = this.constraint.length;
                        Vue.set(this.constraint, itemLength, {type: "&&", left: {}, right: {}});
                    },
                    //删除
                    deleteConstraintItem: function (index) {
                        Vue.delete(this.constraint, index);
                    },
                    //嵌入
                    insertConstraintItem: function (con) {
                        if (!con.fields) {
                            Vue.set(con, "fields", [{type: "&&", left: {}, right: {}}]);
                        } else {
                            Vue.set(con.fields, con.fields.length, {type: "&&", left: {}, right: {}});
                        }
                    }
                }
            }),
            //策略组件的结果部分
            resultPart: Vue.component('result-part', {
                template: ResultPartTpl,
                props: ["result", "type"],
                data: function () {
                    return {};
                },
                methods: {
                    addThenItem: function () {
                        Vue.set(this.result, this.result.length, {left: {}, right: {}});
                    },
                    deleteThenItem: function (index) {
                        Vue.delete(this.result, index);
                    }
                }
            }),
            //评分卡特征变量
            cardVarPart: Vue.component('card-var', {
                template: CardVarTpl,
                props: ["variate", "items"],
                data: function () {
                    return {
                        rightOperates: Utils.Const.ResultOperators,
                        showDetail: true
                    };
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
                methods: {
                    //切分变量
                    syncopateVar: function () {
                        var _self = this;
                        Utils.openModal({
                            title: "切分变量",
                            width: 600,
                            currentView: "syncopateVar",
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
                    //删除变量
                    removeVar: function (varName) {
                        var index = _.findIndex(this.items, function (item) {
                            return item.name == varName;
                        });
                        if (index >= 0) Vue.delete(this.items, index);
                    }
                }
            }),
            //切分变量
            syncopateVar: Vue.component('syncopate-var', {
                template: SyncopateVarTpl,
                props: ["options"],
                computed: {
                    comparatorLines: {
                        get: function () {
                            if (!this.tempOptions || this.tempOptions.length == 0)
                                return [{
                                    leftLine: {
                                        comparator: "",
                                        right: {type: "const", value: ""}
                                    }, rightLine: {
                                        comparator: "",
                                        right: {type: "const", value: ""}
                                    }
                                }];

                            var filterOptions = _.filter(this.tempOptions, function (item) {
                                return item.type != "else";
                            });

                            _.map(filterOptions, function (opt) {
                                if (!!opt.leftLine && !opt.leftLine.right) Vue.set(opt.leftLine, "right", {
                                    type: "const",
                                    value: ""
                                });
                                if (!!opt.rightLine && !opt.rightLine.right) Vue.set(opt.rightLine, "right", {
                                    type: "const",
                                    value: ""
                                });
                                var comparator = [];
                                if (!!opt.leftLine && !!opt.leftLine.comparator)  comparator.push(opt.leftLine.comparator);
                                if (!!opt.rightLine && !!opt.rightLine.comparator)  comparator.push(opt.rightLine.comparator);
                                opt.comparator = comparator.join(",");
                            });

                            return filterOptions;
                        },
                        set: function (value) {
                            this.tempOptions = value;
                        }
                    }
                },
                data: function () {
                    var tempOptions = this.options.slice();
                    this.options.temp = {scores: tempOptions};
                    return {
                        compartors: Utils.Const.ComparatorList,
                        tempOptions: tempOptions
                    };
                },
                methods: {
                    changeComparator: function (line) {
                        var comparatorItem = _.find(this.compartors, function (item) {
                            return item.value == line.comparator;
                        });
                        if (!!comparatorItem) {
                            if (!!comparatorItem.leftLine.comparator) line.leftLine.comparator = comparatorItem.leftLine.comparator;
                            else line.leftLine = comparatorItem.leftLine;
                            if (!!comparatorItem.rightLine.comparator) line.rightLine.comparator = comparatorItem.rightLine.comparator;
                            else line.rightLine = comparatorItem.rightLine;
                        }
                    },
                    deleteLine: function (index) {
                        Vue.delete(this.tempOptions, index);
                    },
                    addLine: function () {
                        var length = Math.max(0, this.tempOptions.length - 1);
                        this.tempOptions.splice(length, 0, {
                            leftLine: {},
                            rightLine: {comparator: "=="},
                            result: {operator: "=", type: "const", value: ""}
                        });
                    }
                }
            }),
            //变量搜索列表
            variateSearch: Vue.component('variate-search', {
                template: VariateListTpl,
                props: ["options"],
                data: function () {
                    var varList = [
                        {varType: "INPUT", varName: "STAN_PRODUCT_NUM", dataType: "String", description: "机构产品"},
                        {varType: "INPUT", varName: "STAN_LOAN_TYPE", dataType: "Date", description: "贷款类型"},
                        {varType: "INPUT", varName: "STAN_LOAN_WAY", dataType: "String", description: "贷款方式"},
                        {varType: "INPUT", varName: "STAN_MARKET_SCNE", dataType: "String", description: "业务场景"},
                        {varType: "OUTPUT", varName: "STAN_PRODUCT_NUM", dataType: "Integer", description: "机构产品"},
                        {varType: "OUTPUT", varName: "STAN_LOAN_TYPE", dataType: "String", description: "贷款类型"},
                        {varType: "TEMP", varName: "STAN_PRODUCT_NUM", dataType: "String", description: "机构产品"},
                        {varType: "TEMP", varName: "STAN_LOAN_TYPE", dataType: "Boolean", description: "贷款类型"}
                    ];

                    return {
                        varList: varList,
                        groups: this.groupVarList(varList)
                    };
                },
                methods: {
                    groupVarList: function (varList) {
                        _.map(varList, function (item) {
                            item.varTypeName = (_.find(Utils.Const.VarTypeList, function (itemI) {
                                    return itemI.value == item.varType;
                                }) || {}).name || "输入变量";
                            item.dataTypeName = (_.find(Utils.Const.DataTypeLit, function (itemI) {
                                    return itemI.value == item.dataType;
                                }) || {}).name || "字符型";
                        });

                        var groupList = _.groupBy(varList, function (item) {
                            return item.varTypeName || "输入变量";
                        });

                        groupList = _.map(groupList, function (list, key) {
                            return {varTypeName: key, list: list};
                        });

                        return groupList;
                    },
                    toggleTable: function (e) {
                        var tip = $(e.target);
                        tip.toggleClass("shrink");
                    },
                    selectVar: function (item, e) {
                        var trItem = $(e.currentTarget);
                        $('.variateList tr').removeClass("selected");
                        trItem.addClass("selected");
                        this.options.temp = {variate: {name: item.varName, paramType: item.varType}};
                    },
                    //实时搜索变量
                    queryVarList: function (e) {
                        var input = $(e.currentTarget).val().toLowerCase().trim();
                        var queryResult = _.filter(this.varList, function (item) {
                            return item.varTypeName.toLowerCase().indexOf(input) >= 0
                                || item.varName.toLowerCase().indexOf(input) >= 0
                                || item.description.toLowerCase().indexOf(input) >= 0
                                || item.dataTypeName.toLowerCase().indexOf(input) >= 0;
                        });

                        this.groups = this.groupVarList(queryResult);
                    }
                }
            }),
            //函数搜索列表
            functionSearch: Vue.component('fn-search', {
                template: FnListTpl,
                props: ["options"],
                data: function () {
                    var fnList = [
                        {name: "SUM", paramCount: 2, description: "两者相加", fnType: "常用"},
                        {name: "COUNT", paramCount: 1, description: "计算数组中的元素个数", fnType: "常用"},
                        {name: "MIN", paramCount: 5, description: "得出最小值", fnType: "常用"},
                        {name: "MAX", paramCount: 3, description: "得出最大值", fnType: "常用"},
                        {name: "Trim", paramCount: 1, description: "去除首位空格", fnType: "文本"},
                        {name: "AddMonth", paramCount: 1, description: "在当前日期基础上增加指定个数的月份", fnType: "日期"}
                    ];

                    return {
                        fnList: fnList,
                        groups: this.groupFNList(fnList)
                    }
                },
                methods: {
                    groupFNList: function (fnList) {

                        var groupList = _.groupBy(fnList, function (item) {
                            return item.fnType || "其他函数";
                        });

                        groupList = _.map(groupList, function (list, key) {
                            return {fnType: key, list: list};
                        });

                        return groupList;
                    },
                    toggleTable: function (e) {
                        var tip = $(e.target);
                        tip.toggleClass("shrink");
                    },
                    selectFN: function (item, e) {
                        var trItem = $(e.currentTarget);
                        $('.fnList tr').removeClass("selected");
                        trItem.addClass("selected");
                        var parameters = [];
                        for (var i = 0; i < item.paramCount; i++) parameters.push({type: "const"});
                        this.options.temp = {fn: {name: item.name, parameters: parameters}};
                    },
                    queryFnList: function (e) {
                        var input = $(e.currentTarget).val().toLowerCase().trim();
                        var queryResult = _.filter(this.fnList, function (item) {
                            return item.name.toLowerCase().indexOf(input) >= 0
                                || item.description.toLowerCase().indexOf(input) >= 0
                                || item.fnType.toLowerCase().indexOf(input) >= 0;
                        });

                        this.groups = this.groupFNList(queryResult);
                    }
                }
            }),
            //查看引用和被引用
            referenceList: Vue.component('both-reference-list', {
                template: ReferenceListTpl,
                props: ["options"],
                data: function () {
                    return {
                        currentTab: "ref",
                        refList: [],
                        beRefList: []
                    };
                },
                mounted: function () {
                    this.asyncQueryReference();
                },
                methods: {
                    //策略类型
                    strategyTypeFormatter: function (row, column, cellValue) {
                        if (cellValue.toLowerCase() == "var") return "变量";
                        var strategyType = _.find(Utils.Const.StrategyTypeList, function (item) {
                            return item.value.toLowerCase() == cellValue.toLowerCase()
                        });
                        if (!!strategyType) return strategyType.name;
                        return cellValue;
                    },
                    //异步获取引用和被引用关系
                    asyncQueryReference: function () {
                        var _self = this;
                        $.postJSON("/" + (this.options.areaType || "platform") + "/reference/query", {refvarNum: this.options.controlNo}, function (res) {
                            if (!!res && res.retCode == "00") {
                                _self.refList = (res.data || {}).refInfo;
                                _self.beRefList = (res.data || {}).beRefInfo;
                            }
                        });
                    }
                }
            }),
            //被引用列表
            beReferenceList: Vue.component('be-reference-list', {
                template: BeReferenceListTpl,
                props: ["options"],
                data: function () {
                    return {beRefList: this.options.beRefInfo};
                },
                methods: {
                    //策略类型
                    strategyTypeFormatter: function (row, column, cellValue) {
                        if (cellValue.toLowerCase() == "var") return "变量";
                        var strategyType = _.find(Utils.Const.StrategyTypeList, function (item) {
                            return item.value.toLowerCase() == cellValue.toLowerCase()
                        });
                        if (!!strategyType) return strategyType.name;
                        return cellValue;
                    }
                }
            }),
            //选择策略
            selectStrategyList: Vue.component('select-strategy', {
                template: SelectStrategyListTpl,
                props: ["selected", "options"],
                data: function () {
                    return {
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
                            },
                            {
                                "controlNo": "RULE201708290005",
                                "versions": "V1.0.0",
                                "orgId": "1008610086",
                                "sort": "反欺诈",
                                "description": "规则5",
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
                            },
                            {
                                "controlNo": "RULE201708290006",
                                "versions": "V1.0.0",
                                "orgId": "1008610086",
                                "sort": "反欺诈",
                                "description": "规则6",
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
                        ],
                        StrategyTypeList: Utils.Const.StrategyTypeList,
                        sortParam: {
                            pageNum: 1,
                            pageSize: 10,
                            sortField: "createTime",
                            order: "desc"
                        },
                        totalCount: 200
                    }
                },
                mounted: function () {
                    //todo:load list from server
                    var _self = this;
                    _.each(this.strategyList || [], function (item) {
                        var selectedList = _self.selected || [];
                        var selected = !!(_.find(selectedList, function (se) {
                            return se.controlNo == item.controlNo
                        }));
                        _self.$refs.table.toggleRowSelection(item, selected);
                    });
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
                    //pageSize 改变
                    handlePaginationSizeChange: function (pageSize) {
                    },
                    //currentPage 改变
                    handlePaginationCurrentChange: function (currentPage) {
                    },
                    //勾选变化
                    handleSelectionChange: function (selection) {
                        this.options.temp = {selectedList: selection};
                    }
                }
            }),
            //同步弹出框
            asyncAlert: Vue.component('async-alert', {
                template: asyncAlertList,
                props: ["options"],
                data: function () {
                    return {
                        keyWord: "",
                        dataList: [
                            {code: "OG00000921", name: "测试机构"},
                            {code: "OG00000922", name: "测试机构1"},
                            {code: "OG00000923", name: "测试机构2"},
                            {code: "OG00000924", name: "测试机构3"},
                            {code: "OG00000925", name: "测试机构4"},
                            {code: "OG00000926", name: "测试机构5"},
                            {code: "OG00000927", name: "测试机构6"},
                            {code: "OG00000929", name: "测试机构7"}
                        ],
                        //checkAll: false,
                        //checkOnes: [],
                        //dataListCode: [],
                        multipleSelection: []
                    };
                },
                mounted: function () {
                    this.getAysncList();
                    //this.setDataListCode();
                },
                methods: {
                    //setDataListCode: function(){
                    //    var _self = this;
                    //    this.dataList.forEach(function(item){
                    //        _self.dataListCode.push(item.code);
                    //    })
                    //},
                    //checkAllChange: function(){
                    //    this.checkAll = !this.checkAll;
                    //    this.checkOnes = this.checkAll ? this.dataListCode : [];
                    //},
                    //boxChecked: function(event){
                    //    var el = event.target;
                    //    if($(el).hasClass("icon-checkbox-false")){
                    //        $(el).removeClass("icon-checkbox-false").addClass("icon-checkbox-true");
                    //        this.checkOnes.push($(el).parents().siblings(".code").text());
                    //    }else{
                    //        $(el).removeClass("icon-checkbox-true").addClass("icon-checkbox-false");
                    //        this.checkOnes = this.checkOnes.filter(function (item) {
                    //            return item != $(el).parents().siblings(".code").text();
                    //        })
                    //    }
                    //    if(this.checkOnes.length === this.dataListCode.length){
                    //        this.checkAll = true;
                    //    }else{
                    //        this.checkSpecial = false;
                    //    }
                    //    if(this.checkOnes.length === 0){
                    //        this.checkAll = false;
                    //    }
                    //},
                    getAysncList: function () {
                        console.log("请求数据");
                        console.log(this.options.url);
                    },
                    asyncSearch: function () {
                        console.log("查询");
                    },
                    handleSelectionChange: function (val) {
                        this.multipleSelection = val;
                    }
                }
            }),
            //版本测试弹出框
            versionTest: Vue.component('version-test', {
                template: versionTestList,
                props: ["options"],
                mounted: function () {
                    this.getVersionData()
                },
                methods: {
                    getVersionData: function () {
                        console.log("版本测试弹出框弹出");
                    },
                    classify: function (row) {
                        if (row.classify == 1) {
                            return "底层";
                        } else if (row.classify == 2) {
                            return "自定义层";
                        }
                    }
                }
            }),
            //版本测试入参弹出框
            versionTestEntry: Vue.component('version-test-entry', {
                template: versionTestEntryList,
                props: ["options"],
                data: function () {
                    return {
                        keyWord: "",
                        inputValue: [],
                        versionTestEntryList: [
                            {fieldName: "D_ORG", describe: "1个月内线上详情", type: 1},
                            {fieldName: "STAN_EMP_CITY", describe: "1个月内线上详情", type: 1},
                            {fieldName: "STAN_HOME_CITY", describe: "3个月内线上详情", type: 2},
                            {fieldName: "STAN_CELL_PHONE_CITY", describe: "1个月内线上详情", type: 2},
                            {fieldName: "STAN_PHONE_CITY", describe: "3个月内线上详情", type: 1},
                            {fieldName: "D_ORG", describe: "1个月内线上详情", type: 2},
                            {fieldName: "STAN_HOME_CITY", describe: "1个月内线上详情", type: 1},
                            {fieldName: "D_ORG", describe: "3个月内线上详情", type: 2},
                            {fieldName: "D_ORG", describe: "1个月内线上详情", type: 1},
                            {fieldName: "STAN_EMP_CITY", describe: "1个月内线上详情", type: 2},
                            {fieldName: "D_ORG", describe: "3个月内线上详情", type: 1},
                            {fieldName: "STAN_SHCOOL_CITY", describe: "1个月内线上详情", type: 2},
                            {fieldName: "D_ORG", describe: "1个月内线上详情", type: 1},
                        ]
                    }
                },
                mounted: function () {
                    this.getVersionEntryData()
                },
                methods: {
                    getVersionEntryData: function () {
                        console.log("获取版本测试入参弹出框数据");
                    },
                    keywordsSearch: function () {
                        console.log("点击查询");
                    }
                }
            })
        };
    });
