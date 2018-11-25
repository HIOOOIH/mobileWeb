var conScroll,
    post_data=null,
    param=common.getParam(location.search),
    cityId=param.city_id,
    cityName=decodeURI(param.city_name),
    dateIn=param.date_in,
    dateOut=param.date_out,
    name=decodeURI(param.name);

    post_data={
        cityId:cityId,
        cityName:cityName,
        dateIn:dateIn,
        dateOut:dateOut,
        name:name,
        pageNo:1,       //第几页
        pageSize:5,    //每页几个列表
        pageCount:0
    }

$("#date_in").val(dateIn);
$("#date_out").val(dateOut);
dateInListDetail(dateIn,dateOut);

function scroll(){
    var $load=$("#moretxtloader"),
        $loadIcon=$("#moretxtloader span"),
        $loadLabel=$("#moretxtloader p");
    conScroll=new iScroll("con",{
      checkDOMChanges:true,
        onBeforeScrollStart: function (e) { 
            if(e.target.nodeName!="INPUT" && e.target.nodeName!="A" 
                && e.target.nodeName!="SELECT" && e.target.nodeName!="TEXTAREA"){
                    e.preventDefault();
            }
        },
        onScrollMove:function(){
          if(this.y<this.maxScrollY){
            if(post_data.pageNo<post_data.pageCount){
              $load.show().addClass("flipUp");
              $loadIcon.show();
              $loadLabel.show().text("数据加载中...");
            }else{
              $load.show().removeClass("flipUp");
              $loadIcon.hide();
              $loadLabel.show().text("没有更多了");
            }
          }
        },
        onScrollEnd:function(){
          if($load.hasClass("flipUp")){
            $load.removeClass("flipUp").addClass("loading")
            loadPullUpData();
          }
        }
    })
}
scroll();
// 设置URL的信息
function postData(){
   $("#hotelReg").on("click","div",function(){
        var post_data,
            hotel_id=$(this).attr("class").substr(5),
            hotelName=$(this).find("h5").text(),
            dateIn=$('#date_in').val(),
            dateOut=$('#date_out').val();
            // name=$.trim($('#hotelName').val()),
            location.href='../html/detail.html?hotel_id='+hotel_id+
                    '&city_id='+cityId+
                    '&city_name='+cityName+
                    '&date_in='+$("#date_in").val()+
                    '&date_out='+$("#date_out").val();
            dateInListDetail(dateIn,dateOut);
        $(this).attr('href',url);
   });
}
postData();

/*function sendHttpFromHotel(action){
    common.access_server("../server/hotel.php",post_data,function(datas){
        if(datas.errcode=="1"){
            $("#moretxt").text("没有更多了")
        }else{
            var len=datas.result.hotel_list.length;
            $("#countRoom").text(len);
            post_data.pageCount=datas.count;
            renderToDom(datas.result,action);
        }
    });
}
sendHttpFromHotel();*/

function renderToDom(datas,action){
    var html="",
        pageNo=post_data.pageNo,
        pageSize=post_data.pageSize,
        total=datas.total;
    if(action){
      $("#hotelReg").empty();
    }
    $.each(datas.hotel_list,function(i,val){
        html+='<div class="hotel'+val.hotel_id+'">'
                 +'<dl>'
                     +'<dt><img src="'+val.image+'" alt=""></dt>'
                     +'<dd>'
                         +'<h5>'+val.name+'</h5>'
                         +'<h2>'
                             +'<span>'+val.stars+'星</span>'
                             +'<em>礼</em>'
                             +'<em class="reddot">促</em>'
                             +'<em class="bluedot">返</em>'
                         +'</h2>'
                         +'<h3>'
                             +'<span>经济型</span>'
                             +'<img src="../img/icon-wifi.png" alt="">'
                             +'<img src="../img/icon-park.png" alt="">'
                         +'</h3>'
                         +'<h4>'+val.addr+'</h4>'
                         +'<p>'
                             +'<span>¥'+val.low_price/100+'</span><em>起</em>'
                             +'<em>'+val.distance/1000+'km</em>'
                         +'</p>'
                     +'</dd>'
                 +'</dl>'
            +'</div>'
    });
    $(html).appendTo($("#hotelReg"));
    conScroll.refresh();
}

function loadPullUpData(){
  var $load=$("#moretxtloader"),
      $loadIcon=$("#moretxtloader span"),
      $loadLabel=$("#moretxtloader p");
    post_data.pageNo+=1;
  if(post_data.pageNo<=post_data.pageCount){
      sendHttpFromHotel();
          $load.hide();
          $loadIcon.hide();
          $loadLabel.hide();    
  }
  
}

