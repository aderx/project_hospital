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

//4：判断对象数据类型
function Type(value){
    if(value === undefined){
        return "undefined";
    }else if(value === null){
        return "null";
    }else if(typeof value === "object"){
        if(value instanceof Array){
            return "array";
        }else if(value instanceof Function){
            return "function";
        }else{
            try{
                var tt = typeof JSON.parse(JSON.stringify(value))
            }catch(e){
                return value.constructor;
            }
            if(tt === "object"){
                return "json"
            }
        }
    }
    else if(typeof value === "function"){
        return "function";
    }else{
        var type = typeof(value);
        return type.toLowerCase();
    }
}

function JQajax(value){
    if(!value.data || !value.url){
        return false;
    }
    var data = function(callback){
        $.ajax({
            url:value.url,
            method:value.method || "GET",
            data:value.data,
            success:callback || function(data){
                if(data.code === 0){
                    alert("提交成功！");
                }else if(data.code === 1){
                    alert("提交失败，请重试！");
                }

            }
        })
    }
   data(value.success)
}
/**
 *@todo 本地存储 localStorage
 * 为了保持统一，将sessionStorage更换为存储周期更长的localStorage
 */
//本地存储记录所有打开的窗口
function setStorageMenu(title, url, id) {
    var menu = JSON.parse(sessionStorage.getItem('menu'));
    if(menu) {
        var deep = false;
        for(var i = 0; i < menu.length; i++) {
            if(menu[i].id === id) {
                deep = true;
                menu[i].title = title;
                menu[i].url = url;
                menu[i].id = id;
                menu[i].search = $.getUrlParam('p');
            }
        }
        if(!deep) {
            menu.push({
                title: title,
                url: url,
                id: id,
                search:$.getUrlParam('p')
            })
        }
    } else {
        menu = [{
            title: title,
            url: url,
            id: id,
            search:$.getUrlParam('p')
        }]
    }
    sessionStorage.setItem('menu', JSON.stringify(menu));
}
//本地存储记录当前打开窗口
function setStorageCurMenu() {
    var curMenu = sessionStorage.getItem('curMenu');
    var text = $('.layui-tab-title').find('.layui-this').text();
    text = text.split('ဆ')[0];
    if(text === "系统主页"){
        return;
    }
    var url = $('.layui-tab-content').find('.layui-show').find('.weIframe').attr('src');
    var id = $('.layui-tab-title').find('.layui-this').attr('lay-id');
    curMenu = {
        title: text,
        url: url,
        id: id,
        search:$.getUrlParam('p')
    };
    sessionStorage.setItem('curMenu', JSON.stringify(curMenu));
}
//本地存储中移除删除的元素
function removeStorageMenu(id) {
    var menu = JSON.parse(sessionStorage.getItem('menu'));
    //var curMenu = JSON.parse(localStorage.getItem('curMenu'));
    if(menu) {
        var deep = false;
        for(var i = 0; i < menu.length; i++) {
            if(menu[i].id === id) {
                deep = true;
                menu.splice(i, 1);
            }
        }
    } else {
        return false;
    }
    sessionStorage.setItem('menu', JSON.stringify(menu));
}

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
                ,filter = Type(value) !== "string"? value[0]:value
                ,yes = Type(value) !== "string"? value[1]:"确定要跳转链接吗？"
                ,no = Type(value) !== "string"? value[2]:"没有可以跳转的链接。"
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
        if(Type(value) === "json"){
            cc(value);
        }else if(Type(value) === "array"){
            for(var i=0;i<value.length;i++){
                (function(i){
                    cc(value[i]);
                })(i)
            }
        }else{
            console.error("toolFunc函数参数填写错误！");
            return ;
        }
        function cc(vas){
            layui.use('table',function() {
                var table = layui.table,layer = layui.layer,filt = vas.filter || "table1",tool = vas.tool || "tool";
                table.on(''+tool+'(' + filt + ')', function (obj) {
                    console.log(22);
                    var w = document.body.clientWidth - 20
                        , h = document.body.clientHeight - 20;
                    var data = obj.data;//获得当前行数据
                    if (obj.event === vas.event) {//弹出窗口
                        layer.open({
                            type: vas.type || 1,
                            title: vas.title || "详情",
                            content: vas.content || "无内容",
                            area: vas.area || [w + "px", h + "px"],
                            resize: vas.resize || false,
                            move: vas.move || false
                        });
                    }
                });
            });
        }
    },
    "tableBtn":function(vas){
        layui.use('table',function() {
            var table = layui.table,layer = layui.layer,filt = vas.filter || "table1",event = vas.event || "dataSearch",id = vas.tool || "hideXs";
            table.on('toolbar(' + filt + ')', function (obj) {
                var w = document.body.clientWidth - 20
                    , h = document.body.clientHeight - 20;
                var data = obj.data;//获得当前行数据
                if (obj.event === vas.event) {//弹出窗口
                    layer.open({
                        type: vas.type || 1,
                        title: vas.title || "详细查找",
                        content: vas.content || $('#'+id),
                        area: vas.area || [w + "px", h + "px"],
                        resize: vas.resize || false,
                        move: vas.move || false
                    });
                }
            });
        });
    }
}

function tableFunc(){
    if(Type(arguments) === "json"){
        var obj = arguments[0].obj;
        for(var name in arguments[0]){
            if(func[name]){
                func[name].call(obj,arguments[0][name]);
                console.log(name +" 已加载！");
            }
        }
    }else{
        console.error("tableFunc参数填写错误")
    }
}