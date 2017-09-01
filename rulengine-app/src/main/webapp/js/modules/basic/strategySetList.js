/**
 * Created by ZhaiFenfang on 2017/8/31.
 */
define(['vue', 'Utils', 'ELEMENT'], function (Vue, Utils, ELEMENT) {
    Vue.use(ELEMENT);

    new Vue({
        el: "#body",
        data: {
            //查询参数
            queryParam: {},
            //分页排序参数
            sortParam: {
                pageNum: 1,
                pageSize: 10,
                sortField: "createTime",
                order: "desc"
            },
            totalCount: 0,
            strategySetList: [{
                controlNo: "123"
            }]
        },
        mounted: function () {
            //this.asyncQueryList();
        },
        methods: {
            //记录为锁定状态
            itemIsLock: function (row) {
                return row.isLock == 1;
            },
            //load list from server
            asyncQueryList: function () {
                var _self = this;
                $.postJSON("/platform/strategyset/query", {
                    queryParam: this.queryParam,
                    sortParam: this.sortParam
                }, function (res) {
                    if (!!res && res.retCode == "00") {
                        var data = res.data || {};
                        _self.strategySetList = data.queryList || [];
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
            //新增策略集
            createStrategySet: function () {
                window.open("strategySetCreate.html", "_blank");
            },
            //删除策略集
            deleteStrategySet: function (row) {
                //1：查看是否被引用
                var _self = this;
                $.postJSON("/platform/reference/query", {refvarNum: row.controlNo}, function (res) {
                    if (!!res && res.retCode == "00") {
                        var beRefList = (res.data || {}).beRefInfo;
                        if (!!beRefList && !!beRefList.length) {
                            Utils.openModal({
                                title: "删除提示",
                                body: '<div style="font-size:14px;margin-bottom: 20px;">' + row.strategySetName + '正被下表所示内容引用，若要删除，请先解除下述引用！' + '</div>',
                                okText: "知道了",
                                cancelText: "",
                                currentView: 'be-reference-list',
                                componentParam: {beRefInfo: beRefList}
                            });
                        } else {
                            //2：删除确认
                            Utils.openModal({
                                title: "删除提示",
                                body: '<div style="text-align: center;margin:10px 0;">删除是不可逆的，是否确定删除该策略集？</div>',
                                action: {
                                    ok: function () {
                                        //3：删除
                                        $.postJSON("/platform/strategyset/delete", {controlNo: row.controlNo}, function (res) {
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
            }
        }
    });
});