/*
   公用的JS文件
*/
function Common(){
  // 获取地址栏中的参数
    this.getParam=function(url){
	    var obj={},arr,paramArr;
	    if(url){
	        url=url.substr(1);
	        // city_id=28 & city_name=北京 & date_id=2015-12-10 
	        arr=url.split('&');
	        //["city_id=28", "city_name=%E5%8C%97%E4%BA%AC"]
	        for(var i=0;i<arr.length;i++){
	            paramArr=arr[i].split("=");
	            obj[paramArr[0]]=decodeURI(paramArr[1]);
	        }
	        return obj;
	    }else{
	        return false;
	    }
    }
   /*this.getParam=function(name){
      var url=location.search;
      if(url){
         url=url.substr(1);
         var reg=new RegExp('&?'+name+'='+'([^&]+)');     // 定界符 当正则中出现变量的时候，不能使用定界符，只能使用new RegExp
         var result=url.match(reg);
         if(result){
            return decodeURI(result[1]);
         }else{
         	return false;
         }
      }else{
      	 return false;
      }
   }*/
    //ajax—get调取方法
    this.access_server=function(url,data,successFn){
    	var self=this;
     	async=typeof(async)==='undefined'?true:async;
     	// 显示加载动画
     	this.showLoading();
  		$.ajax({
  			url:url,
  			type:"get",
  			data:data,	
  			dataType:"json",
  			async:true,
  			success:function(result){
  				self.removeLoading();
  				successFn && successFn(result);
  			},
  			error:function(){
  				if(typeof(errorFn)=="function"){
  				   errorFn();
  				}else{
  				   self.warning('请求失败，请<a href="location.reload()">刷新/重试!</a>');
  				}
  			}
  		})
    },
    // 显示加载动画
    this.showLoading=function(){
       if($('#ui-id-mark').length==0){
          $('<div class="ui-id-mark" id="ui-id-mark"></div>').appendTo($('body'));
       }
       if($('#ui-id-loading').length==0){
          var $loading=$('<div class="ui-id-loading"><img></div>');
          $loading.attr('id','ui-id-loading').appendTo($('body'));
          $loading.children('img').attr('src','../img/loading.gif');
       }
    }
    //删除加载动画, 移除弹框
    this.removeLoading=function(){
   		$("#ui-id-loading").remove();
   		$('#ui-id-mark') && ($('#ui-id-mark').remove());
      $('#ui-id-dialog') && ($('#ui-id-dialog').remove());
    },
    // 弹框
    this.warning=function(msg){
    	var self=this;
    	var title='<h2></h2>';
    	var content=msg;
    	var btn='<a href="javascript:void(0)" id="done">确认</a>';
    	this.dialog(title,content,btn);
    	if($("#done").length){
    		$("#done").click(function(){
            self.removeLoading()
    		})
    	}
    }
    //关闭弹框
    this.closeDialog=function(){
      if($('#ui-id-mark').length>0) $('#ui-id-mark').remove();
      if($('#ui-id-dialog').length>0) $('#ui-id-dialog').remove();
    }
    //显示弹框
    this.dialog=function(tit,con,btn,callback){
      	if($("#ui-id-mark").length==0){
      		var mark=$("<div></div>");
      		mark.addClass("ui-id-mark").attr("id","ui-id-mark").appendTo($("body"));
      	}
      	if($("#ui-id-dialog").length==0){
      		var dialog=$("<div></div>");
      		var html='<div class="tipcontainer">'+tit+'<div class="content">'
      				+con+'</div><div class="btns">'+btn+'</div></div>';
      		dialog.addClass("ui-id-dialog").attr("id","ui-id-dialog").html(html).appendTo($("body"));
      	}
        
        if(callback){
            $(".btns").on("click",callback);
        }else{
            $(".btns").on("click",this.closeDialog);
        }
    }
    /*
      验证手机号
    */
    this.checkPhone=function(val){
      var reg=/^1[358]\d{9}/;
      if(val){
          return reg.test(val);
      }
      return false;
    }
    // 身份证 
    this.checkCard=function(val){
      var reg=/^\d{17}(X|[0-9])$/;
      if(val){
          return reg.test(val);
      }
      return false;
    }
    // 邮箱
    this.checkEmail=function(val){
      var reg=/^\w+\.?@[a-z0-9]+\.(com|cn|net|com.cn|org|edu)$/;
      if(val){
          return reg.test(val);
      }
      return false;
    }
    // 网址
    this.checkUrl=function(val){
      var reg=/^http(s)?:\/\/(www\.)?[a-z0-9]+\.(com|cn|net|com.cn|org|edu)\/?([a-z0-9]+)*\/?([a-z0-9]+\.[a-z]+)?$/;
      if(val){
          return reg.test(val);
      }
      return false;
    }
    // 密码
    this.checkPwd=function(val){
      var reg=/^\w{5,12}$/;
      if(val){
          return reg.test(val);
      }
      return false;
    }
    // 代码
    this.checkCode=function(code){
      if(code){
          var reg=/^\d{4}$/;
          return reg.test(code);
      }
      return false;
    }
}
var common=new Common();


