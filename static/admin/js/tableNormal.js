$(function () {
    layui.use(['table', 'form', 'laydate','element'], function () {
        var table = layui.table
            , element = layui.element
            , laydate = layui.laydate// 初始化
            , date = new Date()
            , today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()//获取年-月-日
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
        }

            if (tbs && tbs.cols) {
                comp(tbs, args_table);
                table.render(tbs);
            }else{
                for(var i=0;i<tbs.length;i++){
                    console.log(tbs[i].cols);
                    if(tbs[i].cols){
                        comp(tbs[i], args_table);
                        table.render(tbs[i]);
                    }
                }
            }
            if (das && das.elem) {
                comp(das, args_date);
                if(das.range){
                    var bars = "-";
                    if(typeof  das.range === "string"){
                        bars = das.range
                    }
                    das.value = today+" "+bars+" "+today
                }
                laydate.render(das);
            }


    });
});


