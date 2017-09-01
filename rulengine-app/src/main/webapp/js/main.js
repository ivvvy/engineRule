/**
 * Created by ZhaiFenfang on 2017/8/20.
 */
require.config({
    baseUrl: "/rulengine-app/",
    paths: {
        jquery: 'js/libs/jquery-3.2.1',
        vue: 'js/libs/vue',
        Engine: 'js/libs/translate',
        jsPlumb: 'js/libs/jsPlumb-2.2.8',
        ace: 'js/libs/ace',
        text: 'js/libs/text',
        Handsontable: 'js/libs/handsontable.full.min',
        Component: 'js/libs/component',
        zTree: 'js/libs/jquery.ztree.all.min',
        Utils: 'js/libs/utils',
        ELEMENT: 'js/libs/elementUi',
        moment: 'js/libs/moment.min',
        daterangepicker: 'js/libs/daterangepicker',
        underscore: 'js/libs/underscore-min'
    },
    shim: {
        jquery: {exports: '$'},
        vue: {exports: 'Vue'},
        daterangepicker: {
            deps: ['jquery', 'moment']
        },
        zTree: {
            deps: ['jquery']
        },
        Handsontable: {exports: 'Handsontable'},
        Engine: {
            deps: ['ace'],
            exports: 'Engine'
        },
        elementUi: {
            deps: ['vue'],
            exports: 'elementUi'
        }
    }
});

require(['jquery', 'Component'], function ($) {
    var entryModule = $('script[data-entry]').attr("data-entry") || "";
    if (!!entryModule) require([entryModule]);
    else console.error("no entry module set on <script>");

    $.extend({
        postJSON: function (url, data, success, error) {
            return $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: 'json',
                success: success,
                error: error
            });
        }
    })

    $.ajaxSetup({
        beforeSend: function (xhr, setting) {
            if (!!setting.url) setting.url = "/rulengine-app/rulengine" + setting.url;
        }
    });

    $(document).bind("ajaxStart", function () {

    }).bind("ajaxStop", function () {

    })
});