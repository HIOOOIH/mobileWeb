// 得到URL的参数
var conScroll,
	post_data=null,
    param=common.getParam(location.search),

    cityId=param.city_id,
    cityName=decodeURI(param.city_name),
    dateIn=param.date_in,
    dateOut=param.date_out,

    hotelId=param.hid,
    typeId=param.tid,
    roomId=param.rid,
    h_name=param.h_name,
    room_type=param.room_type,
    price=param.price,
    img=localStorage.getItem("img");

	post_data={
	    hotelId:hotelId,
	    cityId:cityId,
	    cityName:cityName,
	    dateIn:dateIn,
	    dateOut:dateOut
	}
$("#rprice").text(price)
//dateInListDetail(dateIn,dateOut);

// 返回相关
function back(){
	sessionStorage.removeItem("url");
	localStorage.removeItem("img");
	
	var url='detail.html?hotel_id='+hotelId+
			'&city_id='+cityId+'&city_name='+cityName+
			'&date_in='+dateIn+'&date_out='+dateOut;
	location.href=url;
}
$("#return").click(function(e){
	e.preventDefault()
	back();
})

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
scroll();
function bindEvent(){
	// 点击加 减
	var minus=$("#minus"),
		add=$("#add"),
		count=$("#count"),
		i=1,
		price=$("#rprice").text();
	minus.on("click",function(){
		i--;
		if(i<=0) {
			i=1;
			$(this).addClass("on");
			common.dialog("","您不能取消订单","确定");
			return;
		}
		add.removeClass("on");
		removeNode();
		count.val(i);
		$("#rprice").text(price*i);
		
	});
	add.on("click",function(){
		i++;
		if(i>=6) {
			i=6;
			$(this).addClass("on");
			common.dialog("","不能大于5个人哦","确定");
			return;
		}
		minus.removeClass("on");
		appendNode();
		$("#username"+i).showBtn();
		$("#card"+i).showBtn();
		count.val(i);
		$("#rprice").text(price*i);
	});

	// 添加文本框
	function appendNode(){
		var val=$("#count").val();
		var html='<ul>'
					+'<li>'
						+'<label>姓名'+i+'</label>'
						+'<input type="text" id="username'+i+'" placeholder="每间只需填写一个姓名">'
						+'<b>×</b>'
					+'</li>'
					+'<li>'
						+'<label>证件'+i+'</label>'
						+'<input type="text" id="card'+i+'" placeholder="入住人身份证号/护照号">'
						+'<b>×</b>'
					+'</li>'
				+'</ul>';
		$(html).appendTo($("#inpeo"));
		conScroll.refresh();
	}
	// 删除文本框
	function removeNode(){
		var peo=$("#inpeo");
		peo.children().last().remove();
		conScroll.refresh();
	}

	// 点击预订 
	$("#booknow").on("click",function(){
		var len=$("#closeinput input[type=text]").length;
		$("#closeinput input[type=text]").each(function(i,inp){
			var v=$(this).val();
			if(!v){
				common.dialog("","请完善您的预订信息","关闭");
				$("#booknow").removeClass("avl");
				return;
			}
			
			if(i%2!=0 && i<len-1){
				if(common.checkCard(v)) $("#booknow").addClass("avl");
				if(!common.checkCard(v)){
					common.dialog("","请填写有效的证件号码","关闭",function(){
						common.closeDialog();
						inp.value="";
						inp.focus();
						$("#booknow").removeClass("avl");
					});
					return;
				}
			}
			if(inp.id=="phone"){
				
				if(common.checkPhone(v)) {
					$("#booknow").addClass("avl");
					alert("ds")
				}
				if(!common.checkPhone(v)){
					common.dialog("","请填写有效的手机号码","关闭",function(){
						common.closeDialog();
						inp.value="";
						inp.focus();
						$("#booknow").removeClass("avl");
					});
					return;
				}
			}
			if(inp.id!="name" && inp.id!="phone"){
				post_data["username"+i]=inp.value;
				post_data["card"+i]=inp.value;
			}
			
		});
		// 传到后台的参数
		if($("#booknow").hasClass("avl")){
			post_data.price=$("#rprice").text();
			post_data.user=$("#name").val();
			post_data.phone=$("#phone").val();
			console.log(post_data)
		}
		
	})
}
bindEvent();

// 点击文本框出圆圈×号
;(function($){
	$.extend($.fn,{
		showBtn:function(){
			var _this=$(this);
			_this.on("propertychange input",function(){
				var close=_this.next();
				if(_this.val()==""){
					close.hide();
				}else{
					close.show();
				}
			})
		},
		clearInput:function(){
			$(this).on("click",function(){
				$(this).prev().val("");
				$(this).hide();
			})
			$(this).prev().val("");
			$(this).css("display","none");
		}

	})
})(Zepto);

// 对应的调用
$("#closeinput input[type=text]").each(function(){
	// 调用插件
	$(this).showBtn();
})
$("#closeinput").on("click","b",function(){
	// 调用插件
	$(this).clearInput();
})