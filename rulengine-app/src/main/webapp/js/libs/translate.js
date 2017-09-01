/**
 * Created by ZhaiFenfang on 2017/8/7.
 * 包含所有引擎组件以及决策流从json翻译成drools语法的功能
 */

(function () {
    var Translate = function () {
    };

    Translate.defaults = {
        basePackage: "org.suanhua.antifraud.rules",                 //drl base package
        imports: ["java.util.HashMap"],                             //import package name list
        attributes: [{name: "dialect", value: "\"mvel\""}],         //default rule attributes
        bindVar: "app",                                             //bind to input Class
        dataType: "HashMap",                                        //input Class name
        innerDataType: "HashMap",                                   //class type of inner model
        theme: "ace/theme/chrome",                                  //theme of sourceCode display
        readonly: true,                                             //set sourceCode is readonly
        mode: "ace/mode/drools",                                    //mode of sourceCode
        usingVarGroup: true,                                        //is drools server pass data with group
        varGroups: {
            INPUT: {tempName: "input", columnKey: "\"INPUT\""},
            OUTPUT: {tempName: "output", columnKey: "\"OUTPUT\""},
            TEMP: {tempName: "temp", columnKey: "\"TEMP\""}
        }
    };

    Translate.prototype.options = {};
    Translate.prototype.isTranslateWhen = false;
    Translate.prototype.refVarList = [];       //ref params of drools component
    Translate.prototype.refFNList = [];        //ref functions of drools component

    /**
     * set options of Translate instance
     * @param opt
     */
    Translate.prototype.setOptions = function (opt) {
        opt = opt || {};
        for (var key in Translate.defaults) this.options[key] = Translate.defaults[key];
        for (var key in opt) this.options[key] = opt[key];
    };

    /**
     * init ace setting
     * @param sourceAreaID
     * @param options
     */
    Translate.prototype.init = function (sourceAreaID, options) {
        this.editor = ace.edit(sourceAreaID);
        this.doc = this.editor.getSession().getDocument();
        this.setOptions(options);
        this.editor.setTheme(this.options.theme);
        this.editor.getSession().setMode(this.options.mode);
        this.editor.setReadOnly(this.options.readonly);

        this.refVarList = [];
        this.refFNList = [];
    };

    /**
     * get refer params of component
     * @returns {Array}
     */
    Translate.prototype.getReferVarList = function () {
        return this.refVarList;
    };

    /**
     * get refer functions of component
     * @returns {Array}
     */
    Translate.prototype.getReferFNList = function () {
        return this.refFNList;
    };

    /**
     * ace insert empty line
     */
    Translate.prototype.insertWhiteLine = function () {
        var doc = this.doc;
        doc.insertMergedLines({row: doc.getLength(), column: 0}, ["", ""]);
    };

    /**
     * ace insert new line with text
     * @param text
     */
    Translate.prototype.insertNextLine = function (text) {
        var doc = this.doc;
        doc.insertInLine({row: doc.getLength(), column: 0}, text);
        doc.insertMergedLines({row: doc.getLength(), column: 0}, ["", ""]);
    };

    /**
     * ace insert new block of text
     * @param text
     */
    Translate.prototype.insertBlock = function (text) {
        var doc = this.doc;
        doc.insert({row: doc.getLength(), column: 0}, text);
        doc.insertMergedLines({row: doc.getLength(), column: 0}, ["", ""]);
    };

    /**
     * translate param part of rule
     * @param param
     * {"name":"", "paramType":"INPUT|OUTPUT|TEMP","versions":"版本号","varNum"}
     * @returns {string}
     */
    Translate.prototype.translateParam = function (param) {
        param = param || {"name": "", "paramType": "", "versions": "", "varNum": ""};
        var bindVar = Translate.defaults.bindVar;
        if (this.options.usingVarGroup) {
            //if (this.isTranslateWhen)
            //    bindVar = bindVar + "[" + this.options.varGroups[param.paramType].columnKey + "]";
            //else
            bindVar = this.options.varGroups[param.paramType].tempName;
        }
        if (!!param.name)
            this.refVarList.push({
                controlNo: param.varNum || "",
                versions: param.versions || "",
                typeName: "VAR",
                elementName: param.name
            });
        return bindVar + "." + param.name;
    };

    /**
     * insert temp var define
     * HashMap input = app.INPUT;
     * HashMap output = app.OUTPUT;
     * HashMap temp = app.TEMP;
     */
    Translate.prototype.translateVarDefine = function () {
        var lines = [];
        var dataType = this.options.innerDataType || this.options.dataType;
        for (var key in this.options.varGroups) {
            lines.push(dataType + " " + this.options.varGroups[key].tempName + " = " + this.options.bindVar + "." + key + ";");
        }
        return lines;
    };

    /**
     * translate when part of rule
     * @param when
     * {"dataType": "", "constraint": %constraint%}
     * @returns {string[]}
     */
    Translate.prototype.translateWhen = function (when) {
        when = when || [];
        this.isTranslateWhen = true;
        var lines = [], bindVar = this.options.bindVar, dataType = this.options.dataType;
        if (when.length == 0) {
            this.isTranslateWhen = false;
            return [bindVar + " : " + dataType + "()"];
        }
        for (var i = 0; i < when.length; i++) {
            var current = when[i], constraint = current.constraint || [];
            var constraintList = [];
            for (var j = 0; j < constraint.length; j++) {
                constraintList.push(this.translateConstraint(constraint[j]));
            }
            lines.push(bindVar + " : " + dataType + "(" + constraintList.join(",") + ")");
        }
        this.isTranslateWhen = false;
        return lines;
    };

    /**
     * translate right part of condition or result
     * type contains var|const|fn
     * @param right
     * {"type": "const", "value": ""}
     * {"type": "var", "name": "varName", "paramType": "INPUT|OUTPUT|TEMP"}
     * {"type": "fn", "name": "fnName", "parameters":[%right%],"versions":"版本号","fnNum":"函数编号"}
     * @returns {string}
     */
    Translate.prototype.translateLineRight = function (right) {
        right = right || {};
        var result = "";
        switch (right.type) {
            case "const":
                result += (right.value || "");
                break;
            case "var":
                result += this.translateParam(right);
                break;
            case "fn":
                result += right.name + "( ";
                var params = [];
                for (var i = 0; i < (right.parameters || []).length; i++) {
                    var para = right.parameters[i];
                    params.push(this.translateLineRight(para));
                }
                result += params.join(" , ") + " )";
                this.refFNList.push({
                    controlNo: right.fnNum || "",
                    versions: right.versions || "",
                    typeName: "FN",
                    elementName: right.name
                });
                break;
        }

        return result;
    };

    /**
     * translate line of condition or result
     * @param line
     * {"left": {"name": "varName", "paramType":"INPUT|OUTPUT|TEMP"}, "operator": "", "right": %right%}
     * @returns {string}
     */
    Translate.prototype.translateLine = function (line) {
        var result = "";
        if (!line.operator) return result;
        var left = line.left || {};
        var param = this.translateParam(left);
        if (["+=", "-="].indexOf(line.operator) >= 0) {
            result = param + " = " + param + " " + line.operator.substr(0, 1) + " " + this.translateLineRight(line.right);
        }
        else result = param + " " + (line.operator || "=") + " " + this.translateLineRight(line.right);
        return result;
    };

    /**
     * translate nested conditions
     * @param constraint
     * [{"type": "", "left": {"name":"varName","paramType":"INPUT|OUTPUT|TEMP"}, "operator": "", "right":%right%}]
     * [{"type": "&& | ||", "fields": %constraint%}]
     * @returns {string}
     */
    Translate.prototype.translateConstraint = function (constraint) {
        constraint = constraint || [];
        var cons = [];
        for (var i = 0; i < constraint.length; i++) {
            var current = constraint[i];
            if (!current.fields || current.fields.length == 0) { //不存在嵌套条件
                cons.push((current.type || "") + " (" + this.translateLine(current) + ")");
            } else cons.push((current.type || "") + " ((" + this.translateLine(current) + ") " + this.translateConstraint(current.fields) + ")");
        }

        return cons.join(" ");
    };

    /**
     * translate threshold of one line, contact with &&
     * @param item
     * {"name":"","paramType":"","leftLine":{"comparator":"","right":%right%},"rightLine":{"comparator":"","right":%right%}}
     * @returns {string}
     */
    Translate.prototype.translateThresholdItem = function (item) {
        item = item || {};
        var varName = this.translateParam(item);

        var allCons = [];
        if (!!item.leftLine && !!item.leftLine.comparator) {
            allCons.push("(" + varName + " " + item.leftLine.comparator + " " + this.translateLineRight(item.leftLine.right) + ")");
        }
        if (!!item.rightLine && !!item.rightLine.comparator) {
            allCons.push("(" + varName + " " + item.rightLine.comparator + " " + this.translateLineRight(item.rightLine.right) + ")");
        }

        return allCons.join(" && ");
    };

    /**
     * translate common part of plugin
     * @param plugin
     * {"name":"", "attributes":[], "when":[]}
     */
    Translate.prototype.insertCommonPartOfPlugin = function (plugin) {
        /** insert attributes **/
        this.insertNextLine('rule "' + (plugin.name || "") + '"');
        var attributes = (plugin.attributes || []).concat(this.options.attributes);
        for (var j = 0; j < attributes.length; j++) {
            var attr = attributes[j];
            this.insertNextLine("\t" + attr.name + " " + attr.value);
        }

        /** insert when **/
        this.insertNextLine("when");
        var lines = this.translateWhen(plugin.when);
        for (var i = 0; i < lines.length; i++) {
            this.insertNextLine("\t" + lines[i]);
        }

        /** insert then **/
        this.insertNextLine("then");

        /** insert tempVar define **/
        if (this.options.usingVarGroup) {
            lines = this.translateVarDefine();
            for (var i = 0; i < lines.length; i++) {
                this.insertNextLine("\t" + lines[i]);
            }
            this.insertWhiteLine();
        }
    };

    /**
     * 函数组件
     * @param sourceAreaID
     * @param options
     * @constructor
     */
    var FN = function (sourceAreaID, options) {
        this.name = "fn";
        this.init(sourceAreaID, options);
    };

    FN.prototype = new Translate();
    FN.prototype.constructor = FN;

    /**
     * 函数翻译
     * @param jsonData
     */
    FN.prototype.translate = function (jsonData) {
        this.editor.setValue("");
        try {
            var fnData = jsonData || "{}";
            if (typeof fnData == "string") fnData = JSON.parse(fnData);
            this.options.originData = fnData;

            /** insert desc **/
            this.insertNextLine("/**");
            this.insertNextLine(" * " + (fnData.desc || fnData.name || "添加函数描述"));

            /**parameters of function**/
            var inputParams = [];
            if (!!fnData.parameters) {
                for (var i in fnData.parameters) {
                    var pm = fnData.parameters[i];
                    this.insertNextLine(" * @param " + pm.name + " " + pm.type);
                    inputParams.push(pm.type + " " + pm.name);
                }
            }

            /**returnType of function**/
            if (!!fnData.returnType)
                this.insertNextLine(" * @return " + fnData.returnType);
            this.insertNextLine(" */");

            /**function body**/
            this.insertNextLine("function " + fnData.returnType + " " + fnData.name + "(" + inputParams.join(", ") + ") {")
            var bodyLines = fnData.body.split("\n");
            for (var i in bodyLines)
                this.insertNextLine("\t" + bodyLines[i]);
            this.insertNextLine("}");
        } catch (e) {
            console.error(e);
            this.editor.setValue("函数翻译错误,请检查相关设置");
        }

        return this.editor.getValue();
    };

    /**
     * 规则组件
     * @param sourceAreaID 源代码展示容器的ID
     * @param options
     * @constructor
     */
    var Rule = function (sourceAreaID, options) {
        this.name = "rule";
        this.init(sourceAreaID, options);
    };

    Rule.prototype = new Translate();
    Rule.prototype.constructor = Rule;

    /**
     * 翻译规则的then部分
     * @param then
     * result1 = {"type":"", "left": {"name":"","paramType":"INPUT|OUTPUT|TEMP"}, "operator":"", "right": %right%}
     * result2 = {"type":"if|else if|else", "constraint": %constraint%, "result":[%result1%]}
     */
    Rule.prototype.translateThen = function (then) {
        then = then || [];
        var lines = [];
        for (var i = 0; i < then.length; i++) {
            var current = then[i];
            switch (current.type) {
                case "":
                case undefined:
                    lines.push(this.translateLine(current) + ";");
                    break;
                case "if":
                case "else if":
                case "else":
                    var line = "";
                    if (current.type != "else")
                        line = current.type + "(" + this.translateConstraint(current.constraint) + "){";
                    else line = current.type + " {";
                    //else if 或者 else 必须跟 } 在同一行，否则Drools语法校验失败
                    //例如 if() {...} else if() {...}
                    if (lines[lines.length - 1] == "}" && current.type != "if") lines[lines.length - 1] = "} " + line;
                    else lines.push(line);

                    for (var j = 0; j < (current.result || []).length; j++) {
                        lines.push("\t" + this.translateLine(current.result[j]) + ";");
                    }
                    lines.push("}");
                    break;
            }
        }
        return lines;
    };

    /**
     * 翻译规则组件并展示在指定的ACE容器内，
     * 并返回翻译之后的drools内容
     * @param jsonData 规则组件对应的json数据
     * {"ruleName":"", "attributes":[{"name":"", "value":""}], "when": [], "then": []}
     * @returns {string}
     */
    Rule.prototype.translate = function (jsonData) {
        this.editor.setValue("");

        try {
            var ruleData = jsonData || "{}";
            if (typeof ruleData == "string") ruleData = JSON.parse(ruleData);
            this.options.originData = ruleData;

            ruleData.name = ruleData.ruleName;
            this.insertCommonPartOfPlugin(ruleData);

            var lines = this.translateThen(ruleData.then);
            for (var i = 0; i < lines.length; i++) {
                this.insertNextLine("\t" + lines[i]);
            }
            this.insertNextLine("end");
        } catch (e) {
            console.error(e);
            this.editor.setValue("规则翻译错误,请检查相关设置");
        }

        return this.editor.getValue();
    };


    /**
     * 决策树组件
     * @param sourceAreaID 源代码展示容器的ID
     * @param options
     * @constructor
     */
    var Tree = function (sourceAreaID, options) {
        this.name = "tree";
        this.init(sourceAreaID, options);
    };

    Tree.prototype = new Translate();
    Tree.prototype.constructor = Tree;

    /**
     * 翻译决策树的节点 [条件节点或者结果节点]
     * @param node
     * 结果节点：{"type":"result","results":[{"left": {"name":"","paramType":"INPUT|OUTPUT|TEMP"}, "operator":"", "right": %right%}]}
     * 条件节点：{"type":"constraint","var":{"name":"","paramType":"INPUT|OUTPUT|TEMP"}, "branches":[{"constraint":{"type":"else| ", "operator":"","right":%right%}}, "nextNode": %node%]}
     */
    Tree.prototype.translateTreeNode = function (node) {
        if (!!node) {
            var lines = [];
            switch (node.type) {
                case "result":  //结果节点
                    for (var i = 0; i < (node.results || []).length; i++) {
                        lines.push(this.translateLine(node.results[i]) + ";");
                    }
                    break;
                case "constraint":  //条件节点
                    for (var i = 0; i < (node.branches || []).length; i++) {
                        var con = node.branches[i].constraint || {};
                        con.left = node.var;
                        var conOperate = "if";
                        if (i > 0) conOperate = con.type || "else if";
                        var line = "";
                        if (conOperate != "else")
                            line = conOperate + "( " + this.translateLine(con) + " ){";
                        else line = conOperate + " {";
                        if (lines[lines.length - 1] == "}" && conOperate != "if") lines[lines.length - 1] = "} " + line;
                        else lines.push(line);

                        lines.push(this.translateTreeNode(node.branches[i].nextNode));
                        lines.push("}");
                    }
                    break;
            }
            return lines;
        }
        return null;
    };

    /**
     * 插入决策树节点翻译结果
     * @param lines
     */
    Tree.prototype.insertNodeResult = function (lines, level) {
        for (var i = 0; i < lines.length; i++) {
            if (typeof lines[i] == "string")
                this.insertNextLine(Array(level + 1).join("\t") + lines[i]);
            else if (lines[i] instanceof Array) {
                this.insertNodeResult(lines[i], level + 1);
            }
        }
    };

    /**
     * 翻译决策树组件并展示在指定的ACE容器内，
     * 并返回翻译之后的drools内容
     * @param jsonData 决策树组件对应的json数据
     * {"treeName":"", "node":{}}
     *
     */
    Tree.prototype.translate = function (jsonData) {
        this.editor.setValue("");

        try {
            var treeData = jsonData || "{}";
            if (typeof treeData == "string") treeData = JSON.parse(treeData);
            this.options.originData = treeData;

            treeData.name = treeData.treeName;
            this.insertCommonPartOfPlugin(treeData);

            /** insert tree node **/
            var lines = this.translateTreeNode(treeData.node);
            this.insertNodeResult(lines, 1);

            this.insertNextLine("end");

        } catch (e) {
            console.error(e);
            this.editor.setValue("决策树翻译错误,请检查相关设置");
        }

        return this.editor.getValue();
    };

    /**
     * 决策表+决策矩阵组件
     * @param sourceAreaID 源代码展示容器的ID
     * @param options
     * @constructor
     */
    var Table = function (sourceAreaID, options) {
        this.name = "table";
        this.init(sourceAreaID, options);
    };
    Table.prototype = new Translate();
    Table.prototype.constructor = Table;

    /**
     * 翻译决策表或者决策矩阵的表格元素
     * @param rowItems
     * @param colItems
     * @param results
     * @returns {Array}
     */
    Table.prototype.translateTableItem = function (rowItems, colItems, results) {
        var lines = [];
        var conditions = [];
        for (var i = 0; i < (rowItems || []).length; i++) {
            conditions.push(this.translateThresholdItem(rowItems[i]));
        }
        for (var i = 0; i < (colItems || []).length; i++) {
            conditions.push(this.translateThresholdItem(colItems[i]));
        }
        lines.push("if(" + conditions.join(" && ") + "){");
        for (var i = 0; i < (results || []).length; i++) {
            lines.push("\t" + this.translateLine(results[i]) + ";");
        }
        lines.push("}");

        return lines;
    };

    /**
     * 翻译决策表格组件并展示在指定的ACE容器内，
     * 并返回翻译之后的drools内容
     * @param jsonData 决策表格组件对应的json数据
     */
    Table.prototype.translateTable = function (jsonData) {
        this.editor.setValue("");
        try {
            var tableData = jsonData || "{}";
            if (typeof tableData == "string") tableData = JSON.parse(tableData);
            this.options.originData = tableData;

            tableData.name = tableData.tableName;
            this.insertCommonPartOfPlugin(tableData);

            var rows = tableData.rows || [], cols = tableData.cols || [], results = tableData.results || [];
            if (cols.length == 0) {
                throw "决策表的列变量集不能为空";
            }

            var lines = [];
            var linesTotalCount = cols[0].conditions.length, currentLine = 0;
            while (currentLine < linesTotalCount) {
                var colItems = [], rowItems = [], resultItems = [];
                for (var i = 0; i < cols.length; i++) {
                    var colItem = cols[i].conditions[currentLine];
                    if (!!colItem) {
                        colItem.name = cols[i].name;
                        colItem.paramType = cols[i].paramType;
                        colItems.push(colItem);
                    }
                }

                for (var i = 0; i < results.length; i++) {
                    var outcome = results[i].outcomes[currentLine];
                    if (!!outcome) {
                        resultItems.push({
                            left: {name: results[i].name, paramType: results[i].paramType},
                            operator: outcome.operator || "=",
                            right: outcome
                        });
                    }
                }

                var innerLines = this.translateTableItem(rowItems, colItems, resultItems);
                for (var i = 0; i < innerLines.length; i++) {
                    if (lines[lines.length - 1] == "}") lines[lines.length - 1] = "} else " + innerLines[i];
                    else lines.push(innerLines[i]);
                }
                currentLine += 1;
            }

            var elsePart = tableData.elseResults || [];
            if (!!elsePart.length) {
                if (lines[lines.length - 1] == "}") lines[lines.length - 1] = "} else {";
                for (var i = 0; i < elsePart.length; i++) {
                    var outcome = elsePart[i].outcomes[0] || {};
                    lines.push("\t" + this.translateLine({
                            left: {name: elsePart[i].name, paramType: elsePart[i].paramType},
                            operator: outcome.operator || "=",
                            right: outcome
                        }) + ";");
                }
                lines.push("}");
            }
            for (var i = 0; i < lines.length; i++) {
                this.insertNextLine("\t" + lines[i]);
            }

            this.insertNextLine("end");

        } catch (e) {
            console.error(e);
            this.editor.setValue(e || "决策表格翻译错误,请检查相关设置");
        }
        return this.editor.getValue();
    };

    /**
     * 翻译决策矩阵组件并展示在指定的ACE容器内，
     * 并返回翻译之后的drools内容
     * @param jsonData 决策矩阵组件对应的json数据
     */
    Table.prototype.translateMatrix = function (jsonData) {
        this.editor.setValue("");
        try {
            var tableData = jsonData || "{}";
            if (typeof tableData == "string") tableData = JSON.parse(tableData);
            this.options.originData = tableData;

            tableData.name = tableData.tableName;
            this.insertCommonPartOfPlugin(tableData);

            var rows = tableData.rows || [], cols = tableData.cols || [], results = tableData.results || [];
            if (rows.length != 1 || cols.length != 1) {
                throw "决策矩阵的行变量集和列变量集个数只能为1";
            }

            var row = rows[0], rowConditions = row.conditions || [];
            var col = cols[0], colConditions = col.conditions || [];

            var resultIndex = 0;
            var lines = [];
            for (var i = 0; i < rowConditions.length; i++) {
                var rowItem = rowConditions[i];
                rowItem.name = row.name;
                rowItem.paramType = row.paramType;

                for (var j = 0; j < colConditions.length; j++) {
                    var colItem = colConditions[j];
                    colItem.name = col.name;
                    colItem.paramType = col.paramType;

                    var resultItems = [];
                    for (var k = 0; k < results.length; k++) {
                        var outcome = (results[k].outcomes || [])[resultIndex] || {};
                        var resultItem = {
                            left: {name: results[k].name, paramType: results[k].paramType},
                            operator: outcome.operator,
                            right: outcome
                        };
                        resultItems.push(resultItem);
                    }

                    var innerLines = this.translateTableItem([rowItem], [colItem], resultItems);
                    for (var x = 0; x < innerLines.length; x++) {
                        if (lines[lines.length - 1] == "}") lines[lines.length - 1] = "} else " + innerLines[x];
                        else lines.push(innerLines[x]);
                    }
                    resultIndex += 1;
                }
            }

            var elsePart = tableData.elseResults || [];
            if (!!elsePart.length) {
                if (lines[lines.length - 1] == "}") lines[lines.length - 1] = "} else {";
                for (var i = 0; i < elsePart.length; i++) {
                    var outcome = elsePart[i].outcomes[0] || {};
                    lines.push("\t" + this.translateLine({
                            left: {name: elsePart[i].name, paramType: elsePart[i].paramType},
                            operator: outcome.operator || "=",
                            right: outcome
                        }) + ";");
                }
                lines.push("}");
            }

            for (var i = 0; i < lines.length; i++) {
                this.insertNextLine("\t" + lines[i]);
            }

            this.insertNextLine("end");


        } catch (e) {
            console.error(e);
            this.editor.setValue(e || "决策矩阵翻译错误,请检查相关设置");
        }
        return this.editor.getValue();
    };

    /**
     * 评分卡组件
     * @param sourceAreaID
     * @param options
     * @constructor
     */
    var ScoreCard = function (sourceAreaID, options) {
        this.name = "scoreCard";
        this.init(sourceAreaID, options);
    };

    ScoreCard.prototype = new Translate();
    ScoreCard.constructor = ScoreCard;

    /**
     * 翻译评分卡中的某个评分变量
     * @param item
     * var = {"name":"", "paramType":"", "scores":[]}
     * score = {"leftLine":{},"rightLine":{},"result":%right%}
     */
    ScoreCard.prototype.translateVarItem = function (item, output) {
        item = item || {};
        var lines = [];
        if ((item.scores || []).length == 1 && item.scores[0].type == "else") {
            var result = item.scores[0].result;
            lines.push(this.translateLine({
                    left: output,
                    operator: result.operator,
                    right: result
                }) + ";");
            return lines;
        }
        for (var i = 0; i < (item.scores || []).length; i++) {
            var line = "";
            if (item.scores[i].type == "else") {
                line = "{";
            } else {
                var condition = {
                    name: item.name,
                    paramType: item.paramType,
                    leftLine: item.scores[i].leftLine,
                    rightLine: item.scores[i].rightLine
                };
                line = "if( " + this.translateThresholdItem(condition) + " ){";
            }

            if (lines[lines.length - 1] == "}") lines[lines.length - 1] = "} else " + line;
            else lines.push(line);

            var result = item.scores[i].result;
            lines.push("\t" + this.translateLine({
                    left: output,
                    operator: result.operator,
                    right: result
                }) + ";");
            lines.push("}");
        }

        return lines;
    };

    /**
     * 翻译评分卡组件并展示在指定的ACE容器内，
     * 并返回翻译之后的drools内容
     * @param jsonData 评分卡组件对应的json数据
     */
    ScoreCard.prototype.translate = function (jsonData) {
        this.editor.setValue("");
        try {
            var cardData = jsonData || "{}";
            if (typeof cardData == "string") cardData = JSON.parse(cardData);
            this.options.originData = cardData;

            cardData.name = cardData.cardName;
            this.insertCommonPartOfPlugin(cardData);

            /**insert init value**/
            var initValue = cardData.initValue || "";
            this.insertNextLine("\t" + this.translateLine({
                    left: cardData.output,
                    operator: "=",
                    right: {type: "const", value: initValue}
                }) + ";");
            this.insertWhiteLine();

            var vars = cardData.vars || [];
            for (var i = 0; i < vars.length; i++) {
                var lines = this.translateVarItem(vars[i], cardData.output);
                for (var j = 0; j < lines.length; j++) {
                    this.insertNextLine("\t" + lines[j]);
                }
                this.insertWhiteLine();
            }

            this.insertNextLine("end");

        } catch (e) {
            console.error(e);
            this.editor.setValue(e || "评分卡翻译错误,请检查相关设置");
        }
        return this.editor.getValue();
    };

    /**
     * 决策流
     * @param sourceAreaID
     * @param options
     * @constructor
     */
    var Flow = function (sourceAreaID, options) {
        this.name = "engineFlow";
        this.init(sourceAreaID, options);
    };

    Flow.prototype = new Translate();
    Flow.prototype.constructor = Flow;

    Flow.prototype.translate = function (jsonData) {
        this.editor.setValue("");
        try {
            var flowData = jsonData || "{}";
            if (typeof flowData == "string") flowData = JSON.parse(flowData);
            this.options.originData = flowData;

            /** package **/
            var packageName = this.options.basePackage, subPackage = [];
            for (var i = 0; i < (flowData.conditions || []).length; i++) {
                subPackage.push((flowData.conditions[i].right || {}).value);
            }
            subPackage = subPackage.join(".");
            if (!!subPackage) packageName += "." + subPackage;
            this.insertNextLine("package " + packageName);
            this.insertWhiteLine();

            /** imports **/
            var imports = this.options.imports || [];
            for (var i = 0; i < imports.length; i++) {
                this.insertNextLine("import " + imports[i] + ";");
            }
            this.insertWhiteLine();

            /** insert hide ace container **/
            var hideAreaID = "hide-area";
            if (!document.getElementById(hideAreaID)) {
                var ele = document.createElement("div");
                ele.setAttribute("id", hideAreaID);
                ele.style = "display:none !important";
                document.body.appendChild(ele);
            }

            /** functions **/
            var fns = flowData.fns || [];
            for (var i = 0; i < fns.length; i++) {
                var fnText = new FN(hideAreaID).translate(fns[i]);
                this.insertBlock(fnText);
            }
            this.insertWhiteLine();

            /** rule list **/
            var decisionSetList = flowData.decisionSetList || [];
            for (var i = 0; i < decisionSetList.length; i++) {
                var decistionSet = decisionSetList[i].decistionSet || [];
                var baseSalience = (decisionSetList.length - i) * 10;
                for (var j = 0; j < decistionSet.length; j++) {
                    var decision = decistionSet[j], className = "", fnName = "translate";
                    switch (decision.type.toUpperCase()) {
                        case "RULE":
                            className = "Rule";
                            break;
                        case "TREE":
                            className = "Tree";
                            break;
                        case "TABLE":
                            className = "Table";
                            fnName = "translateTable";
                            break;
                        case "MATRIX":
                            className = "Table";
                            fnName = "translateMatrix";
                            break;
                        case "CARD":
                            className = "ScoreCard";
                            break;
                    }
                    var salience = baseSalience + j;
                    decision.data.attributes = decision.data.attributes || [];
                    decision.data.attributes.push({
                        "name": "salience",
                        "value": salience
                    });
                    var decistionText = eval("new " + className + "(\"" + hideAreaID + "\")." + fnName + "(" + JSON.stringify(decision.data) + ")");
                    this.insertBlock(decistionText);
                }
            }


        } catch (e) {
            console.error(e);
            this.editor.setValue(e || "决策流翻译错误,请检查相关设置");
        }
        return this.editor.getValue();
    }


    window.Engine = {
        FN: FN,
        Rule: Rule,
        Tree: Tree,
        Table: Table,
        ScoreCard: ScoreCard,
        Flow: Flow
    };
})();

