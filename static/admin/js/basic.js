/*
* basic.js 页面的基本函数集合,放置于页面顶部，JQ下方
* */

//1：获取当前页面的URL属性值，接收参数name：属性名，如果有对应属性值则返回属性值否则返回 null
(function ($) {
    $.getUrlParam = function (name, site) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"), r;
        if (site === 1) {
            r = window.parent.location.search.substr(1).match(reg)
        } else {
            try {
                r = site.location.search.substr(1).match(reg);
            } catch (e) {
                r = window.location.search.substr(1).match(reg)
            }
        }
        if (r != null) return decodeURI(r[2]);
        return null;
    };
})(jQuery);

//2：cookies操作函数
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

//3：页面加载遮罩
function markPage(text,time){
    if(!($(".begin").length > 0)){
        $("body").prepend($("<div>").attr("class","begin"))
    }
    var timer = null;
    text = text || "页面急速加载中!";
    time = Number(time) || 3000;
    $(".begin").append($("<div>").attr("class","main-mask").css({"display":"block","background":"rgba(0,0,0,0.6)"})
        .append($("<p>").attr("class","loading").html("<br />"+text)
            .prepend($("<i>").attr("class","layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"))
        ))
    clearTimeout(timer);
    timer = setTimeout(function(){
        $(".begin").remove();
    },time);
    document.addEventListener('readystatechange',function(){
        if(document.readyState === "complete"){
            $(".begin").remove();
        }
    });
};

//tableFunc
var func = {//this = obj
    "addMsg":function () {
        var num = Number(arguments[0]) || Number(arguments[0][0]) || 1//添加messages的表格列数
            ,timeIn = Number(arguments[0][1]) || 500//动画渐入时间
            ,timeOut = Number(arguments[0][2]) || 100//动画渐出时间
            ,oData = this.data;
        if(typeof oData !== "object"){
            console.error("页面无法正常加载（参数传入错误-缺少必填项）！");
            return ;
        }
        $("td:nth-child(" + Number(num) + ")").mouseover(function (e) {
            if($("#h_tips").length <=0){
                $("body").append($("<div>").attr("id","h_tips"))
            }
            for (var i = 0; i < oData.length; i++) {
                for (var titles in oData[i]) {
                    if (oData[i][titles] === $(this).text()) {//确保当前的单元值与捕获的数据中的值对应，避免对应错误
                        $("#h_tips").html("");
                        try {
                            for (var j = 0; j < oData[i].messages.length; j++) {
                                $("#h_tips").append("<p>\n" +
                                    "        <span class=\"tip_title\">" + oData[i].messages[j].name + "</span>：<span class=\"tip_conts\">" + oData[i].messages[j].value + "</span>\n" +
                                    "    </p>")
                            }
                        } catch (e) {
                            continue;
                        }
                        e = e || window.event;
                        _x = e.pageX || e.clientX + document.body.scroolLeft;
                        _y = e.pageY || e.clientY + document.body.scrollTop;
                        //$("#tips").fadeOut(50);
                        $("#h_tips").css("left", _x + 'px').css("top", _y + 'px').fadeIn(timeIn);
                        $(this).mouseleave(function () {
                            $("#h_tips").fadeOut(timeOut).remove();
                        })
                        break;
                    }
                }
            }
        })
    },
    "addLink":function(value) {
        layui.use('table', function () {
            var table = layui.table
                ,filter = typeof value !== "string"? value[0]:value
                ,yes = typeof value !== "string"? value[1]:"确定要跳转链接吗？"
                ,no = typeof value !== "string"? value[2]:"没有可以跳转的链接。"
            table.on('tool(' + filter+ ')', function (obj) {
                var data = obj.data;
                if (obj.event === "openLink") {
                        if (data.link) {
                            layer.confirm(yes, function () {
                                location.href = data.link + "?link=" + encodeURIComponent(window.location.href);
                            });
                        } else {
                            layer.alert(no)
                        }
                }
            });
        })
    },
    "toolFunc":function(value){
        layui.use('table',function() {
            var table = layui.table,layer = layui.layer;
            table.on('tool(' + value[0] + ')', function (obj) {
                var w = document.body.clientWidth - 20
                    , h = document.body.clientHeight - 20;
                var data = obj.data;//获得当前行数据
                if (obj.event === value[1]) {//编辑
                    layer.open({
                        type: value[type] || 1,
                        title: value[title] || "详情",
                        content: value[content] || "无内容",
                        area: [w + "px", h + "px"],
                        resize: false,
                        move: false
                    });
                }
            });
        });
    }
}

function tableFunc(){
    try {
        var obj = arguments[0].obj;
        for(var name in arguments[0]){
            if(func[name]){
                func[name].call(obj,arguments[0][name]);
                console.log(name +" 已加载！");
            }
        }
    }catch (e) {
        console.error("程序遇到一个无法处理的错误！");
    }
}

