/**
 * Created by ZhaiFenfang on 2017/8/22.
 */
define(['jquery', 'vue', 'text!html/templates/modal.html', 'text!html/templates/messageTip.html'],
    function ($, Vue, ModalTpl, TipTpl) {

        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //�
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //�
                "s+": this.getSeconds(), //�
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        Date.prototype.Add = function (interval, number) {
            switch (interval) {
                case 's':
                    return new Date(Date.parse(this) + (1000 * number));
                case 'm':
                    return new Date(Date.parse(this) + (60000 * number));
                case 'h':
                    return new Date(Date.parse(this) + (3600000 * number));
                case 'd':
                    return new Date(Date.parse(this) + (86400000 * number));
                case 'w':
                    return new Date(Date.parse(this) + ((86400000 * 7) * number));
                case 'M':
                    //var lastMonth = new Date(this.getFullYear(), (this.getMonth() + number), 0);
                    //if (this.getDate() > lastMonth.getDate())
                    //    return new Date(this.getFullYear(), (this.getMonth()) + number, lastMonth.getDate());
                    return new Date(this.getFullYear(), (this.getMonth()) + number, this.getDate());
                case 'q':
                    return new Date(this.getFullYear(), (this.getMonth()) + number * 3, this.getDate());
                case 'y':
                    return new Date((this.getFullYear() + number), this.getMonth(), this.getDate());
            }
        }
        Date.prototype.AddSecond = function (number) {
            return this.Add("s", number);
        };
        Date.prototype.AddMinute = function (number) {
            return this.Add("m", number);
        };
        Date.prototype.AddHour = function (number) {
            return this.Add("h", number);
        };
        Date.prototype.AddDay = function (number) {
            return this.Add("d", number);
        };
        Date.prototype.AddWeek = function (number) {
            return this.Add("w", number);
        };
        Date.prototype.AddMonth = function (number) {
            return this.Add("M", number);
        };
        Date.prototype.AddQuarter = function (number) {
            return this.Add("q", number);
        };
        Date.prototype.AddYear = function (number) {
            return this.Add("y", number);
        };

        return {

            Const: {
                StrategyTypeList: [//策略列表
                    {value: "RULE", name: "规则", createUrl: "ruleCreate.html", detailUrl: "ruleDetail.html"},
                    {value: "TREE", name: "决策树", createUrl: ""},
                    {value: "TABLE", name: "决策表", createUrl: "tableCreate.html"},
                    {value: "MATRIX", name: "决策矩阵", createUrl: "matrixCreate.html"},
                    {value: "CARD", name: "评分卡", createUrl: "cardCreate.html", detailUrl: "cardDetail.html"}
                ],
                StrategyStatusList: [//策略状态列表
                    {value: "2", name: "编写中"},
                    {value: "1", name: "编译成功"},
                    {value: "0", name: "编译失败"}
                ],
                VarTypeList: [//变量类型列表
                    {value: "INPUT", name: "输入变量"},
                    {value: "OUTPUT", name: "输出变量"},
                    {value: "TEMP", name: "中间变量"}
                ],
                DataTypeLit: [//数据类型列表
                    {value: "Integer", name: "数值型"},
                    {value: "String", name: "字符型"},
                    {value: "Boolean", name: "布尔型"},
                    {value: "Date", name: "日期型"}
                ],
                ConstraintOperators: [  //条件比较符
                    {value: ">=", name: ">="},
                    {value: ">", name: ">"},
                    {value: "<=", name: "<="},
                    {value: "<", name: "<"},
                    {value: "==", name: "=="},
                    {value: "== null", name: "== null"},
                    {value: "!= null", name: "!= null"},
                    {value: "!=", name: "!="}
                ],
                ResultOperators: [  //结果操作符
                    {value: "=", name: "="},
                    {value: "+=", name: "+="},
                    {value: "-=", name: "-="}
                ],
                ComparatorList: [   //比较操作符
                    {value: "==", name: " x == ", leftLine: {}, rightLine: {comparator: "=="}},
                    {value: "!=", name: " x != ", leftLine: {}, rightLine: {comparator: "!="}},
                    {value: ">=", name: " =< x ", leftLine: {comparator: ">="}, rightLine: {}},
                    {value: ">", name: " < x ", leftLine: {comparator: ">"}, rightLine: {}},
                    {value: "<=", name: " x <= ", leftLine: {}, rightLine: {comparator: "<="}},
                    {value: "<", name: " x < ", leftLine: {}, rightLine: {comparator: "<"}},
                    {value: ">,<", name: " < x < ", leftLine: {comparator: ">"}, rightLine: {comparator: "<"}},
                    {value: ">,<=", name: " < x <= ", leftLine: {comparator: ">"}, rightLine: {comparator: "<="}},
                    {value: ">=,<=", name: " =< x <= ", leftLine: {comparator: ">="}, rightLine: {comparator: "<="}},
                    {value: ">=,<", name: " =< x < ", leftLine: {comparator: ">="}, rightLine: {comparator: "<"}}
                ]
            },

            /**
             * 获取url上的query参数值
             * @param name
             * @param url
             * @returns {*}
             */
            getParameterByNameFromUrl: function (name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },

            /**
             * 获取当前登陆人信息
             * @returns {{userId: string}}
             */
            getCurrentUser: function () {
                return {userId: "8008208820"};
            },

            /**
             * 打开模态框
             * @param options
             * {title:"",okText:"",cancelText,"",body:"","action":{"ok",function(){},"cancel":function(){}}}
             */
            openModal: function (options) {
                var Modal = Vue.extend({
                    template: ModalTpl,
                    data: function () {
                        var opt = $.extend({
                            title: "对话框",
                            okText: "确定",
                            cancelText: "取消",
                            thirdButtonText: "",
                            width: 500,
                            body: '',
                            action: {
                                ok: null,
                                cancel: null,
                                thirdOperation: null
                            },
                            currentView: "",        //动态组件名
                            componentParam: {},      //组件接收的props数据,v-bind:options="componentParam"，key为options"
                        }, options);
                        opt.uid = new Date().getTime();
                        return opt;
                    },
                    components: window.GlobalComponents,
                    methods: {
                        removeModal: function () {
                            modalInstance.$destroy();
                            $('#modal_bg_' + this.uid).remove();
                            if (!!this.action && typeof this.action.cancel == "function")
                                this.action.cancel(this.componentParam);
                        },

                        submitOK: function () {
                            modalInstance.$destroy();
                            $('.modal_bg').remove();
                            if (!!this.action && typeof this.action.ok == "function")
                                this.action.ok(this.componentParam);
                        },

                        removeThirdModal: function () {
                            modalInstance.$destroy();
                            $('#modal_bg_' + this.uid).remove();
                            if (!!this.action && typeof this.action.thirdOperation == "function")
                                this.action.thirdOperation(this.componentParam);
                        }
                    }
                });

                var modalInstance = new Modal();
                $(".main").append(modalInstance.$mount().$el);
            }
            ,

            /**
             * 弹出提示信息
             * @param type [success|fail]
             * @param msg [提示信息，可以是html]
             * @param time [消失时间，默认3000ms] 单位：毫秒
             */
            showTip: function (msg, type, time) {
                var MTip = Vue.extend({
                    template: TipTpl,
                    data: function () {
                        return {
                            type: type || "success",
                            message: msg || "操作成功"
                        };
                    }
                });

                var tipInstance = new MTip(), container = $(".main");
                var hasAnotherTip = container.find(".tipTimeout").length > 0;
                if (hasAnotherTip) {
                    container.find(".tipTimeout").remove();
                    window.clearTimeout(window.tipTimeoutClock);
                }
                container.append(tipInstance.$mount().$el);
                window.tipTimeoutClock = window.setTimeout(function () {
                    tipInstance.$destroy();
                    container.find(".tipTimeout").remove();
                }, time || 3000);
            }
        };
    })
;