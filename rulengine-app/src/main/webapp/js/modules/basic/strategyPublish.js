/**
 * Created by han.wang on 2017/8/29.
 */

define(["jquery", "vue", "ELEMENT", "Utils"],
    function ($, Vue, ELEMENT, Utils) {
        Vue.use(ELEMENT);
        new Vue({
            el: "#body",
            data:function(){
                return{
                    strategyManage: [
                        {"testMan":"测试0","code":"v1.23.345","testTime":"2017-08-18 08:00:00","publishTime":"2017-12-31 08:00:00","status":3,"publishMan":"周晓鸣1","id":102},
                        {"testMan":"小明1","code":"v1.23.145","testTime":"2017-08-17 08:00:00","publishTime":"2017-12-31 08:00:00","status":0,"publishMan":"周晓鸣2","id":101},
                        {"testMan":"机构0","code":"v1.23.245","testTime":"2017-08-11 08:00:00","publishTime":"2019-08-11 08:00:00","status":1,"publishMan":"周晓鸣3","id":981},
                        {"testMan":"测试4","code":"v1.23.155","testTime":"2017-08-01 08:00:00","publishTime":"2017-08-31 08:00:00","status":1,"publishMan":"阮燕飞4","id":963},
                        {"testMan":"测试3","code":"v1.23.398","testTime":"2017-08-01 08:00:00","publishTime":"2017-08-31 08:00:00","status":0,"publishMan":"阮燕飞5","id":962},
                        {"testMan":"测试2","code":"v1.23.345","testTime":"2017-08-01 08:00:00","publishTime":"2017-08-31 08:00:00","status":1,"publishMan":"阮燕飞6","id":961},
                        {"testMan":"测试1","code":"v1.23.145","testTime":"2017-08-01 08:00:00","publishTime":"2017-08-31 08:00:00","status":0,"publishMan":"阮燕飞7","id":941},
                        {"testMan":"测试5","code":"v1.23.365","testTime":"2017-07-01 08:00:00","publishTime":"2017-07-31 08:00:00","status":1,"publishMan":"王德鑫8","id":923},
                        {"testMan":"机构6","code":"v1.23.123","testTime":"2017-07-01 08:00:00","publishTime":"2017-07-31 08:00:00","status":0,"publishMan":"王德鑫9","id":922},
                        {"testMan":"机构7","code":"v1.23.145","testTime":"2017-07-01 08:00:00","publishTime":"2017-07-31 08:00:00","status":1,"publishMan":"王德鑫0","id":921}
                    ],
                    total: 33,
                    page: 1,
                    rows: 10,
                    currentPage: 1
                }
            },
            mounted: function () {
                this.userSearch();
            },
            methods: {
                userSearch: function(){
                    console.log(111)
                },
                sizeChange: function(val){
                    this.rows = val;
                    this.userSearch();
                },
                currentChange: function(val){
                    this.page = val;
                    this.userSearch();
                },
                handleMouseEnter:function(row, column, cell){
                    $(cell).parents('tr').find('.needShow').show();
                },
                handleMouseOut:function(row, column, cell){
                    $(cell).parents('tr').find('.needShow').hide();
                },
                strategyDelete:function(){
                    Utils.openModal({
                        title: "删除提示",
                        okText: "确定",
                        cancelText: "取消",
                        width: 500,
                        body: '<p>删除是不可逆的，确定要删除该策略么？</p>'
                    });
                },
                openModal1: function(){
                    var _this = this;
                    this.openModal('版本测试', '测试', '111', function(){
                        Utils.openModal({
                            title: "版本测试入参",
                            okText: "下载",
                            cancelText: "测试成功",
                            thirdButtonText: "继续测试",
                            width: 900,
                            action: {
                                ok: function(){
                                    console.log("下载");
                                },
                                thirdOperation: function(){
                                    _this.openModal1();
                                }
                            },
                            currentView: "versionTestEntry",
                            componentParam: {"code": "123"}
                        });
                    })
                },
                openModal2: function(){
                    this.openModal('策略发布','发布','111', function(){
                        console.log("点击了发布");
                    })
                },
                openModal: function (title, okTest, url, fun) {
                    //获取数据判断状态是否全部为成功
                    var allStatus = true;
                    var getTestData = [
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072602", "name":"申请线上贷款数趋势2", "describe":"3个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":2, "code":"CS2017072603", "name":"申请线上贷款数趋势3", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":2, "code":"CS2017072604", "name":"申请线上贷款数趋势4", "describe":"3个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072605", "name":"申请线上贷款数趋势5", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072606", "name":"申请线上贷款数趋势6", "describe":"3个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":2, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"3个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":2, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"},
                        {"classify":1, "code":"CS2017072601", "name":"申请线上贷款数趋势1", "describe":"1个月内线上详情", "status":1, "version":"v1.23.345"}
                    ];
                    getTestData.forEach(function(ele){
                        if(ele.status == 2){
                            allStatus = false;
                            return;
                        };
                    })
                    if(title == "版本详情"){
                        allStatus = true;
                    }
                    if(allStatus == true){
                        Utils.openModal({
                            title: title,
                            okText: okTest,
                            cancelText: "取消",
                            width: 900,
                            action: {
                                ok: fun
                            },
                            currentView: "versionTest",
                            componentParam: {status: allStatus, data: getTestData}
                        });
                    }else{
                        Utils.openModal({
                            title: title,
                            okText: "返回",
                            cancelText: "",
                            width: 900,
                            currentView: "versionTest",
                            componentParam: {status: allStatus, data: getTestData}
                        });
                    }
                }
            }
        });
    });