//test example

/**规则**/
var ruleData = {
    "ruleName": "Rule_1",
    "then": [
        {
            "type": "if",
            "constraint": [
                {
                    "type": "",
                    "left": {"name": "STAN_STATUS_8002", "paramType": "INPUT"},
                    "operator": "==",
                    "right": {"type": "const", "value": "1"}
                },
                {
                    "type": "&&",
                    "left": {"name": "STAN_STATUS_8003", "paramType": "INPUT"},
                    "operator": "==",
                    "right": {"type": "const", "value": "3"},
                    "fields": [
                        {
                            "type": "||",
                            "left": {"name": "STAN_STATUS_8004", "paramType": "INPUT"},
                            "operator": "==",
                            "right": {"type": "const", "value": "4"},
                            "fields": [
                                {
                                    "type": "&&",
                                    "left": {"name": "STAN_STATUS_8004", "paramType": "INPUT"},
                                    "operator": "==",
                                    "right": {"type": "const", "value": "4"}
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "||",
                    "left": {"name": "STAN_STATUS_8002", "paramType": "INPUT"},
                    "operator": "==",
                    "right": {"type": "const", "value": "1"}
                }
            ],
            "result": [
                {
                    "type": "",
                    "left": {"name": "P_STAN_8002", "paramType": "TEMP"},
                    "operator": "=",
                    "right": {
                        "type": "fn",
                        "name": "krange",
                        "parameters": [{"type": "var", "name": "STAN_ID_HASH", "paramType": "INPUT"}, {
                            "type": "const",
                            "value": "340"
                        }, {"type": "const", "value": "400"}]
                    }
                }, {
                    "type": "",
                    "left": {"name": "STAN_SH_RULE_FIRED", "paramType": "OUTPUT"},
                    "operator": "+=",
                    "right": {"type": "const", "value": "\"P.B_1高风险客户（8002）\""}
                }]
        },
        {
            "type": "else",
            "result": [{
                "type": "",
                "left": {"name": "STAN_SH_RULE_FIRED", "paramType": "OUTPUT"},
                "operator": "+=",
                "right": {"type": "const", "value": "\"P.E_1疑似风险客户（8005）\""}
            }]
        }
    ]
};
//console.log(new Engine.Rule("ace-area").translate(ruleData));

/**决策树**/
var treeData = {
    "treeName": "Tree_1",
    "node": {
        "type": "constraint",
        "var": {"name": "STAN_STATUS_8002", "paramType": "INPUT"},
        "branches": [
            {
                "constraint": {"operator": ">", "right": {"type": "const", "value": "1"}},
                "nextNode": {
                    "type": "constraint",
                    "var": {"name": "STAN_STATUS_8003", "paramType": "INPUT"},
                    "branches": [
                        {
                            "constraint": {"operator": ">", "right": {"type": "const", "value": "2"}},
                            "nextNode": {
                                "type": "result",
                                "results": [{
                                    "left": {"name": "P_STAN_8002", "paramType": "TEMP"},
                                    "operator": "=",
                                    "right": {
                                        "type": "fn",
                                        "name": "krange",
                                        "parameters": [{
                                            "type": "var",
                                            "name": "STAN_ID_HASH",
                                            "paramType": "INPUT"
                                        }, {"type": "const", "value": "600"}, {"type": "const", "value": "500"}]
                                    }
                                }]
                            }
                        },
                        {
                            "constraint": {"type": "else"},
                            "nextNode": {
                                "type": "result",
                                "results": [
                                    {
                                        "left": {"name": "STAN_SH_RULE_FIRED", "paramType": "OUTPUT"},
                                        "operator": "+=",
                                        "right": {"type": "const", "value": "\"P.E_1非风险客户（8005）\""}
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "constraint": {"operator": "<=", "right": {"type": "const", "value": "1"}},
                "nextNode": {
                    "type": "result",
                    "results": [{
                        "left": {"name": "STAN_SH_RULE_FIRED", "paramType": "OUTPUT"},
                        "operator": "+=",
                        "right": {"type": "const", "value": "\"P.E_1非风险客户（8005）\""}
                    }]
                }
            },
            {
                "constraint": {"type": "else"},
                "nextNode": {
                    "type": "result",
                    "results": [{
                        "left": {"name": "STAN_SH_RULE_FIRED", "paramType": "OUTPUT"},
                        "operator": "+=",
                        "right": {"type": "const", "value": "\"P.E_1风险客户（8005）\""}
                    }]
                }
            }
        ]
    }
};
//console.log(new Engine.Tree("ace-area").translate(treeData));

/**决策表格**/
var tableData = {
    "tableName": "TABLE_1",
    "cols": [
        {
            "name": "APP_COUNT",
            "paramType": "INPUT",
            "conditions": [
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "100"}}},
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "200"}}},
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "300"}}}
            ]
        },
        {
            "name": "APP_AMT_3M",
            "paramType": "INPUT",
            "conditions": [
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "5000"}}},
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "10000"}}},
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "50000"}}}
            ]
        },
        {
            "name": "APP_COUNT_3M",
            "paramType": "INPUT",
            "conditions": [
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "10"}}},
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "20"}}},
                {"leftLine": {}, "rightLine": {"comparator": "==", "right": {"type": "const", "value": "30"}}}
            ]
        }
    ],
    "rows": [],
    "results": [
        {
            "name": "FRAUD_LEVEL",
            "paramType": "OUTPUT",
            "outcomes": [
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"中\""},
                {"operator": "=", "type": "const", "value": "\"高\""}
            ]
        },
        {
            "name": "FRAUD_SCORE",
            "paramType": "OUTPUT",
            "outcomes": [
                {"operator": "=", "type": "const", "value": "20"},
                {"operator": "=", "type": "const", "value": "60"},
                {"operator": "=", "type": "const", "value": "80"}
            ]
        }
    ],
    "elseResults": [
        {
            "name": "FRAUD_LEVEL",
            "paramType": "OUTPUT",
            "outcomes": [
                {"operator": "=", "type": "const", "value": "\"严重\""}
            ]
        },
        {
            "name": "FRAUD_SCORE",
            "paramType": "OUTPUT",
            "outcomes": [
                {"operator": "=", "type": "const", "value": "100"}
            ]
        }
    ]
};
//console.log(new Engine.Table("ace-area").translateTable(tableData));

