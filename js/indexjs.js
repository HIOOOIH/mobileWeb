;(function($){
	var index=function(){
		var setStroage=function(){
			var $cityName=$("#city_name"),
				$cityId=$("#city_id"),
			    ls=window.localStorage;
	
			//获取地址栏的信息
			var paramURL=common.getParam(location.search);
			if(!paramURL){
				$cityName.text("北京");
				$cityId.val("28");
				ls.setItem("city_name","北京");
				ls.setItem("city_id","28")
			}else{
				$cityName.text(paramURL.city_name);
				$cityId.val(paramURL.city_id);
				ls.setItem("city_name",paramURL.city_name);
				ls.setItem("city_id",paramURL.city_id)
			}
		},
		// 日历
		calendar=function(){
		    // 显示入住和离店日期
		    var $dateIn=$('#date_in'),
		        $dateOut=$('#date_out'),
		        today=new Date(),
		        count=1,
		        beginDate,maxDate;

		    $dateIn.val(get_date());
		    $dateOut.val(get_date(1));

		    // 文本框激活时调用calendar组件
		    $dateIn.on('focus',function(){
		        //调用对象 起始日期、最大日期
		        beginDate=new Date(today.getFullYear(),today.getMonth(),today.getDate());
		        maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
		        // 调用showCalendar方法，显示日历
		        showCalendar($(this),beginDate,maxDate);
		    })

		    $dateOut.on('focus',function(){
		        //调用对象 起始日期、最大日期
		        beginDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
		        maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+91);
		        // 调用showCalendar方法，显示日历
		        showCalendar($(this),beginDate,maxDate);
		    })
		},
		// 酒店搜索
	    searchHotel=function(){
	    	$('#search').on('click',function(){
		        // 获取所有的参数信息
		        var post_data,
		            cityId=$('#city_id').val(),
		            cityName=$('#city_name').text(),
		            dateIn=$('#date_in').val(),
		            dateOut=$('#date_out').val(),
		            name=$.trim($('#hotelName').val()),
		            url="html/regHotel.html?city_id="+cityId+'&city_name='+encodeURI(cityName)+'&date_in='+dateIn+'&date_out='+dateOut+'&name='+name;
		        $(this).attr('href',url);
	    	})
	    }
		return {
			homePage:function(){
				setStroage();
				calendar();
				searchHotel();
			}
			
		}
	}();
	window.index=index;
})(Zepto);