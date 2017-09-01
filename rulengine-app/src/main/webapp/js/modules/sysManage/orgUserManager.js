
define(["jquery", "vue", "ELEMENT", "Utils"],
    function ($, Vue, ELEMENT, Utils) {
        Vue.use(ELEMENT);
        new Vue({
            el: "#body",
            data:function(){
                return{
                    orgUserManage: [
                        {"name":"周晓鸣","code":"OU1503306052ICN","role":"机构管理员","orgCode":"OG00001002","orgName":"我要测试机构","email":"xiaoming.zhou@suanhua.org","phone":"17751660124","status":1,"id":52262},
                        {"name":"周晓鸣","code":"OU1503305700bDa","role":"机构管理员","orgCode":"OG00001002","orgName":"我要测试机构","email":"douxianren123@qq.com","phone":"17751660124","status":0,"id":52261},
                        {"name":"周晓鸣","code":"OU1503305519qed","role":"机构管理员","orgCode":"OG00001002","orgName":"我要测试机构","email":"542753294@qq.com","phone":"17717863450","status":0,"id":52260},
                        {"name":"周晓鸣","code":"OU1503047422DQn","role":"机构管理员","orgCode":"OG00001002","orgName":"我要测试机构","email":"3041265209@qq.com","phone":"17751660124","status":1,"id":52242},
                        {"name":"小明","code":"OU1503025211FpY","role":"机构管理员","orgCode":"OG00001001","orgName":"小明","email":"30412652091@qq.com","phone":"17751660124","status":0,"id":52241},
                        {"name":"小明","code":"OU1503024455hsW","role":"机构管理员","orgCode":"OG00001001","orgName":"小明","email":"3041265209@qq.com","phone":"17751660124","status":0,"id":52240},
                        {"name":"周周周","code":"OU1502443432eoe","role":"机构管理员","orgCode":"OG00000981","orgName":"周周周机构","email":"542753294@qq.com","phone":"17751660124","status":0,"id":52220},
                        {"name":"jacka","code":"OU1501745339Xuq","role":"机构管理员","orgCode":"OG00000963","orgName":"流转机构测试4","email":"442011935@qq.com","phone":"18501799721","status":1,"id":52201},
                        {"name":"jack","code":"OU1501745140N3r","role":"机构管理员","orgCode":"OG00000963","orgName":"流转机构测试4","email":"18501799721@126.com","phone":"15026554721","status":1,"id":52200},
                        {"name":"janet","code":"OU1501661932qex","role":"机构管理员","orgCode":"OG00000961","orgName":"流传机构测试2","email":"18501799721@163.com","phone":"18501799721","status":1,"id":52202}
                    ],
                    total: 33,
                    page: 1,
                    rows: 10,
                    currentPage: 1,
                    async_bg: true,
                    userData: {
                        code: "",
                        email: "",
                        role: "",
                        status: ""
                    }
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
                userReset: function(){
                    this.page = 1;
                    this.rows = 10;
                    this.orgData.code = "";
                    this.orgData.name = "";
                    this.orgData.shAdminName = "";
                    this.orgData.status = "";
                    this.userSearch();
                },
                userStatus: function(row){
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
                userDelete:function(row){
                    Utils.openModal({
                        title: "删除提示",
                        okText: "确定",
                        cancelText: "取消",
                        width: 500,
                        body: '<p>删除是不可逆的，确定要删除该用户么？</p>'
                    });
                },
                asyncAlert:function(){
                    console.log("弹出提示");
                },
                async_bgHide:function(){
                    console.log("关闭提示");
                },
                openModal: function () {
                    Utils.openModal({
                        title: "同步用户",
                        okText: "同步",
                        cancelText: "关闭",
                        width: 710,
                        currentView: "asyncAlert",
                        componentParam: {name:"用户姓名", code:"用户Email", url:"123123"}
                    });
                }
            }
        });
    });/**
 * Created by han.wang on 2017/8/24.
 */