/**决策矩阵**/
var matrixData = {
    "tableName": "MATRIX_1",
    "cols": [
        {
            "name": "APP_AMT_3M",
            "paramType": "INPUT",
            "conditions": [
                {
                    "leftLine": {},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "5000"}}
                },
                {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "5000"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "10000"}}
                }, {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "10000"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "50000"}}
                }
            ]
        }
    ],
    "rows": [
        {
            "name": "APP_COUNT",
            "paramType": "INPUT",
            "conditions": [
                {
                    "leftLine": {},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "10"}}
                }, {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "10"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "20"}}
                }, {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "20"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "30"}}
                }]
        }
    ],
    "results": [
        {
            "name": "FRAUD_LEVEL",
            "paramType": "OUTPUT",
            "outcomes": [
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"低\""},
                {"operator": "=", "type": "const", "value": "\"高\""}
            ]
        }
    ],
    "elseResults": [
        {
            "name": "FRAUD_LEVEL",
            "paramType": "OUTPUT",
            "outcomes": [
                {"operator": "=", "type": "const", "value": "\"未知\""}
            ]
        }
    ]
};
//console.log(new Engine.Table("ace-area").translateMatrix(matrixData));

/**评分卡**/
var cardData = {
    "cardName": "CARD_1",
    "initValue": "20",
    "output": {
        "name": "FRAUD_SCORE",
        "paramType": "OUTPUT"
    },
    "vars": [
        {
            "name": "APP_COUNT_3M",
            "paramType": "INPUT",
            "scores": [
                {
                    "leftLine": {},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "10"}},
                    "result": {"operator": "+=", "type": "const", "value": "20"}
                },
                {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "10"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "20"}},
                    "result": {"operator": "+=", "type": "const", "value": "40"}
                },
                {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "20"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "30"}},
                    "result": {"operator": "+=", "type": "const", "value": "60"}
                },
                {
                    "type": "else",
                    "result": {"operator": "=", "type": "const", "value": "100"}
                }
            ]
        },
        {
            "name": "APP_AMT_3M",
            "paramType": "INPUT",
            "scores": [
                {
                    "leftLine": {},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "1000"}},
                    "result": {"operator": "-=", "type": "const", "value": "20"}
                },
                {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "1000"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "5000"}},
                    "result": {"operator": "+=", "type": "const", "value": "10"}
                },
                {
                    "leftLine": {"comparator": ">=", "right": {"type": "const", "value": "5000"}},
                    "rightLine": {"comparator": "<", "right": {"type": "const", "value": "10000"}},
                    "result": {"operator": "+=", "type": "const", "value": "20"}
                },
                {
                    "type": "else",
                    "result": {"operator": "=", "type": "const", "value": "100"}
                }
            ]
        }
    ]
};
//console.log(new Engine.ScoreCard("ace-area").translate(cardData));

