;(function($){
	var login=function(){
		var checkInput=function(){
			var phone=$.trim($("#phone").val()),
				pwd=$.trim($("#password").val()),
				pNum=phone.replace(/\D/, ''),
				login=$("#login");
			//only allow number
			$("#phone").val(pNum);
			if($("#phone").val().length>0 && pwd.length>0){
				login.addClass("reg_active");
			}else{
				login.removeClass("reg_active");
			}
		},
		checkLogin=function(){
			if($(this).hasClass("reg_active")){
				var phone=$.trim($("#phone").val()),
					pwd=$.trim($("#password").val());
				if(!common.checkPhone(phone)){
					common.dialog("","手机号码格式有误","确定");
					return;
				}
				if(!common.checkPwd(pwd)){
					common.dialog("","请输入5-12位的密码","确定");
					return;
				}
				/*common.access_server("../server/checkuser.php",{"phone":phone,"pwd":pwd},function(data){
					if(data.code==1){
						common.dialog("",data.msg,"立即注册",function(){
							common.closeDialog();
							location.href="register.html";
						})
					}else if(data.code==2){
						common.dialog("",data.msg,"确定",function(){
							common.closeDialog();
							$("#password").val("");
						})
					}else{
						//location.href=sessionStorage.getItem("url");
					}
				})*/
				location.href="./order.html";
			}
		},
		bindEvent=function(){
			$("#phone").on("propertychange input",checkInput);
			$("#password").on("propertychange input",checkInput);
			$("#login").on('click',checkLogin);
		}
		return {
			userLogin:function(){
				bindEvent();
			}
		}
	}();
	window.login=login;
})(Zepto);