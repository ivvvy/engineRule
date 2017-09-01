
define(["jquery", "vue", "ELEMENT", "Utils"],
    function ($, Vue, ELEMENT, Utils) {
        Vue.use(ELEMENT);
        new Vue({
            el: "#body",
            data:function(){
                return{
                    orgManage: [
                        {name: "设备", code: "test996", status: 1, email: "test996@suanhua.org", phone: "14712345678", contactName: "张三", shAdminName: "李四"},
                        {name: "机构1", code: "OG00000921", status: 1, email: "dexin.wang@suanhua.org", phone: "13816696470", contactName: "张三1", shAdminName: "王德鑫"},
                        {name: "设备", code: "test996", status: 0, email: "test996@suanhua.org", phone: "14712345678", contactName: "张三", shAdminName: "李四"},
                        {name: "机构1", code: "OG00000921", status: 1, email: "dexin.wang@suanhua.org", phone: "13816696470", contactName: "张三1", shAdminName: "王德鑫"},
                        {name: "设备", code: "test996", status: 0, email: "test996@suanhua.org", phone: "14712345678", contactName: "张三", shAdminName: "李四"},
                        {name: "机构1", code: "OG00000921", status: 1, email: "dexin.wang@suanhua.org", phone: "13816696470", contactName: "张三1", shAdminName: "王德鑫"},
                        {name: "设备", code: "test996", status: 1, email: "test996@suanhua.org", phone: "14712345678", contactName: "张三", shAdminName: "李四"},
                        {name: "机构1", code: "OG00000921", status: 0, email: "dexin.wang@suanhua.org", phone: "13816696470", contactName: "张三1", shAdminName: "王德鑫"},
                        {name: "设备", code: "test996", status: 1, email: "test996@suanhua.org", phone: "14712345678", contactName: "张三", shAdminName: "李四"},
                        {name: "测试626", code: "OG00000901", status: 1, email: "3041265209@qq.com", phone: "17751660124", contactName: "小王", shAdminName: "周晓鸣"}
                    ],
                    total: 33,
                    page: 1,
                    rows: 10,
                    currentPage: 1,
                    async_bg: true,
                    orgData: {
                        code: "",
                        name: "",
                        shAdminName: "",
                        status: ""
                    }
                }
            },
            mounted: function () {
                this.sysSearch();
            },
            methods: {
                sysSearch: function(){
                    console.log(111)
                },
                sizeChange: function(val){
                    this.rows = val;
                    this.sysSearch();
                },
                currentChange: function(val){
                    this.page = val;
                    this.sysSearch();
                },
                sysReset: function(){
                    this.page = 1;
                    this.rows = 10;
                    this.orgData.code = "";
                    this.orgData.name = "";
                    this.orgData.shAdminName = "";
                    this.orgData.status = "";
                    this.sysSearch();
                },
                orgStatus: function(sta){
                    if(sta == 1){
                        return "启用"
                    }else{
                        return "停用"
                    }
                },
                handleMouseEnter:function(row, column, cell, event){
                    $(cell).parents('tr').find('.showEditor').show();
                },
                handleMouseOut:function(row, column, cell, event){
                    $(cell).parents('tr').find('.showEditor').hide();
                    if($(cell).parents('tr').find('.orgOption').hasClass("icons")){
                        if($(cell).parents('tr').find('.orgOption').hasClass("icon-status-true")){
                            $(cell).parents('tr').find('.orgOption').text("启用");
                        }else{
                            $(cell).parents('tr').find('.orgOption').text("停用");
                        }
                    };
                    $(cell).parents('tr').find('.orgOption').removeClass("icons");
                    $(cell).parents('tr').find('.showSave').hide();
                    $(cell).parents('tr').find('.showDelete').hide();
                },
                startEdit:function(row,event){
                    var el = event.target;
                    $(el).hide();
                    $(el).siblings('.showSave').show();
                    $(el).siblings('.showDelete').show();
                    $(el).siblings(".orgOption").text("");
                    if(row.status == 1){
                        $(el).siblings(".orgOption").addClass("icons icon-status-true");
                    }else{
                        $(el).siblings(".orgOption").addClass("icons icon-status-false");
                    }
                },
                startSave: function(row,event){
                    console.log("点击保存");
                },
                startDelete: function(row,event){
                    console.log("点击删除");
                },
                changeStatus: function(row,event){
                    var el = event.target;
                    if($(el).hasClass("icons")){
                        if($(el).hasClass("icon-status-true")){
                            $(el).removeClass("icon-status-true").addClass("icon-status-false");
                        }else{
                            $(el).removeClass("icon-status-false").addClass("icon-status-true");
                        }
                    }
                },
                asyncAlert:function(){
                    console.log("弹出提示");
                },
                async_bgHide:function(){
                    console.log("关闭提示");
                },
                openModal: function () {
                    Utils.openModal({
                        title: "同步机构",
                        okText: "同步",
                        cancelText: "关闭",
                        width: 710,
                        //body: '<asyncAlert name="机构名称" code="机构编号" url="123123"></asyncAlert>',
                        currentView: "asyncAlert",
                        componentParam: {name:"机构名称", code:"机构编号", url:"123123"}
                     });
                }
            }
        });
});