/**决策流**/
var flowData = {
    //决策流条件
    "conditions": [
        {
            "type": "",
            "left": {"name": "stan_market_scene", "paramType": "INPUT"},
            "operator": "==",
            "right": {"type": "const", "value": "ON_LINE"}
        },
        {
            "type": "",
            "left": {"name": "stan_loan_type", "paramType": "INPUT"},
            "operator": "==",
            "right": {"type": "const", "value": "AT1"}
        }
    ],
    //决策流使用到的所有函数
    "fns": [
        {
            "name": "krange",
            "desc": "固定一个值，该值在相同数值区间内取得的数值不变",
            "parameters": [
                {
                    "name": "key",
                    "type": "String"
                },
                {
                    "name": "x",
                    "type": "int"
                },
                {
                    "name": "y",
                    "type": "int"
                }
            ],
            "returnType": "int",
            "body": "if (key == null) {\n    return 0;\n}\nint rst = key.hashCode() % 1000;\nrst = rst < 0 ? -rst : rst;\nreturn rst % (y - x) + x + 1;"
        },
        {
            "name": "groupAppVarMax",
            "desc": "获取数组内最大值",
            "parameters": [
                {
                    "name": "netVar",
                    "type": "String"
                }
            ],
            "returnType": "Integer",
            "body": "if(netVar == null || \"\".equals(netVar)) {\n\treturn 0;\n}\nString[] nvars = netVar.split(\";\");\nInteger rst = Integer.parseInt(nvars[0]);\nfor(String nvar : nvars) {\n\trst = Math.max(Integer.parseInt(nvar), rst);\n}\nreturn rst;"
        },
        {
            "name": "currentAppVar",
            "desc": "获取数组第一组数字，即当前申请件对应数字",
            "parameters": [
                {
                    "name": "netVar",
                    "type": "String"
                }
            ],
            "returnType": "Integer",
            "body": "if(netVar == null || \"\".equals(netVar)) {\n    return 0;\n}\nreturn Integer.parseInt(netVar.split(\";\")[0]);"
        }
    ],
    //决策集顺序列表
    "decisionSetList": [
        {
            "name": "决策集1",
            //决策集包含的组件
            "decistionSet": [
                {"salience": 1, "type": "RULE", "data": ruleData},
                {"salience": 2, "type": "TREE", "data": treeData}
            ]
        },
        {
            "name": "决策集2",
            //决策集包含的组件
            "decistionSet": [
                {"salience": 1, "type": "TABLE", "data": tableData},
                {"salience": 2, "type": "MATRIX", "data": matrixData}
            ]
        },
        {
            "name": "决策集3",
            //决策集包含的组件
            "decistionSet": [
                {"salience": 1, "type": "CARD", "data": cardData}
            ]
        }
    ]
};
//console.log(new Engine.Flow("ace-area").translate(flowData));