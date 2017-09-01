/**
 * Created by han.wang on 2017/8/28.
 */

define(["jquery", "vue", "ELEMENT"],
    function ($, Vue, ELEMENT) {
        Vue.use(ELEMENT);
        new Vue({
            el: "#body",
            data:function(){
                return{
                    roleData: {
                        name: "",
                        email: "",
                        explain: "",
                        status: "1"
                    },
                    roleTree: [{
                        id: 1,
                        name: '全部',
                        childrenList: [
                            {
                                "id":"241",
                                "code":"pm",
                                "name":"计费管理",
                                "parentId":"null",
                                "childrenList":[
                                    {
                                        "id":"353",
                                        "code":"pm_353",
                                        "name":"账单管理",
                                        "parentId":"241",
                                        "childrenList":[
                                            {
                                                "id":"361",
                                                "code":"pm_353_361",
                                                "name":"账单查询初始页面",
                                                "parentId":"353", "childrenList":null
                                            },{
                                                "id":"362",
                                                "code":"pm_353_362",
                                                "name":"机构账单列表",
                                                "parentId":"353", "childrenList":null
                                            },{
                                                "id":"363",
                                                "code":"pm_353_363",
                                                "name":"下载机构月账单文件",
                                                "parentId":"353", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"242",
                                        "code":"pm_242",
                                        "name":"充值管理",
                                        "parentId":"241",
                                        "childrenList":[
                                            {
                                                "id":"243",
                                                "code":"pm_242_243",
                                                "name":"充值管理列表条件查询",
                                                "parentId":"242", "childrenList":null
                                            },{
                                                "id":"244",
                                                "code":"pm_242_244",
                                                "name":"操作员充值——立即生效",
                                                "parentId":"242", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"372",
                                        "code":"pm_372",
                                        "name":"资金划拨",
                                        "parentId":"241",
                                        "childrenList":[
                                            {
                                                "id":"402",
                                                "code":"pm_372_402",
                                                "name":"资金划拨撤销",
                                                "parentId":"372", "childrenList":null
                                            },{
                                                "id":"373",
                                                "code":"pm_372_373",
                                                "name":"资金划拨",
                                                "parentId":"372", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"285",
                                        "code":"pm_285",
                                        "name":"充值金额调整",
                                        "parentId":"241",
                                        "childrenList":[
                                            {
                                                "id":"286",
                                                "code":"pm_285_286",
                                                "name":"调整充值金额",
                                                "parentId":"285", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"321",
                                        "code":"pm_242_321",
                                        "name":"费用查询",
                                        "parentId":"241",
                                        "childrenList":[
                                            {
                                                "id":"403",
                                                "code":"pm_242_321_403",
                                                "name":"查询是否存在费用明细",
                                                "parentId":"321", "childrenList":null
                                            },{
                                                "id":"322",
                                                "code":"pm_242_321_322",
                                                "name":"查询",
                                                "parentId":"321", "childrenList":null
                                            },{
                                                "id":"323",
                                                "code":"pm_242_321_323",
                                                "name":"下载费用明细",
                                                "parentId":"321", "childrenList":null
                                            }
                                        ]
                                    }
                                ]
                            },{
                                "id":"521",
                                "code":"frd",
                                "name":"反欺诈",
                                "parentId":"null",
                                "childrenList":[
                                    {
                                        "id":"522",
                                        "code":"frd_522",
                                        "name":"反欺诈超级管理员",
                                        "parentId":"521", "childrenList":null
                                    },{
                                        "id":"523",
                                        "code":"frd_523",
                                        "name":"反欺诈产品操作员",
                                        "parentId":"521", "childrenList":null
                                    },{
                                        "id":"581",
                                        "code":"frd_581",
                                        "name":"机构产品管理",
                                        "parentId":"521",
                                        "childrenList":[
                                            {
                                                "id":"601",
                                                "code":"frd_581_601",
                                                "name":"批量新增机构产品",
                                                "parentId":"581","childrenList":null
                                            },{
                                                "id":"602",
                                                "code":"frd_581_602",
                                                "name":"下载批量新建产品反馈文件",
                                                "parentId":"581", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"582",
                                        "code":"frd_582",
                                        "name":"反欺诈重算",
                                        "parentId":"521",
                                        "childrenList":[
                                            {
                                                "id":"607",
                                                "code":"frd_582_607",
                                                "name":"删除数据",
                                                "parentId":"582", "childrenList":null
                                            },{
                                                "id":"608",
                                                "code":"frd_582_608",
                                                "name":"列表查询",
                                                "parentId":"582", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"583",
                                        "code":"frd_583",
                                        "name":"流转机构管理",
                                        "parentId":"521",
                                        "childrenList":[
                                            {
                                                "id":"641",
                                                "code":"frd_583_641",
                                                "name":"查询列表",
                                                "parentId":"583", "childrenList":null
                                            },{
                                                "id":"642",
                                                "code":"frd_583_642",
                                                "name":"保存",
                                                "parentId":"583", "childrenList":null
                                            }
                                        ]
                                    }
                                ]
                            },{
                                "id":"6",
                                "code":"sys",
                                "name":"系统管理",
                                "parentId":"null",
                                "childrenList":[
                                    {
                                        "id":"90",
                                        "code":"sys_90",
                                        "name":"资源管理",
                                        "parentId":"6",
                                        "childrenList":[
                                            {
                                                "id":"91",
                                                "code":"sys_90_91",
                                                "name":"查询",
                                                "parentId":"90", "childrenList":null
                                            },{
                                                "id":"92",
                                                "code":"sys_90_92",
                                                "name":"详情",
                                                "parentId":"90","childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"95",
                                        "code":"sys_95",
                                        "name":"角色管理",
                                        "parentId":"6",
                                        "childrenList":[
                                            {
                                                "id":"96",
                                                "code":"sys_95_96",
                                                "name":"查看角色列表",
                                                "parentId":"95", "childrenList":null
                                            },{
                                                "id":"97",
                                                "code":"sys_95_97",
                                                "name":"角色详情",
                                                "parentId":"95", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"182",
                                        "code":"sys_182",
                                        "name":"邮件配置管理",
                                        "parentId":"6",
                                        "childrenList":[
                                            {
                                                "id":"222",
                                                "code":"sys_182_222",
                                                "name":"查看",
                                                "parentId":"182", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"81",
                                        "code":"sys_81",
                                        "name":"部门管理",
                                        "parentId":"6",
                                        "childrenList":[
                                            {
                                                "id":"82",
                                                "code":"sys_81_82",
                                                "name":"查看部门列表",
                                                "parentId":"81", "childrenList":null
                                            },{
                                                "id":"83",
                                                "code":"sys_81_83",
                                                "name":"部门详情",
                                                "parentId":"81", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"86",
                                        "code":"sys_86",
                                        "name":"参数管理",
                                        "parentId":"6",
                                        "childrenList":[
                                            {
                                                "id":"88",
                                                "code":"sys_86_88",
                                                "name":"新增/更新",
                                                "parentId":"86", "childrenList":null
                                            },{
                                                "id":"89",
                                                "code":"sys_86_89",
                                                "name":"刪除参数",
                                                "parentId":"86", "childrenList":null
                                            }
                                        ]
                                    }
                                ]
                            },{
                                "id":"662",
                                "code":"dy",
                                "name":"设备指纹",
                                "parentId":"null",
                                "childrenList":[
                                    {
                                        "id":"701",
                                        "code":"dy_701",
                                        "name":"服务配置",
                                        "parentId":"662",
                                        "childrenList":[
                                            {
                                                "id":"702",
                                                "code":"dy_701_702",
                                                "name":"审核服务配置信息",
                                                "parentId":"701","childrenList":null
                                            },{
                                                "id":"703",
                                                "code":"dy_701_703",
                                                "name":"服务配置流程详细信息",
                                                "parentId":"701", "childrenList":null
                                            }
                                        ]
                                    },{
                                        "id":"681",
                                        "code":"dy_681",
                                        "name":"SDK清单",
                                        "parentId":"662",
                                        "childrenList":[
                                            {
                                                "id":"682",
                                                "code":"dy_681_682",
                                                "name":"审核SDK清单信息",
                                                "parentId":"681", "childrenList":null
                                            },{
                                                "id":"683",
                                                "code":"dy_681_683",
                                                "name":"SDK流程详细信息",
                                                "parentId":"681","childrenList":null
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }],
                    defaultProps: {
                        children: 'childrenList',
                        label: 'name'
                    }
                }
            },
            mounted: function () {
                this.userSearch();
            },
            methods: {
                userSearch: function(){
                    console.log(111);
                },
                clickCheckbox: function(){
                    if(this.roleData.status == "1"){
                        this.roleData.status == "0";
                    }else{
                        this.roleData.status == "1";
                    }
                }
            }
        });
    });/**
 * Created by han.wang on 2017/8/24.
 */
