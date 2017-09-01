/**
 * Created by ZhaiFenfang on 2017/8/23.
 */
define(['vue', 'daterangepicker', 'Utils', 'ELEMENT', 'underscore'],
    function (Vue, daterangepicker, Utils, ELEMENT, _) {
        Vue.use(ELEMENT);
        var queryParamEmpty = {
            strategyType: "",    //策略类型
            sort: "",            //策略分类
            strategyName: "",    //策略名称
            description: "",     //策略描述
            compilingStatus: "",          //策略状态
            startDate: "",       //创建开始时间
            endDate: ""          //创建结束时间
        };
        new Vue({
            el: "#body",
            data: {
                startCreateTip: false,
                //策略工具
                typeList: Utils.Const.StrategyTypeList,
                //状态列表
                statusList: Utils.Const.StrategyStatusList,
                //查询参数
                queryParam: $.extend({}, queryParamEmpty),
                //排序分页参数
                sortParam: {
                    pageNum: 1,
                    pageSize: 10,
                    sortField: "createTime",
                    order: "desc"
                },
                totalCount: 0,
                //策略列表
                strategyList: []
            },
            mounted: function () {
                var _self = this;
                $('.dateranger').daterangepicker({
                    autoUpdateInput: false,
                    minDate: new Date().AddMonth(-3).Format("yyyy-MM-dd"),
                    maxDate: new Date().Format("yyyy-MM-dd")
                }).on("apply.daterangepicker", function (e, picker) {
                    _self.queryParam.startDate = picker.startDate.format('YYYY-MM-DD') + " 00:00:00";
                    _self.queryParam.endDate = picker.endDate.format('YYYY-MM-DD') + " 00:00:00";
                    $(this).val(picker.startDate.format('YYYY-MM-DD') + " - " + picker.endDate.format('YYYY-MM-DD'));
                });

                this.asyncQueryList();

            },
            filters: {
                formatCreateUrl: function (url) {
                    if (!!url) return "/rulengine-app/html/basic/" + url;
                    return "#";
                },
                //策略状态
                compilingStatusFormatter: function (cellValue) {
                    var compilingStatus = _.find(Utils.Const.StrategyStatusList, function (item) {
                        return item.value == cellValue
                    });
                    if (!!compilingStatus) return compilingStatus.name;
                    return cellValue;
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
                //策略状态颜色
                compilingStatusColor: function (status) {
                    return {
                            0: "#F35354",
                            1: "#06BAC6"
                        }[status] || "#5D5D5D";
                },
                //是否可以编辑和删除
                canEditDetail: function (row) {
                    var currentUser = Utils.getCurrentUser().userId;
                    return (row.isLock == 1 && currentUser == row.userId) || row.isLock != 1;
                },
                //load list from server
                asyncQueryList: function () {
                    var _self = this;
                    $.postJSON("/platform/strategy/query", {
                        queryParam: this.queryParam,
                        sortParam: this.sortParam
                    }, function (res) {
                        if (!!res && res.retCode == "00") {
                            var data = res.data || {};
                            _self.strategyList = data.queryList || [];
                            _self.totalCount = data.rowCount || 0;
                            _self.sortParam.pageNum = data.currentPage || 1;
                        } else Utils.showTip(res.retMsg, "fail");
                    });
                },
                handleMouseEnter: function (row, column, cell) {
                    Vue.set(row, "showOperate", true);
                },
                handleMouseOut: function (row, column, cell) {
                    Vue.delete(row, "showOperate");
                },
                //排序处理
                handleSortChange: function (setting) {
                    this.sortParam.sortField = setting.prop;
                    this.sortParam.order = {
                            "ascending": "asc",
                            "descending": "desc"
                        }[setting.order] || "desc";
                    this.asyncQueryList();
                },
                //pageSize 改变
                handlePaginationSizeChange: function (pageSize) {
                    this.sortParam.pageSize = pageSize;
                    this.asyncQueryList();
                },
                //currentPage 改变
                handlePaginationCurrentChange: function (currentPage) {
                    this.sortParam.pageNum = currentPage;
                    this.asyncQueryList();
                },
                //查询重置
                reset: function () {
                    this.queryParam = $.extend({}, queryParamEmpty);
                    $('.dateranger').val('').data('daterangepicker').setStartDate(new Date().Format("yyyy-MM-dd"));
                    $('.dateranger').data('daterangepicker').setEndDate(new Date().Format("yyyy-MM-dd"));
                },
                //查看引用
                showReferenceList: function (controlNo) {
                    Utils.openModal({
                        title: "查看引用",
                        okText: "",
                        width: 600,
                        currentView: "both-reference-list",
                        componentParam: {controlNo: controlNo, areaType: "platform"}
                    });
                },
                //删除
                deleteControl: function (controlNo, strategyName) {
                    //1：查看是否被引用
                    var _self = this;
                    $.postJSON("/platform/reference/query", {refvarNum: controlNo}, function (res) {
                        if (!!res && res.retCode == "00") {
                            var beRefList = (res.data || {}).beRefInfo;
                            if (!!beRefList && !!beRefList.length) {
                                Utils.openModal({
                                    title: "删除提示",
                                    body: '<div style="font-size:14px;margin-bottom: 20px;">' + strategyName + '正被下表所示内容引用，若要删除，请先解除下述引用！' + '</div>',
                                    okText: "知道了",
                                    cancelText: "",
                                    currentView: 'be-reference-list',
                                    componentParam: {beRefInfo: beRefList}
                                });
                            } else {
                                //2：删除确认
                                Utils.openModal({
                                    title: "删除提示",
                                    body: '<div style="text-align: center;margin:10px 0;">删除是不可逆的，是否确定删除该策略？</div>',
                                    action: {
                                        ok: function () {
                                            //3：删除
                                            $.postJSON("/platform/strategy/delete", {controlNo: controlNo}, function (res) {
                                                if (res && res.retCode == "00") {
                                                    Utils.showTip("删除成功");
                                                    _self.asyncQueryList();
                                                }
                                                else Utils.showTip(res.retMsg || "删除失败", "fail");
                                            }, function () {
                                                Utils.showTip("删除失败", "fail");
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                },
                //详情查看
                showDetail: function (row) {
                    var strategyType = _.find(Utils.Const.StrategyTypeList, function (item) {
                        return item.value.toLowerCase() == row.strategyType.toLowerCase()
                    });
                    if (!!strategyType) {
                        window.open(strategyType.detailUrl + "?controlNo=" + row.controlNo, "_blank");
                    }
                },
                //编辑
                editDetail: function (row) {
                    //1：查看是否被引用
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
                                    window.open(strategyType.createUrl + "?controlNo=" + row.controlNo, "_blank");
                                }
                            }
                        }
                    });
                }
            }
        })
    });