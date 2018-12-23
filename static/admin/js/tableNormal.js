var date = new Date()
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , day = date.getDate()
    , today = year+ "-" + month + "-" + day//获取年-月-日
    , time = date.getTime();

$(function () {
    layui.use(['table', 'form', 'laydate','element'], function () {
        var table = layui.table,form = layui.form, element = layui.element, laydate = layui.laydate
            , args_date = {
                elem: "#date",
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
                , id : "table"
            }
            , tbs = addTable.table//自定义表格参数
            , das = addTable.date//自定义日期选择器参数
            , fos = addTable.form//自定义表单参数-未启用
            , res = addTable.reSet;//自定义数据重载参数

        //判断是否有自定义数据(与默认数据相比)
        function comp(x, y) {
            for (var name in y) {
                if (!x[name]) {
                    x[name] = y[name];
                }
            }
        }//匹配默认值

        //默认表格渲染
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
        //默认日期选择器渲染
        if (das && das !== false) {
                if(das === true){
                    a(args_date);
                }else if(Type(das) === "json"){
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
        //表格数据重载(查询数据)
        if(res){
            var $ = layui.$,type = res.type || "search", active = {},value = {};
            active[type] = function(){
                for(var name in res.where){
                    value[name] = $(res.where[name]).val();
                }
                //执行重载
                table.reload(res.tid || args_table.id, {
                    url:res.url
                    ,where: res.where || {}
                });
                //重新绑定事件
                $(".layui-table-tool .layui-btn").on('click',function(){
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                });
            }
            //首次页面渲染后按钮事件绑定
            $(".layui-table-tool .layui-btn").on('click',function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
        }
    });
});



