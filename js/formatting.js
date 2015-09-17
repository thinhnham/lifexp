// this file handles input validation and trigger the ajax call if all input fields are validated
// I used JQUERY spinner but HTML 5 has number input type which already has a spinner.
// However, it still allows user to type non-numeric values like special characters.
// computing age 

function age (){   
  var birthyr =$('#birth_year').val();    
  var dateyr = $('#date_year').val();
  var birthmo =$('#birth_month').val();    
  var datemo = $('#date_month').val();
  
  if ((isNaN(birthyr)) || (isNaN(dateyr))){alert("Please enter a valid number");}
  else{
    if((dateyr-birthyr + datemo - birthmo)< 0){//when date year is less than birth year
      $('#date_month').val(birthmo);
      $('#date_year').val(birthyr);
    }
    if (dateyr>birthyr){
    $('#age_month').val(( datemo - birthmo+12)%12);    
      if ((datemo-birthmo+12) >=12){
          $('#age_year').val(dateyr-birthyr);
      }
      else{
          $('#age_year').val(dateyr-birthyr-1);
      }
    }
  } 
}

// if input value is less than 1, subtract year by 1 or add 1 if greater than 12
function validateMonth(year,value){
  var current_year = parseInt(year.val());
  if(value > 12){
    year.val(current_year+1);
    return 1;
  }else if(value<1){
    year.val(current_year-1);
    return 12;
  }else{
    return value;
  }
}

// display alert when any invalid input value is detected
function notification(valid){
  if (valid == false){
    $('#notification').text("Please enter a number !");
}else{
  $('#notification').text("");
}
}

//determine date month and year when the user changes the age field given birth date is unchanged
function getDate(months,years){ 
  var birth_year = parseInt($('#birth_year').val());
  var birth_month = parseInt($('#birth_month').val());
  var year  = birth_year + years; //this year is correct when month > birthmonth
  var month = (birth_month + months) 
  if (month > 12){
    month %= 12;
    year += 1;
  }
  $('#date_month').val(month);
  $('#date_year').val(year);               
}
// delay 0.5s and execute Calculate = wait for the user finish typing

var caclulate_inputs = (function(){
  var counter = 0;
  return function(){
    clearTimeout(counter);
    counter = setTimeout(Calculate,500);
  }
})();

//this function waits for the user finish typing and fire the ajax call

$(document).ready($(function (){  
  //slider - initializing the slidder 
  $('#percent_slider').slider({ 
  value : 50,
  range : 'min',
  min : 1,
  max: 100,
  step:0.5,
  slide: function(event,ui){
    $('input:hidden[name=perchg]').val(1);
    $('#livepercent').html(ui.value);
    $(this).slider('value',ui.value);
    caclulate_inputs();
  }
});
//calculate the age and life expectancy when the page is first loaded
age();
Calculate();

var buttons = ["date","birth","age"];
var types= ["_month","_year"];

var valid = true;

$.each(buttons,function(index,value){
  $.each(types,function(i,type){
    //inputs from keyboard
    $('#'+value+type).keyup(function(e){
      if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)){ // if the input is a number 
        switch(type){
          case "_month":
            if(value != 'age'){
              var month = validateMonth($('#'+value+"_year"),parseInt($(this).val()));
              $(this).val(month);
              age();
            }else{
              var months = parseInt($(this).val());
              var years = parseInt($('#age_year').val());
              getDate(months,years);
              age();
            }  
            notification(true); 
            break;
          case "_year":
            if (value != 'age'){
              if (parseInt($(this).val()) >= 1900){
                notification(true);
                age();
              } 
              else{
                notification(false);
              }            
            }else{
              var years = parseInt($(this).val());
              var months =   parseInt($(age_month).val());
              if(years > 0){
                getDate(months,years);
                notification(true);
              }else{
                notification(false);
              }
            }
            break;
        }
        caclulate_inputs();
      }
      else{
        if($.inArray(e.keyCode,[8,46,13,37,38,39,40]) < 0){ //Exceptions: backspace,delete, and enter. Others are invalid.
          notification(false);
        }
      }
    });

    //input from spinner
    $('#'+value+type).spinner({         
      spin:function(e,ui){
        switch(type){
          case "_year":
            if(value != 'age'){
            if(ui.value < 1900){$(this).val(1900);}
            else{$(this).val(ui.value);}
            age();//change age when using spinner
            }
            else{
              if(ui.value < 0){
                $(this).val(0);
                $('#date_year').val(parseInt($('#birth_year').val()));
                $('#date_month').val(parseInt($('#birth_month').val()));
              }else{
                $('#date_year').val(parseInt($('#birth_year').val()) + ui.value);
                $('#date_month').val(parseInt($('#birth_month').val()));
                $(this).val(ui.value);
              }
            }
          break;
          case "_month":
            if(value != 'age'){
            month  = validateMonth($('#'+value+"_year"),ui.value);
            $(this).val(month);
            age();//change age when using spinner
            }else{
              var months =  ui.value;
              var years = parseInt($('#age_year').val());
              getDate(months,years);
              age();//let age() determine age when date_month,year are calculated
            }
          break;
        }
        Calculate();  
        return false;
      }
    });
  });
});
//if today button is clicked, set month,year = today's month and year
$('#today').on('click',function(){
 var currentYear = (new Date).getFullYear();    
 var currentMonth = (new Date).getMonth() + 1;
$('#date_year').val(currentYear);
$('#date_month').val(currentMonth);
age();
Calculate();   
});

var survival_buttons = ["survivalyears","survivaltotalyears"];

$.each(survival_buttons,function(index,type){
  var current_age = round(parseFloat($('#age_year').val())+parseFloat($('#age_month').val())/12,2);
  $('input[name='+type+']').keyup(function(e){
    var value  = parseFloat($(this).val());
    if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)){//if the input is a number 
      if(type == "survivalyears" ){
        $('input[name=survivaltotalyears]').val(current_age+value);
        $('input[name=liveyrschg]').val(1);
        caclulate_inputs();
      }else if(type =="survivaltotalyears"){
        if(value >= current_age){
          $('input[name=survivalyears]').val(round(value - current_age,2));
          $('input[name=liveyrschg]').val(1);
          caclulate_inputs();
          $('#notification').text("")
        }
        else{
          $('#notification').text('value must be greater or equal to current_age')
        }
      } 
    }else{ 
      if($.inArray(e.keyCode,[8,46,13,37,38,39,40]) < 0){
        notification(false);
      }
    }
  });
  $('input[name='+type+']').spinner({
    min:0,
    max:120,
    spin:function(e,ui){
      $(this).val(ui.value);
      if(type == "survivalyears" ){
        $('input[name=survivaltotalyears]').val(current_age+ui.value);
        $('input[name=liveyrschg]').val(1);
        Calculate();
      }else if(type =="survivaltotalyears"){
        if(ui.value >= current_age){
          $('input[name=survivalyears]').val(round(ui.value-current_age,2));
          $('input[name=liveyrschg]').val(1);
          Calculate();
        }else{
          $(this).val(current_age);
          $('input[name=survivalyears]').val(0);
        }
      }       
    }
  }); 
});

// changing GENDER will generate different outputs
$('input:radio[name=gender]').change(function(){
  Calculate();
});


//style    
$( "#percent_slider" ).css('background', '#d9edf7');
$( "#percent_slider" ).css('width',250);
$('input[name=survivalyears]').width(80);
$('input[name=survivaltotalyears]').width(80);

}));
