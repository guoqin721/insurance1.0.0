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
    url: 'http://api.fundusd.com/v1/insurance/plans/pep?period='+ period + '&age=' + age + '&type=' + type,
    type: 'GET',
    success:function(data){
      $('.guarDetaPremium').html(data[slideStartAge].total);
      //更高预期储蓄分红内容
      $('#pre80').html(data["80"].total2);
      if ( slideStartAge == 66) {
        $('#pre65').html(0);
      } else {
        $('#pre65').html(data["65"].total2);
      }
      //判断是否小于18岁
      if (hrefArr[3] < 18) {
        $('.child').css('display','block');
      } else {
        $('.child').css('display','none');
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
        $('#zj').html(data[key].total1);
        $('#qj').html(data[key].fbz1*0.2 + 20000);
        $('#sg').html(data[key].total1);
        $('#xj').html(data[key].total2);
        $('#customerAge option').removeAttr('selected')
        $('#customerAge').val(currentPosition + slideStartAge);
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
