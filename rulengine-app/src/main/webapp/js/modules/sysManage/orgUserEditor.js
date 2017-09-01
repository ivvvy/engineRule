/**
 * Created by han.wang on 2017/8/25.
 */

define(["jquery", "vue"],
    function ($, Vue) {
        new Vue({
            el: "#body",
            data:function(){
                return{
                    userOrg: [
                        { name: "用户编号", val: "OU1503306052ICN"},
                        { name: "用户姓名", val: "麦麦西"},
                        { name: "所属机构名称", val: "算话征信服务（上海）有限公司"},
                        { name: "所属机构编号", val: "OG00000081"}
                    ],
                    emailPhone: [
                        { name: "用户email", val: "suanhua@suanhua.org"},
                        { name: "用户手机号", val: "15093329441"}
                    ],
                    userStatusEditor: [
                        { id: "enable", val: "1", text: "启用"},
                        { id: "unEnable", val: "0", text: "停用"},
                        { id: "freeze", val: "2", text: "冻结"}
                    ],
                    selectedRole: [],
                    roleList: [
                        {"name":"产品管理员","code":"R00000269","id":269},
                        {"name":"复核\u0026审核员","code":"R00000270","id":270},
                        {"name":"反欺诈-管理员","code":"R00000321","id":321},
                        {"name":"反欺诈-产品管理员","code":"R00000322","id":322},
                        {"name":"test111111","code":"R00000361","id":361},
                        {"name":"新建新建tast","code":"R00000362","id":362},
                        {"name":"管理","code":"R00000363","id":363},
                        {"name":"test11","code":"R00000364","id":364},
                        {"name":"测试角色2","code":"R00000366","id":366},
                        {"name":"商务管理员","code":"R00000201","id":201}
                    ]
                }
            },
            mounted: function () {
                this.userSearch();
            },
            methods: {
                userSearch: function(){
                    console.log(111)
                },
                clickRadio: function(event){
                    var el = event.target;
                    console.log($(el));
                    if($(el).siblings("label").hasClass("icon-radio-false")){
                        $(el).siblings("label").removeClass("icon-radio-false").addClass("icon-radio-true");
                    }else{
                        $(el).siblings("label").removeClass("icon-radio-true").addClass("icon-radio-false");
                    }
                },
                chooseRole: function(code, name, event){
                    var el = event.target;
                    var obj = {};
                    obj.code = code;
                    obj.name = name;
                    if($(el).hasClass("checked") == false){
                        this.selectedRole.push(obj);
                        $(el).addClass("checked");
                    }
                },
                deleteChoose: function(index,code){
                    this.selectedRole.splice(index,1);
                    $(".roleList div").each(function(){
                        var spliceCode = $(this).attr("code");
                        if(spliceCode == code){
                            $(this).removeClass("checked");
                        }
                    })
                }
            }
        });
    });/**
 * Created by han.wang on 2017/8/24.
 */
