/**Created by IntelliJ IDEA.
 *User: jingzhiqian Date: 2017/8/21 Time: 16:40
 *树形图、决策流图形绘制
 **/


;
(function ($) {

    var _this = {};
    var JsPlumbTool = function (options) {
        _this = this;
        _this.init(options);
    };

    JsPlumbTool.defaults = {
        DragOptions: {cursor: "move", zIndex: 2000},
        ConnectionOverlays: [["Arrow", {
            location: 0.9,
            visible: true,
            width: 11,
            length: 11,
            direction: 1,
            id: "arrow_forwards"
        }], ["Label", {
            location: 0.5,
            label: "请设置条件",
            id: "connectLabel",
            labelStyle: {fill: "#ffffff", color: "#000000", padding: "0px"}
        }]],
        Container: "draw-canvas",
        connectorStyle: {stroke: "#9B9B9B", strokeWidth: 1},
        connectorHoverStyle: {strokeWidth: 2, stroke: "#12B9C8"},
        endpoint: ["Dot", {cssClass: "endpointcssClass"}], //端点形状
        paintStyle: {fill: "#c5c5c5", radius: 2.8},      //端点的颜色样式
        isSource: true, //是否可拖动（作为连接线起点）
        isTarget: true, //是否可以放置（连接终点）
        uniqueEndpoint: true,
        connector: ["Straight", {stub: [0, 0], gap: 0, cornerRadius: 5, alwaysRespectStubs: true}],
        maxConnections: -1
    };

    JsPlumbTool.prototype.options = {};
    /**
     * set options of JsPlumbTool instance
     * @param opt
     */
    JsPlumbTool.prototype.setOptions = function (opt) {
        opt = opt || {};
        for (var key in JsPlumbTool.defaults) _this.options[key] = JsPlumbTool.defaults[key];
        for (var key in opt) _this.options[key] = opt[key];
    };

    /**
     * init jsPlumb setting
     * @param opt
     */
    JsPlumbTool.prototype.init = function (options) {
        _this.setOptions(options);
        _this.instance = jsPlumb.getInstance(_this.options);
        _this.instance.importDefaults({
            ConnectionsDetachable: true,
            ReattachConnections: false
        });
        setNodesRelationship();
        //this.instance.setContainer('.draw-canvas');
        //this.instance.setZoom('0.75');
    };

    var canvasScrollListener = function (containerId) {
        $('.draw-canvas').scroll(function () {
            //$('body').css('background',"red");
            _this.instance.repaintEverything();
        });
    };

    /*
     *set the relationship between the nodes
     */
    var setNodesRelationship = function () {
        //监听建立新的连接时,为源节点与目标节点设置属性
        _this.instance.bind('connection', function (info, originalEvent) {
            var sourceNode = info.source,
                targetNode = info.target;
            //为目标节点标记源节点id
            $('#' + targetNode.id).attr("node-source", sourceNode.id);
        });
    }

    /*
     * Double-click the wire binding event
     * */
    var connectionBindEvent = function () {
        //双击连接线进行相关操作
        _this.instance.bind('dblclick', function (info, originalEvent) {
            var overLabelId = info.getOverlay("connectLabel").canvas.id;
            var operateTemplate = '<div class="connect-operate operate-panel">' + ((_this.options.isTree) ? '<div class="line-editor"><div class="icons icon-editor"></div></div>' : "") + '<div class="line-delete"><div class="icons icon-delete"></div></div></div>';
            var operatePanel = $('.operate-panel');
            if (operatePanel.length > 0)operatePanel.remove();
            $('#' + overLabelId).css("background", "white");
            info.getOverlay("connectLabel").setLabel(operateTemplate);
            var lineOperateContainer = $('.connect-operate');
            //单击删除连线事件绑定
            lineOperateContainer.find('.line-delete').bind('click', function () {
                deleteConnectionLine(overLabelId, info);
            });
            //单击编辑连线事件绑定
            $(lineOperateContainer.find('.line-editor')).on('click', function () {
                var returnData = (_this.options.editLineAction || function () {
                })();
                var lineText = '', json = JSON.parse(returnData);
                if (!!json && !!json.operator && !!json.right && !!json.right.value) {
                    lineText = json.operator + json.right.value;
                }
                $('#' + overLabelId).html(lineText).attr('title', lineText);
                lineOperateContainer.remove();
            });
        });
    };

    /*
     * delete connection line
     * */
    var deleteConnectionLine = function (connectionId, connectionInfo) {
        removeConfirmDialog(connectionId, {
            okAction: function () {
                _this.instance.detach(connectionInfo);
            }
        });
    };

    /*
     * edit connection line Action
     * @param {function}callback
     * */
    JsPlumbTool.prototype.editLineAction = function (callback) {
        _this.options.editLineAction = callback;
    };

    /*
     * selected Node
     * */
    var selectNode = function (nodeId, nodeType) {
        var nodeOperateTpl = '<div class="node-selected operate-panel ' + nodeType + '-select"><div class="node-editor"><div class="icons icon-editor"></div></div>' +
            '<div class="node-delete"><div class="icons icon-delete"></div></div></div>';
        $('#' + nodeId).addClass('selected').siblings().removeClass('selected');
        var operatePanel = $('.operate-panel');
        if (operatePanel.length > 0)operatePanel.remove();
        $('#' + nodeId).append(nodeOperateTpl);
        //单击删除节点事件绑定
        $('#' + nodeId + ' .node-delete').on('click', function () {
            deleteNode(nodeId);
        });
        //单击编辑节点事件绑定
        $('#' + nodeId + ' .node-editor').on('click', function () {
            var returnData = (_this.options.editNodeAction || function () {
            })();
            var nodeText = '', json = JSON.parse(returnData);
            if (!!json && !!json.name) {
                nodeText = json.name;
            }
            $('#' + nodeId).find('.text').html(nodeText).attr('title', nodeText);
            $('#' + nodeId + ' .node-selected').remove();
        });
    };

    /*
     * delete Node
     * */
    var deleteNode = function (nodeId) {
        removeConfirmDialog(nodeId, {
            okAction: function () {
                _this.instance.remove(nodeId);
                $('#' + nodeId).removeClass('selected');
            }
        });
    };

    /*
     * edit Node Action
     * @param {function}callback
     * */
    JsPlumbTool.prototype.editNodeAction = function (callback) {
        _this.options.editNodeAction = callback;
    };

    /*
     * delete operation confirmation
     * @param {stirng} removeElementId
     * */
    var removeConfirmDialog = function (removeElementId, callback) {
        var dialogTpl = '<div id="operateDialog"><div class="icons icon-triangle-left"></div><div class="delete-dialog"><div class="title">确认删除吗？</div><div class="buttons"><div class="ok">确定</div><div class="cancle">取消</div></div></div></div>';
        var dialogContainer = $('#' + removeElementId + ' .operate-panel');
        $(dialogContainer).children('div').remove();
        $(dialogContainer).append(dialogTpl).css('background', 'none');
        //单击删除节点事件绑定
        $(dialogContainer.find('.ok')).on('click', function () {
            (callback.okAction || function () {
            })();
        });
        //单击编辑节点事件绑定
        $(dialogContainer.find('.cancle')).on('click', function () {
            dialogContainer.remove();
        });
    };

    /**
     * drag draw nodes
     */
    var nodeNode = 1;
    var dragDrawNodes = function () {
        //设置图例节点为复制拖拽【若不设置这个属性，则将图例节点拖出图例框】
        $('.legend-node').draggable({helper: "clone"});
        $('.draw-canvas').draggable({
            scroll: true,
            containment: ".draw-canvas",
            //containment: [ 50, 0, 3000, 3000 ],
            disabled: true
        }).droppable({
            drop: function (event, ui) {
                if (ui.draggable[0].className.indexOf("ui-draggable") >= 0) {
                    var isTree = _this.options.isTree,
                        scrollTop = $(this).scrollTop(),
                        scrollLeft = $(this).scrollLeft(),
                        nodeType = $(ui.draggable[0]).attr('legend-type'), id = nodeType + nodeNode,
                        isStartOrEndNode = (nodeType == "node-ancestor" || nodeType == "node-finished"),
                        nodeLeft = $(ui.helper[0]).offset().left - ((isStartOrEndNode) ? 0 : 45) + ((scrollLeft == 0) ? 0 : scrollLeft) + "px",
                        nodeTop = $(ui.helper[0]).offset().top - ((isStartOrEndNode) ? 0 : 132) + ((scrollTop == 0) ? 0 : scrollTop) + "px";
                    switch (nodeType) {
                        case "node-rhombus":
                            $('.draw-canvas>div').append('<div id="' + id + '" class="tree-node node-rhombus" style="left:' + nodeLeft + ';top:' + nodeTop + ';position:absolute;" node-type="node-condition" node-source=""><img src="../images/treeRhombus.png" /><img class="selected" src="../images/treeRhombusSelected.png" /><div class="text" title="请选择变量...">请选择变量...</div></div>');
                            //添加连接锚点
                            _this.addEndpoint(id, "TopCenter", {isSource: false});
                            _this.addEndpoint(id, "BottomCenter", {isTarget: false});
                            break;
                        case "node-rectangle":
                            $('.draw-canvas>div').append('<div id="' + id + '" class="tree-node node-rectangle" style="left:' + nodeLeft + ';top:' + nodeTop + ';position:absolute;" node-type="node-result" node-source=""><div class="text" title="' + ((isTree) ? "请输入结果..." : "请选择策略集...") + '">' + ((isTree) ? "请输入结果..." : "请选择策略集...") + '</div></div>');
                            //添加连接锚点
                            if (isTree) {
                                _this.addEndpoint(id, "TopCenter", {isSource: false});
                            } else {
                                _this.addEndpoint(id, "Left", {isSource: false, maxConnections: 1});
                                _this.addEndpoint(id, "Right", {isTarget: false, maxConnections: 1});
                            }
                            break;
                    }
                    nodeNode++;
                    var newNode = $('#' + id);
                    //双击选中节点事件绑定
                    newNode.bind('dblclick', function () {
                        selectNode(id, nodeType);
                    });
                }
            }
        });
    };

    /**
     * append draw
     * @param {string}containerId
     * @param {string}graphType【tree/flowChart】
     */
    JsPlumbTool.prototype.renderGraphTool = function (containerId, graphType) {
        var isTree = (graphType == "tree"),
            title = (isTree) ? "决策树定义" : "决策流";
        _this.options.isTree = isTree;
        var titleTpl = '<div class="module-title">' + title + '</div>',
            rhombusLegendTpl = '<div class="legend-node legend-rhombus" legend-type="node-rhombus"><img src="treeRhombus0.png" /><div class="text">条件</div></div>',
            rectangleLegendTpl = '<div class="legend-node legend-rectangle" legend-type="node-rectangle"><div class="text">' + ((isTree) ? "结果" : "决策集") + '</div></div>',
            legendTpl = '<div class="draw-container"><div class="draw-legends"><div class="tool-text">组件：</div>' + ((isTree) ? rhombusLegendTpl : "")
                + rectangleLegendTpl + '<div class="tree-reset"><div class="icons icon-reset"></div><div class="text">重置</div></div></div>',
            endNodeTpl = '<div class="tree-node node-roundness" id="node-end" node-source="node-finished" node-type="node-end"><div class="text">结束</div></div>',
            defaultCanvas = '<div class="draw-canvas"><div class="pos-relative"><div class="tree-node node-roundness" id="node-start" node-source="node-ancestor" node-type="node-start"><div class="text">开始</div></div>' + ((isTree) ? "" : endNodeTpl) + '</div></div>';

        var graphTemplate = '<div id="' + graphType + '">' + titleTpl + legendTpl + defaultCanvas + '</div>';
        $('#' + containerId).append(graphTemplate);

        _this.instance.draggable($(".tree-node"));
        _this.addEndpoint("node-start", (isTree) ? "BottomCenter" : "Right", {isTarget: false});
        //根据图形类型，重新配置连线样式
        if (!isTree) {
            _this.addEndpoint("node-end", "Left", {isSource: false});
            _this.options.connector[0] = "Flowchart";
            _this.options.ConnectionOverlays[1] = ["Label", {
                location: 0.5,
                label: "",
                id: "connectLabel",
                labelStyle: {},
            }];
        }

        dragDrawNodes();
        connectionBindEvent();
        canvasScrollListener(containerId);
    };

    /**
     * add node anchor and set the node draggable
     * @param {string}id
     * @param {string}anchorPos
     * @param options
     * example:
     *    JsPlumbTool.addEndpoint("node1","topCenter",{});
     */
    JsPlumbTool.prototype.addEndpoint = function (id, anchorPos, opt) {
        var _instance = _this.instance;
        opt = opt || {};
        var options = {};
        for (var key in _this.options) options[key] = _this.options[key];
        for (var key in opt) options[key] = opt[key];
        _instance.addEndpoint(id, {anchors: anchorPos}, options);
        $("#" + id).draggable({
            //containment: ".draw-canvas",
            drag: function () {
                _instance.repaintEverything();
            },
            resize: function () {
                _instance.repaintEverything();
            },
            stop: function () {
                _instance.repaintEverything();
            }
        });
    };


    window.jsPlumbTool = JsPlumbTool;
    //$.fn.jsPlumbTool=function(options){
    //    return new JsPlumbTool(this,options);
    //}
})
($);