/*
 日期和日历：calendar
*/

function get_date(i,option){
	//  option是一个对象，
	option=option?new Date(option.year,option.month-1,option.day):new Date();
 	//  i是天数,如果i存在转换为毫秒，否则用0
	i=i?i*86400*1000:0;
	// 获取当前日期
	var	targetDate=new Date(),	   // 目标日期
	    targetTime=option*1+i,    // now.getTime()
	    month,day;
	    // 将targetTime设为当前日期
	    targetDate.setTime(targetTime);
	    month=targetDate.getMonth()+1;
	    day=targetDate.getDate();

	    if(month<10)month='0'+month;
	    if(day<10) day='0'+day;

	    return targetDate.getFullYear()+'-'+month+'-'+day;
}

// 显示日历
function showCalendar(ele,beginDate,maxDate,pageType){
	ele.calendar({
	    minDate:beginDate,
	    maxDate:maxDate,
	    swipeable:true,
	    hide:function(){
	        // 日历隐藏时执行的回调函数
	        changeDateOut(pageType);
	    }
	}).calendar("show");

    $('.shadow').remove();
    $('.ui-slideup-wrap').addClass('calenderbox');
    var shadow=$('<span class="shadow"></span>');
    $('.calenderbox').append(shadow);
    $('.ui-slideup').addClass('calender');
}

function changeDateOut(pageType){
	var dateIn=$("#date_in").val(),
		dateOut=$("#date_out").val(),
		numIn=numberDate($("#date_in").val()),
		numOut=numberDate($("#date_out").val()),
		arr=dateToArr(dateIn),
		newDateOut=dateOut;
		
	if(numIn>=numOut){
		newDateOut=get_date(1,{year:arr[0],month:arr[1],day:arr[2]});
	}
	$("#date_out").val(newDateOut);

	//如果不是首页
	if(pageType){
		dateInListDetail(dateIn,newDateOut);
		post_data.dateIn=dateIn;
		post_data.dateOut=newDateOut;
		
		//若是列表页，调用http请求，因为页面的内容随日期改变而改变
		if(pageType=='list'){
			  sendHttpFromHotel("revert");
		}else if(pageType=='detail'){
        seHtttpFromDetail("revert");
		}
	}
}	
function numberDate(val){
	return val.replace(/-/g,"");
}
function dateToArr(num){
	return num.split("-");
}
function removeYear(date){
	var arr=date.split('-'),
		mon=arr[1].charAt(0)=='0'?arr[1].charAt(1):arr[1],
		day=arr[2].charAt(0)=='0'?arr[2].charAt(1):arr[2];
	return mon+'月'+day+'日';
}

//列表页和内容页面的日期
function dateInListDetail(dateIn,dateOut){
	var emIn=$("#in_ch"),
		emOut=$("#out_ch"),
		dIn=removeYear(dateIn),
		dOut=removeYear(dateOut);

	emIn.text(dIn);
	emOut.text(dOut);
}

//点击修改，调日历
$("#change").on('click',function(){
    var type=$(this).attr("type"),
		now=new Date(),
	    beginDate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
	    maxDate=new Date(now.getFullYear(),now.getMonth(),now.getDate()+90);
    
    showCalendar($("#date_in"),beginDate,maxDate,type);
});

// 判断用户是否登录了
function ifLogined(url){
    var checkLogin=function(data){
        //如果登录成功
        if(data.if_logined=='1'){
           location.href=url;
        }else{
          sessionStorage.setItem("url",url);
          location.href='login.html';
        }
    }
    common.access_server("../server/check.php",{},checkLogin);

}
