var date = new Date()
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , day = date.getDate();

$(function () {
    layui.use(['table', 'form', 'laydate','element'], function () {
        var table = layui.table
            ,form = layui.form
            , element = layui.element
            , laydate = layui.laydate
            , today = year+ "-" + month + "-" + day//获取年-月-日
            , args_date = {
                value: today,
                format: "y-M-d"
            }
            , args_table = {
                elem: '#table'
                , page: true
                , toolbar: '#toolBar'
                , height: 'full-25'
                , title: '数据表'
                , limit: 15
                , limits: [15, 25, 35, 45, 55, 65, 75, 85, 95]
                , minWidth: 1200
                , text: {
                    none: "暂时还没有数据哦！"
                }
            }
            , tbs = addTable.table
            , das = addTable.date;


        function comp(x, y) {
            for (var name in y) {
                if (!x[name]) {
                    x[name] = y[name];
                }
            }
        }//匹配默认值

            if (Type(tbs) === "json") {
                comp(tbs, args_table);
                table.render(tbs);
            }else if(Type(tbs) === "array"){
                for(var i=0;i<tbs.length;i++){
                    if(Type(tbs[i]) === "json"){
                        comp(tbs[i], args_table);
                        table.render(tbs[i]);
                    }
                }
            }//TABLE表格创建

            if (das) {
                if(Type(das) === "json"){
                    a(das);
                }else if(Type(das) === "array"){
                    for(var j=0;j<das.length;j++){
                        a(das[j]);
                    }
                }
                function a(das){
                    comp(das, args_date);
                    if(das.range){
                        var bars = "-";
                        if(Type(das.range) === "array"){
                            bars = das.range
                        }
                        das.value = today+" "+bars+" "+today
                    }
                    laydate.render(das);
                }
            }//DATE创建


    });
});


