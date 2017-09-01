/**
 * Created by han.wang on 2017/8/28.
 */

define(["jquery", "vue"],
    function ($, Vue) {
        new Vue({
            el: "#body",
            data:function(){
                return{
                    userOrgDetails: [
                        { name: "用户编号", val: "OU1503306052ICN"},
                        { name: "用户姓名", val: "麦麦西"},
                        { name: "所属机构名称", val: "算话征信服务（上海）有限公司"},
                        { name: "所属机构编号", val: "OG00000081"},
                        { name: "用户状态", val: "启用"},
                        { name: "用户email", val: "suanhua@suanhua.org"},
                        { name: "用户手机号", val: "15093329441"}
                    ],
                    selectedRole: [
                        {"name":"产品管理员","code":"R00000269","id":269},
                        {"name":"复核\u0026审核员","code":"R00000270","id":270},
                        {"name":"测试角色2","code":"R00000366","id":366},
                        {"name":"商务管理员","code":"R00000201","id":201}
                    ],
                    userOrgBasic: [
                        { name: "创建人", val: "麦麦西"},
                        { name: "创建时间", val: "2017-07-24"},
                        { name: "更新人", val: "算话"},
                        { name: "更新时间", val: "2018-08-12"}
                    ],
                    defaultProps: {
                        children: 'childrenList',
                        label: 'name'
                    }
                }
            },
            mounted: function () {
                this.getUserMessage();
            },
            methods: {
                getUserMessage: function(){
                    console.log(111)
                }
            }
        });
    });/**
 * Created by han.wang on 2017/8/24.
 */
