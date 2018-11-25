var conScroll,
    post_data=null,
    param=common.getParam(location.search),
    cityId=param.city_id,
    cityName=decodeURI(param.city_name),
    hotelId=param.hotel_id,
    dateIn=param.date_in,
    dateOut=param.date_out,
    stars=["","","二星/经济型","三星","四星","五星"];

post_data={
    hotelId:hotelId,
    cityId:cityId,
    cityName:cityName,
    dateIn:dateIn,
    dateOut:dateOut
}


$("#date_in").val(dateIn);
$("#date_out").val(dateOut);
dateInListDetail(dateIn,dateOut);

function scroll(){
    conScroll=new iScroll("con",{
        onBeforeScrollStart: function (e) { 
            if(e.target.nodeName!="INPUT" && e.target.nodeName!="A" 
                && e.target.nodeName!="SELECT" && e.target.nodeName!="TEXTAREA"){
                    e.preventDefault();
            }
        }
    })
}

function bindEvent(){
    //切换基本信息和酒店介绍
    $("#twobtn").on("click","span",function(){
        var i=$(this).index();
        $(this).addClass("blue").siblings().removeClass("blue");
        $("#detit>div").eq(i).show().siblings().hide();
    });
    //点击显示更多
    $(".hotel_btn").click(function(e){
        e.preventDefault();
        var ptext=$(this).prev();
       
        if($(this).text()=="展开显示更多"){
            ptext.css({
                "height":"auto",
                "-webkit-transition":"height 0.4s ease-in"
            });
            $(this).text("收起")
        }else{
            ptext.css({
                "height":"4rem",
                "-webkit-transition":"height 0.4s ease-in"
            });
            $(this).text("展开显示更多")
        }
        conScroll.refresh();
    });
    //点击预订房间出底部弹框
    $("#room").on("click","h4",function(){
        //设置房型的id、床、图片、价格、房型的名字，传值用
        var btn=$(this);
        $("#type_id").val(btn.data("type"));
        $("#room_id").val(btn.data("room"));
        $("#img").val(btn.data("img"));
        $("#price").val(btn.data("price"));
        $("#room_type").val(btn.data("roomtype"));

        if(btn.hasClass("grey")){
            $("#de_ft").css({
                "height":"0rem",
                "-webkit-transition":"height 0.5s ease-in"
            });
            $("#de_sh").remove();
        }else{
            $("#de_ft").css({
                "height":"32rem",
                "-webkit-transition":"height 0.5s ease-in"
            });
            $("body").append("<div class='shadow' id='de_sh'></div>")
        }
    });
    //close
    $("#de_close").click(function(){
        $("#de_ft").css({
            "height":"0rem",
            "-webkit-transition":"height 0.5s ease-in"
        });
        $("#de_sh").remove();
    });
    //to register
    $("#de_btn").click(function(){
        if($(this).hasClass("grey")) return;
        //ifLogined(getURL());
        location.href = "./login.html";
    });
}

function getURL(){
    var date_in=$("#date_in").val(),
        date_out=$("#date_out").val(),
        type_id=$("#type_id").val(),
        room_id=$("#room_id").val(),
        hotel_name=$("#hotel_name").val(),
        room_type=$("#room_type").val(),
        price=$("#price").val(),
        img=$("#img").val();
        localStorage.setItem("img",img);    // 因为图片路径里面有/，所以URL不要传

    var url='order.html?city_id='+cityId+'&city_name='+encodeURI(cityName)+
            '&date_in='+date_in+'&date_out='+date_out+
            '&hid='+hotelId+'&tid='+type_id+'&rid='+room_id+
            '&h_name='+encodeURI(hotel_name)+'&room_type='+encodeURI(room_type)+
            '&price='+price;
    return url;
}
function setReturnURL(){
    // 获取所有的参数信息
    url='regHotel.html?city_id='+cityId+
        '&city_name='+cityName+
        '&date_in='+dateIn+
        '&date_out='+dateOut;

    $('#return').attr('href',url);
}



setReturnURL();
bindEvent();
scroll();