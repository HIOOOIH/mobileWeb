;(function($){
    var city=function(){
        var data=null;//,conScroll=null;
        var arr=["A","B","C","D","E","F","G","H","I","G","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        var renderCity=function(data){
            var html="";
            $.each(data,function(key,val){
                html+='<li>'
                        +'<a href="../index.html?city_id='+key+'&city_name='+encodeURI(val)+'">'+val+'</a>'
                    +'</li>';
            });
            $(html).appendTo($("#hotUl"))
            //conScroll.refresh();
        },
        renderE=function(){
            var $num=$("#az"),html="";
            $.each(arr,function(i,obj){
                html+='<li><a href="#'+obj+'">'+obj+'</a></li>';
            });
            $num.html(html);
            //conScroll.refresh();
        },
        renderTo=function(){
            var $city=$("#city");
            var uls=$city.find("ul"),html2="";
            $.each(arr,function(k,v){
                html2+='<div id="'+v+'"><h1>'+v+'</h1><ul>';
                $.each(CITIES,function(i,obj){
                    if(obj[1].substr(0,1)==v){
                        html2+='<li><a href="../index.html?city_id='+i+'&city_name='+encodeURI(obj[0])+'">'+obj[0]+'</a></li>';
                    }
                });
                html2+='</ul></div>';
            });
            $city.html(html2);
            //conScroll.refresh();
        },
        scroll=function(){
            conScroll=new iScroll("con",{
              onBeforeScrollStart: function (e) { 
                if(e.target.nodeName!="INPUT" && e.target.nodeName!="A" 
                  && e.target.nodeName!="SELECT" && e.target.nodeName!="TEXTAREA"){
                    e.preventDefault();
                }
              }
            })
        },
        bindEvent=function(){
            var ls=window.localStorage;
            $("#cur_city").text(decodeURI(ls.getItem("city_name")));
            $("#return").attr("href",'../index.html?city_id='+
                    ls.getItem("city_id")+'&city_name='+encodeURI(ls.getItem("city_name")));
            // 添加点击选中框
            $("#curCity").on("click","em",function(){
                if($(this).hasClass("on")){
                    $(this).removeClass("on");
                }else{
                    $(this).addClass("on");
                }
            })
        }
        return {
            renderDom:function(){
                renderE();
                renderTo();
                scroll();
                bindEvent();
            }
        }
    }()
    window.city=city;
})(Zepto);
