$(function(){
    layui.use(['table','form','laydate'], function () {
        var table = layui.table
            ,laydate = layui.laydate
            ,addTable = {}// 初始化
            ,date = new Date()
            ,today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();//获取年-月-日
            ,args_date= {
                value: today,
                format:"y-M-d"
            }
            ,args_table = {
            elem: '#table'
            , page: true
            , toolbar: '#toolBar'
            , height: 'full-25'
            , title: '数据表'
            , limit: 15
            , limits:[15,25,35,45,55,65,75,85,95]
            , minWidth:1200
            , text:{
                none: "暂时还没有数据哦！"
            }
        }
            ,tbs = addTable.table
            ,das = addTable.date;



        function comp(x,y){
            for(var name in y){
                if(!x[name]){
                    x[name] = y[name];
                }
            }
        }
        
        try{
            if(tbs.cols){
                comp(tbs,args_table);
                table.render(tbs);
            }
            if(das.elem){
                comp(das,args_date);
                laydate.render(das);
            }
        }catch (e) {
            
        }
        
    });
});