//：frame通用函数
//frame_all({"back":true},{})
/*function frame_all(arg) {//obj：TABLE组件返回参数
    var obj = this;
    //判断并添加 返回 按钮
    for (var i = 0; i < arg.length; i++) {
        var aName = "",value="";
        if(typeof arg[i] === "object"){
            for(var name in arg[i]){
                aName = name;
                value = arg[i][name];
            }
        }else{
            aName = arg[i];
        }
        switch (aName) {//依照不同的参数运行不同的函数
            case "back" :
                backPage(value);
                break;//添加返回按钮
            case "table":
                tableFunc();
                break;//表格加载完毕执行函数
            case "link":
                tableClick(value);
                break;//表格点击函数
            case "message":
                addTableMessage(value);
                break;//提示信息
            case "check":
                checkTable(value);
                break;//检测表格
            case "tools":
                toolsFunc(value);
                break;
        }

    }

    //检测表格
    function checkTable(value){
        console.log(obj.data);
    }//未启用

    //返回按钮
    function backPage(value) {
        value === ""?  true : value;
        if(!value || value === "false"){
            console.log("当前页面已经禁止加载返回按钮了！")
            return ;
        }
        if(typeof value === "object"){//value: {"link":"https://www.x.com"}
            try{
                value.link
            }catch(e){
                return ;
            }
        }else{
            if (document.referrer !== 'null' || document.referrer !== "") {
                var $tool = $(".h_tool")
                if ($tool) {
                    $tool.prepend("<button class=\"layui-btn\" data-type=\"backUrl\">返回</button>\n")
                } else {
                    $("body").prepend("<div class=\"layui-row search_button\">\n" +
                        "    <div class=\"col-xs-12\">\n" +
                        "        <div class=\"test-table-reload-btn\" style=\"margin-top: 20px;\">\n" +
                        "            <button class=\"layui-btn\" data-type=\"backUrl\">返回</button>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</div>")
                }

            }//添加返回上一页按钮
        }


        //返回按钮点击事件
        $("button[data-type='backUrl']").on('click', function () {
            layer.confirm("确定返回表格信息吗？", function () {
                location.href = document.referrer;//返回上一个页面
            });
        });
    }

    function tableFunc(){

    }
    //行单击事件
    /!*function tableClick(value){
        layui.use('table',function(){
            var table = layui.table;
            table.on('tool('+value+')', function (obj) {
                var data = obj.data;
                console.log(data)
                if (obj.event === "openLink") {
                    layer.confirm("确定跳转链接吗？", function () {
                        if(data.link){
                            location.href = data.link +"?link="+ encodeURIComponent(window.location.href);
                        }else{
                            layer.alert("没有可以跳转的链接哦！")
                        }
                    });

                }
            });
        })
    }*!/

    //message提示信息 未解决问题：内容相同message会共有同列
    /!*function addTableMessage(value) {
        var num = value[0] || 1//添加messages的表格列数
            ,timeIn = Number(value[1]) || 500//动画渐入时间
            ,timeOut = Number(value[2]) || 100//动画渐出时间
            ,oData = obj.data;
        $("td:nth-child(" + Number(num) + ")").mouseover(function (e) {
            if($("#h_tips").length <=0){
                $("body").append($("<div>").attr("id","h_tips"))
            }
            for (var i = 0; i < oData.length; i++) {
                for (var titles in oData[i]) {
                    if (oData[i][titles] === $(this).text()) {//确保当前的单元值与捕获的数据中的值对应，避免对应错误
                        $("#h_tips").html("");
                        try {
                            for (var j = 0; j < oData[i].messages.length; j++) {
                                $("#h_tips").append("<p>\n" + "<span class=\"tip_title\">" + oData[i].messages[j].name + "</span>：<span class=\"tip_conts\">" + oData[i].messages[j].value + "</span>\n" + "</p>")
                            }
                        } catch (e) {
                            continue;
                        }
                        e = e || window.event;
                        _x = e.pageX || e.clientX + document.body.scroolLeft;
                        _y = e.pageY || e.clientY + document.body.scrollTop;
                        //$("#tips").fadeOut(50);
                        $("#h_tips").css("left", _x + 'px').css("top", _y + 'px').fadeIn(timeIn);
                        $(this).mouseleave(function () {
                            $("#h_tips").fadeOut(timeOut).remove();
                        })
                        break;
                    }
                }
            }
        })
    }*!/

    function toolsFunc(value){
        layui.use('table',function() {
            var table = layui.table,layer = layui.layer;
            table.on('tool(' + value[0] + ')', function (obj) {
                var w = document.body.clientWidth - 20
                    , h = document.body.clientHeight - 20;
                var data = obj.data;//获得当前行数据
                if (obj.event === value[1]) {//编辑
                    layer.open({
                        type: 2,
                        title: value[2],
                        content: value[3],
                        area: [w + "px", h + "px"],
                        resize: false,
                        move: false
                    });
                }
            });
        });
    }
}*/


