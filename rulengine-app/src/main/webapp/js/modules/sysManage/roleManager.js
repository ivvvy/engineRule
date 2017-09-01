/**
 * Created by han.wang on 2017/8/28.
 */

define(["jquery", "vue", "ELEMENT", "Utils"],
    function ($, Vue, ELEMENT, Utils) {
        Vue.use(ELEMENT);
        new Vue({
            el: "#body",
            data:function(){
                return{
                    roleManage: [
                        {"name":"测试角色","code":"R00000168","status":1,"explain":"就是想  测试啊","id":168},
                        {"name":"财务管理员12","code":"R00000341","status":0,"explain":"sasasssswds","id":341},
                        {"name":"测角色描述","code":"R00000381","status":1,"explain":"啊啊\n\n啊啊、、\n\n啊啊","id":381},
                        {"name":"qqz测试角色","code":"R00000421","status":1,"explain":"创建产品、维护产品","id":421},
                        {"name":"testbug","code":"R00000441","status":1,"explain":"test123","id":441},
                        {"name":"财务管理员","code":"R00000225","status":1,"explain":"复核充   值申请","id":225},
                        {"name":"机构管理——创建","code":"R00000241","status":1,"explain":"创建机构","id":241},
                        {"name":"测试角色1","code":"R00000367","status":1,"explain":"管理反欺诈的产品","id":367},
                        {"name":"test123123123123","code":"R00000402","status":1,"explain":"123123123","id":402},
                        {"name":"设备指纹","code":"R00000521","status":1,"explain":"审核机构和产品待处理,审核充值、充值金额调整审核","id":521}
                    ],
                    total: 33,
                    page: 1,
                    rows: 10,
                    currentPage: 1,
                    roleData: {
                        code: "",
                        email: "",
                        explain: "",
                        status: ""
                    }
                }
            },
            mounted: function () {
                this.roleSearch();
            },
            methods: {
                roleSearch: function(){
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
                roleReset: function(){
                    this.page = 1;
                    this.rows = 10;
                    this.orgData.code = "";
                    this.orgData.name = "";
                    this.orgData.explain = "";
                    this.orgData.status = "";
                    this.roleSearch();
                },
                roleStatus: function(row){
                    if(row.status == 1){
                        return "启用"
                    }else{
                        return "停用"
                    }
                },
                handleMouseEnter1:function(row, column, cell, event){
                    $(cell).parents('tr').find('.text').hide();
                    $(cell).parents('tr').find('.needShow').show();
                },
                handleMouseOut1:function(row, column, cell, event){
                    $(cell).parents('tr').find('.text').show();
                    $(cell).parents('tr').find('.needShow').hide();
                },
                roleDelete:function(row){
                    Utils.openModal({
                        title: "删除提示",
                        okText: "确定",
                        cancelText: "取消",
                        width: 500,
                        body: '<p>删除是不可逆的，确定要删除该角色么？</p>'
                    });
                }
            }
        });
    });/**
 * Created by han.wang on 2017/8/24.
 */