function footerEvent(){
    var $hotelReg=$("#con"),
        $hotel_ft=$("#hotel_ft"),
        startFn=function(e){
            posY=e.touches[0].clientY;
        },
        moveFn=function(e){
            _offset=e.touches[0].clientY-posY;
            if(_offset<0){
                $hotel_ft.css({
                    "height":"40px",
                    "-webkit-transition":"height 0.5s ease-in-out"
                });
            }else if(_offset>=0){
                $hotel_ft.css({
                    "height":"0px",
                    "-webkit-transition":"height 0.5s ease-in-out"
                });
            }
            conScroll.refresh();   
        };
    
        $hotelReg.on("touchstart",startFn);
        $hotelReg.on("touchmove",moveFn);

    $("#hotel_ft>nav").on("click","a",function(e){
        //e.preventDefault()
        if($("#mask").length==0){
            $("body").append($("<p class='mask' id='mask'></p>"))
        }
        
        $(this).addClass("cur_item").siblings().removeClass("cur_item");
        var idx=$(this).index();
        $("#item_layer").css({
            "height":"144px",
            "-webkit-transition":"height 0.5s ease-in-out"
        }).children("div").eq(idx).addClass("cur_layer").siblings().removeClass("cur_layer");

    }); 
}
footerEvent();

function hideLayer(){
    $("#mask").remove();
    $("#item_layer").css({
        'height':0,
        '-webkit-transition':'height 0.5s ease-in-out'
    });
    $("#hotel_ft>nav>a").removeClass("cur_item")
}

/*渲染排序*/
function renderOrder(){
    var list={
        all:"不限",
        hot:"人气最高",
        priceMin:"价格最低",
        priceMax:"价格最高",
        distance:"距离最近"
    },
    htmlArr=["<ul>"],
    $list=$("#sort");
    $.each(list,function(k,v){
        htmlArr.push('<li id="'+k+'">','<a href="javascript:void(0)">','<b>'+v+'</b>',
                '<span onclick="selectSort(\''+k+'\')">','</span>','</a>','</li>');
    });
    htmlArr.push('</ul>');
    $list.html(htmlArr.join("")).find("li").eq(0).addClass("on");
}
renderOrder();

//排序复选框
function selectSort(index){
    $('#'+index).addClass('on').siblings().removeClass('on');
    index=index=='all'?-1:index;
    $("#order").val(index);
    setTimeout(hideLayer,400);
    post_data.sortType=$("#order").val();
    sendHttpFromHotel("order");
}

/*渲染品牌*/
function renderBrand(){
  var strs='';
  strs='<ul>'
  $.each(hotelBrands,function(key,val){
    strs+='<li id="brand'+key+'"><a href="javascript:void(0);">'+
          '<span onclick="selectBrand('+key+',\''+val+'\')"></span><b>'+val+'</b></a></li>';
  })
  strs+='</ul>'
  $('#brand').html(strs);
  $("#brand0").addClass("on");
}
renderBrand();

// 品牌复选框
function selectBrand(index,name){
  name=name=='不限'?-1:name;

  $('#brand'+index).addClass('on').siblings().removeClass('on');
  setTimeout(hideLayer,400);
  $('#ibrand').val(name);
  post_data.brand=$('#ibrand').val();
  
  sendHttpFromHotel("brand");
}

/*渲染价格*/
function renderPrice(){
  var strs='';
  var price={
    '0':['不限'],
    '1':['0-100',0,100],
    '2':['101-200',101,200],
    '3':['201-300',201,300],
    '4':['301-400',301,400],
    '5':['401-500',401,500],
    '6':['500以上',501]
  }
  strs='<ul>'
  $.each(price,function(key,val){
    strs+='<li id="price'+key+'"><a href="javascript:void(0);"><span onclick="selectPrice('+key+','+val[1]+','+val[2]+')"></span><b>'+val[0]+'</b></a></li>';
  })
  strs+='</ul>';
  $('#price').html(strs);
  $('#price0').addClass('on');
}
renderPrice();

// 价格复选框
function selectPrice(index,min,max){
    $('#price'+index).addClass('on').siblings().removeClass('on');
    if(index=="0"){
      min=-1;
      max=-1;
    }
    if(index=="6"){
      max=-1;
    }
    setTimeout(hideLayer,400);
    // 设置隐藏域的值
    $('#imin').val(min*100);
    $('#imax').val(max*100);
    // 将这个值添加到post_data里，传给后台
    post_data.minPrice=$('#imin').val();
    post_data.maxPrice=$('#imax').val();
    // 调用函数再次做ajax请求，渲染数据
    sendHttpFromHotel("price");
}
/*渲染星级*/
function renderStars(){
    var strs='';
    var stars={
      "0":"不限",
      "2":"二星以下/经济型",
      "3":"三星",
      "4":"四星",
      "5":"五星"
    }
    strs='<ul>'
    $.each(stars,function(key,val){
      strs+='<li id="stars'+key+'"><a href="javascript:void(0);"><span onclick="selectStar('+key+')"></span><b>'+val+'</b></a></li>';
    })
    strs+='</ul>'
    $('#star').html(strs);
    $('#stars0').addClass('on');
}
renderStars();

// 星级复选框
function selectStar(index){
  index=index==0?-1:index;
  $('#stars'+index).addClass('on').siblings().removeClass('on');
  setTimeout(hideLayer,400);
  // 设置隐藏域的值
  $('#istar').val(index);
  post_data.stars=$('#istar').val();
  sendHttpFromHotel("star");
}


