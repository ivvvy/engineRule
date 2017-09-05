/**
 * Created by xinyu.cai on 2017/8/31.
 */
define(['jquery', 'vue', 'Utils'], function ($, Vue, Utils) {
    new Vue({
        el: "#body",
        data: {
            line:{},
            right:{},
            left:{},
            operates:Utils.Const.ResultOperators,
            show:false,
            condition:{},
            data:{},
            varCondition: [[{name:'请选择变量',type:"vars"}],[{name:'请输入条件',type:"condition"}]],
            result: [[{name:'请选择变量',type:"vars"}],[{name:'请输入结果',type:"result"}]],



        },
        mounted: function () {

        },
        methods: {
            addCondition:function () {
                var rows = [{name:'请选择变量',type:"vars"},{name:'请输入条件',type:"condition"}];
                for (var i = 0; i < this.varCondition.length; i++) {
                    this.varCondition[i].push(rows[i]);
                }
            },
            addResult:function () {
                var rows = [{name:'请选择变量',type:"vars"},{name:'请输入结果',type:"result"}];
                for (var i = 0; i < this.result.length; i++) {
                    this.result[i].push(rows[i]);

                }
            },
            estimate:function(){
                var _self = this;
                var el=event.target.value;
                console.log("xxxx"+el);
                if(el!=='请输入条件'){
                    for(var i=0;i<this.varCondition.length-1;i++){
                        var conditions=this.varCondition[i];
                        for(var j=0;j<conditions.length;j++){
                            console.log("sssss："+conditions[j].name);
                            //if(conditions[j].name=="请选择变量"){
                                this.condition=conditions[j];
                            //}

                        }
                    }
                    Utils.openModal({
                        title: "选择变量",
                        width: 600,
                        currentView: "variateSearch",
                        componentParam: this.condition,
                        action: {
                            ok: function (item) {
                                item = item || {temp: {}};
                                Vue.set(_self.condition, 'name', item.temp.variate.name);
                                Vue.set(_self.condition, 'paramType', item.temp.variate.paramType);
                                delete item.temp;
                            },
                            cancel: function (item) {
                                item = item || {temp: {}};
                                delete item.temp;
                            }
                        }
                    });
                }else{
                    this.show=true;
                    if(this.show==true){
                        this.operates=Utils.Const.ConstraintOperators;
                        if (!this.line.operator) Vue.set(this.line, "operator", "");
                        if (!!this.line && !this.line.left) Vue.set(this.line, "left", {});
                        if (!!this.line && !this.line.right) Vue.set(this.line, "right", {});

                    }

                }
            },
            changeOperator: function () {
                if (this.line.operator.indexOf("null") >= 0) Vue.set(this.line, "right", {});
                else Vue.set(this.line, "right", {type: "const"});

            },
            getRightPart: function () {
                Utils.openModal({body: JSON.stringify(this.line)});
                this.show=false;
            },
        }
    })
});