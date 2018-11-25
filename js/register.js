;(function($){
	var register=function(){
		var testCode;
		var checkInput=function(){
			var phone=$.trim($("#phone").val()),
				//检测手机号码
				telTrim=phone.replace(/\D/,"");
				pwd=$.trim($("#password").val()),
				code=$.trim($("#code").val()),
				isRead=$("#isread").val(),
				reg_btn=$("#reg_btn");

				$("#phone").val(telTrim);
			if(phone && pwd && code && isRead=="1"){
				reg_btn.addClass("reg_active");
			}else{
				reg_btn.removeClass("reg_active");
			}
		},
		// 密码的开关
		swipeBtn=function(){
			var round=$(this).children('span');
			if($(this).hasClass('pwd_on')){
		        $(this).removeClass('pwd_on');
		      	$('#password').attr('type','password');
		      	round.css({
		      		'-webkit-transition':'-webkit-transform 0.3s linear',
		      		'-webkit-transform':'translate3d(48px,0,0)'
		      	})
		    }else{
		    	$(this).addClass("pwd_on");
		    	$('#password').attr('type','text');
				round.css({
			   	  	'-webkit-transition':'-webkit-transform 0.3s linear',
			   	  	'-webkit-transform':'translate3d(1px,0,0)'
			   	})
		    }
		},
		// 获取验证码
		getCode=function(){
			var phone=$.trim($("#phone").val());
			if(!common.checkPhone(phone)) {
				common.dialog("","请输入正确的手机号码","确定",function(){
					common.closeDialog();
					$("#phone").val("").focus();
				});
				return;
			}
			var time=10,
				timer=null,
				$getCode=$("#getcode");
				$getCode.off("click",getCode);
				// 倒计时
			    timer=setInterval(function(){
			    	time--;
			        if(time<=0){
			          clearInterval(timer);
			          $getCode.text('获取验证码');
			          times=10;
			          $getCode.on('click',getCode);
			          $getCode.removeClass('off');
			        }else{
			          $getCode.text(time+'秒后重试');
			          $getCode.addClass('off');
			        }
			    },1000);
			common.access_server("../server/register.php",{"phone":phone},function(data){
				var data=data.result;
				if(data.errcode=="2"){
					common.dialog("",data.risg,"关闭");
				}else if(data.errcode=="1"){
					common.dialog("",data.risg,"登录",function(){
						common.closeDialog();
						location.href="login.html"
					});
				}else{
					testCode=data.risg;
				}
			});
		},
		isRead=function(){
			var read=$("#isread");
			if(!$(this).hasClass("checks")){
				$(this).addClass("checks");
				read.val("1");
			}else{
				$(this).removeClass("checks");
				read.val("0");
			}
			checkInput();
		},
		checkAll=function(e){
			e.preventDefault();
			if(!$(this).hasClass("reg_active")) return;
			var phone=$.trim($("#phone").val()),
				pwd=$.trim($("#password").val()),
				code=$.trim($("#code").val()),
				isRead=$("#isready").val();
			if(!common.checkPhone(phone)){
				common.dialog("","手机号码有误","关闭",function(){
					common.closeDialog();
					$("#phone").val("").focus();
				});
				return;
			}
			if(!common.checkPwd(pwd)){
				common.dialog("","密码在5-12位的字母数字下划线","关闭",function(){
					common.closeDialog();
					$("#password").val("").focus();
				});
				return;
			}
			if(!common.checkCode(code)){
				common.dialog("","验证码是4位数字","关闭",function(){
					common.closeDialog();
					$("#code").val("").focus();
				});
				return;
			}
			if(code!=testCode){
				common.dialog("","验证码有误","关闭");
				return;
			}
			common.access_server("../server/registersubmit.php",{"phone":phone,"password":pwd},function(data){
				if(data.result.errcode==0){
					location.href="login.html"
				}else{
					common.dialog("","注册失败","关闭")
				}
			})
		},
		bindEvent=function(){
			$("#phone").on("propertychange input",checkInput);
			$("#password").on("propertychange input",checkInput);
			$("#code").on("propertychange input",checkInput);

			$("#pwd_on_off").on("click",swipeBtn);
			$("#getcode").on("click",getCode);
			$("#read>span").on("click",isRead);
			$("#reg_btn").on("click",checkAll);			//点击立即注册
		}
		return {
			userRegister:function(){
				bindEvent();
			}
		}
	}();
	window.register=register;
})(Zepto);