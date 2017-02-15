$(function(){
  //customerInfo
  var _href = window.location.href;
  var _hrefArr = _href.split('?')[1].split('&');
  var hrefArr = [];
  var dataKey = [];
  var currentPosition = 0;
  var percent = 0;
  var slider = $("#spanSlide").get(0);
  var sliderDiv = $("#sliderDiv").get(0);
  var sliderBox = $("#slider").get(0);
    //对应数轴数的百分比
  var percentPer = 1 / ((sliderBox.offsetWidth - slider.offsetWidth) / sliderBox.offsetWidth) ;
  _hrefArr.forEach(function(c){
    c = c.split("=")[1]
    hrefArr.push(decodeURIComponent(c));
  });
  $('.customerSex').html(hrefArr[0]);
  $('.customerSmoke').html(hrefArr[1]);
  $('.customerAge').html(hrefArr[3] + '周岁');
  $('.guarDetaAges').html(hrefArr[2]);
  var insurance = hrefArr[4];
  var coverAge = hrefArr[5];
  var age = parseInt(hrefArr[3]);
  var period = parseInt(hrefArr[2]);
  var type = '';
  var ytpeSmoke = '';
  var typeSex = '';
  if (hrefArr[0] == "女") {
    typeSex = "F";
  } else {
    typeSex = "M";
  }
  if (hrefArr[1] == "吸烟") {
    ytpeSmoke = "Y";
  } else {
    ytpeSmoke = "N";
  }
  type  = typeSex + ytpeSmoke;

  //title改变
  if(insurance == "pep") {
    $('.companyInfo').html('友邦加裕倍安保加强版');
    $('title').html('友邦加裕倍安保加强版');
  } else if (insurance == "pe") {
    $('.companyInfo').html('友邦加裕倍安保');
    $('title').html('友邦加裕倍安保');
  } else if (insurance == "bpp2") {
    $('.companyInfo').html('友邦充裕未来储蓄计划');
    $('title').html('友邦充裕未来储蓄计划');
  } else if (insurance == "egs") {
    $('.companyInfo').html('保诚隽升储蓄计划');
    $('title').html('保诚隽升储蓄计划');
  }  else {
    $('.companyInfo').html('安盛安进储蓄计划');
    $('title').html('安盛安进储蓄计划');
  }
  //下拉年龄
  var slideStartAge = parseInt(hrefArr[3]) + 1 ;
  var slideStartYears = 0;
  var slideStartTimes = 99 - parseInt(hrefArr[3]);
  var slideCurrent = slideStartAge;
  var slideOption = $('#customerAge option').clone(false);
  var slideOptionDom = "";
  $('#customerAge').empty();
  for(var i = slideStartAge; i <= 100; i++){
    slideOptionDom = slideOption.clone(false);
    slideOptionDom.val(i);
    slideOptionDom.html(i);
    $('#customerAge').append(slideOptionDom);
  }
  //slide的宽度

  $.ajax({
    url: 'http://api.fundusd.com/v1/insurance/plans/'+ insurance + '?period='+ period + '&age=' + age + '&type=' + type + '&coverage=' + coverAge ,
    type: 'GET',
    success:function(data){
      if (insurance !== "pep" & insurance !== "pe") {
        $('.guarDetaPremium').html(data[slideStartAge].money);
      } else {
        $('.guarDetaPremium').html(data[slideStartAge].total);
      }
      //判断是否小于18岁
      if (hrefArr[3] < 18) {
        $('.child').css('display','block');
      } else {
        $('.child').css('display','none');
      }
      //如果是加裕倍安保非加强版
      if (insurance == "pep") {
        $('.pep').css('display','block');
      } else {
        $('.pep').css('display','none');
      }

      //储蓄险的颜色
      if(insurance !== "pep" & insurance !== "pe") {
        $('.slideDown').css('display','none');
        $('.planbook').css('backgroundColor','#ff8f8f');
        $('.tele').css('background','#68bdf2');
        $('.footerTip').css('background','#ff8f8f');
        $('.guarantee1').css('display','none');
        $('.totalPrem').html('总保费');
        $('.sgpcbz').html('身故赔偿保证金额');
        $('.sgpczje').html('身故赔偿总金额');
        $('.xjjzbz').html('现金价值保证金额');
        $('.xjjzzje').html('现金价值总金额');
        $('.guarDetaCoverage').html(period * coverAge * 10000);
      }else{
        $('.guarantee2').css('display','none');
      }

      for(var key in data){
        dataKey.push(key);
      }
      slideStartYears = dataKey.length - 1;
      dataChange(data);
      addReduce(slideStartYears,data);
      drag(data);
      //改变下拉数字
      $('#customerAge').on('change',function(){
        currentPosition = $(this).val() - slideStartAge;
        slidePosition(currentPosition,data);
      })
    },
    error:function(){
        console.log("error");
    }
  });


  //加减滑块位置
  function addReduce (lengthNum,data) {
    var speed = 100 / lengthNum;
    //点击加号右滑
    $('.controller_bar_2').click(function(){
      if (percent < 100) {
        currentPosition++;
      } else {
        currentPosition = slideStartTimes;
      };
      slidePosition(currentPosition,data)
    })
    $('.controller_bar_1').click(function(){
      if (percent > 0) {
        currentPosition --;
      }else {
        currentPosition =  0;
      };
      slidePosition(currentPosition,data)
    });
  }

  function slidePosition(currentPosition,data) {
    var speed = 100 / slideStartTimes;
    percent = currentPosition * speed;
    percentPo = percent / percentPer;
    $('.ui-slider-range').css('width',percentPo + "%");
    $('.ui-slider-handle').css('left',percentPo + "%");
    dataChange(data);
  }


  //滑块变化数变,被保人你年龄变,数变
  //在IOS上存在问题
  function dataChange(data) {
    for (var key in data) {
      if (key == dataKey[currentPosition]) {
        $('#customerAge option').removeAttr('selected')
        $('#customerAge').val(currentPosition + slideStartAge);
        if(insurance !== "pep" & insurance !== "pe") {
          $('#zj').html(data[key].bz2);
          $('#qj').html(data[key].total);
          $('#sg').html(data[key].bz1);
          $('#xj').html(data[key].total1);
        }else{
          $('#zj').html(data[key].total1);
          $('#qj').html(data[key].fbz1*0.2 + 20000);
          $('#sg').html(data[key].total1);
          $('#xj').html(data[key].total2);
        }
      }
    }
  }

  //拖动滑块
  function drag(data) {
    slider.addEventListener('touchstart',function(event){
      var touch = event.targetTouches[0];
      var pos = slider.offsetLeft;
      startX = touch.pageX;
      slider.addEventListener('touchmove', function(evt) {
        var percent = 0;
        var touch2 = evt.targetTouches[0];
        endX = touch2.pageX;
        var X = pos + (endX - startX);
        if(X < 0) {
          X = 0;
        }
        if(X > sliderBox.offsetWidth - slider.offsetWidth) {
          X = sliderBox.offsetWidth - slider.offsetWidth;
        }
        percent = X / sliderBox.offsetWidth * 100;
        percentSlide = percent /100 * percentPer;
        console.log(percentPer);
        slider.style.left = percent + '%';
        sliderDiv.style.width = percent + '%';
        currentPosition = parseInt(slideStartTimes * percentSlide);
      //  console.log(currentPosition);
          dataChange(data);

      },false);
      document.addEventListener('touchend',function(event){

      },false);
    },false);
  };

});
