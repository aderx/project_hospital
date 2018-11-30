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

    //为表格页面添加message提示信息
    function addTableMessage(num,obj){
        if(num < 0){
            return ;
        }
        var oData = obj.data;
        $("td:nth-child("+num+")").mouseover(function (e) {
            for (var i = 0; i < oData.length; i++) {
                if (oData[i].messages) {
                    for (var titles in oData[i]) {
                        if (oData[i][titles] === $(this).text()) {//确保当前的单元值与捕获的数据中的值对应，避免对应错误
                            $("#tips").html("");
                            for (var j = 0; j < oData[i].messages.length; j++) {
                                $("#tips").append("<p>\n" +
                                    "        <span class=\"tip_title\">" + oData[i].messages[j].name + "</span>：<span class=\"tip_conts\">" + oData[i].messages[j].value + "</span>\n" +
                                    "    </p>")
                            }
                            e = e || window.event;
                            _x = e.pageX || e.clientX + document.body.scroolLeft;
                            _y = e.pageY || e.clientY + document.body.scrollTop;
                            $("#tips").css("left",_x+'px').css("top",_y+'px').fadeIn(500);
                            $(this).mouseleave(function(){
                                $("#tips").fadeOut(100);
                            })
                        }
                    }
                }

            }
        })
    }



