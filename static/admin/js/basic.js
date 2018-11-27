/*
* basic.js 页面的基本函数集合,放置于页面顶部，JQ下方
* */

//获取当前页面的URL属性值，接收参数name：属性名，如果有对应属性值则返回属性值否则返回 null

    (function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
                ,r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        };
    })(jQuery);


