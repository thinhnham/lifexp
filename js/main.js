var Pro_age = [];
var hAxis=[];  


function Calculate(){
    var information = {
    'sex': $('input:radio[name=gender]:checked').val(), 
    'ageyr' :$('#age_year').val(),
    'agemo' :$('#age_month').val(),
    'dateyr': $('#date_year').val(),
    'livepercent':parseFloat($('#percent_slider').slider('value')),
    'liveyr':$('#survivalyears').val(),
    'liveage':$('#survivaltotalyears').val(),
    'liveyrschg' :  $('input:hidden[name=liveyrschg]').val(),
    'perchg':$('input:hidden[name=perchg]').val()
    };
    
    var title = 'Chance of Survival starting from Age ' + $('#age_year').val()+' :';
    var x_Axis = 'Expected Surviving Age';
    var y_Axis ='Chance of Survival(%)';
    
    $.ajax({    
    url: "ajax/calculator.php",
    type: "POST",   
    data: information, 
    dataType : "json", 
    success: function(results){
    //only display the life expectancy and outputs if the age is changed
    if($('input:hidden[name=liveyrschg]').val() == 0 && $('input:hidden[name=perchg]').val() == 0){
        $("#display_age").html($('#age_year').val()+" years and "+$('#age_month').val() +" months"); 
        $('#lifexpyear').html(results.lifeexpyr); 
        $('#lifexptotal').html(results.lifeexpage);
        $('#survivalyears').val(results.liveyr);
        $('#survivaltotalyears').val(results.liveage);
        $('#livepercent').html(results.livepercent);
        $('#percent_slider').slider('value',results.livepercent);
        Pro_age = Object.keys(results.data_points);
        hAxis = $.map(results.data_points,function(k,v){return k;});
        buildTable(zip(Pro_age.reverse(),hAxis.reverse()),["Age","Chance Of Survival (%)"],"data_table"); //build a table for output data   
        draw_graph(Pro_age,hAxis,title,x_Axis,y_Axis,'curve_chart'); // draw the curve chart   
        console.log(results.data_points); 
    }    
    else{
        if($('input:hidden[name=perchg]').val() !=0){
            $('#survivalyears').val(results.liveyr);
            $('#survivaltotalyears').val(results.liveage); 
            $('input:hidden[name=perchg]').val(0); 
       }else if($('input:hidden[name=liveyrschg]').val(0) != 0){
            $('input:hidden[name=liveyrschg]').val(0);    
            $('#livepercent').html(results.livepercent);
            $('#percent_slider').slider('value',results.livepercent);
       } 
    }
    }
    });
  return false;
}
function draw_graph(Xdata,Ydata, title, x_Axis,y_Axis,location) {
var chart = new google.visualization.AreaChart(document.getElementById(location)); // SteppedAreaChart
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Year');
        data.addColumn('number', 'Survival Chance');
         for (var i = 0; i <= Pro_age.length; i++)
         {
        var xAxis = parseFloat(Xdata[i]);
        var yAxis = parseFloat(Ydata[i]);
        data.addRow([xAxis,yAxis]);     
         }        
    var options = {
        //backgroundColor: '#FEFEDC',
        //chartArea: {left:0, top:0, width:'80%', height:'80%'},
        title: title,
        height: 600,
        width: 510,
        isStacked: true,
        forceIFrame: true,
        hAxis: {
            title: x_Axis,
            min: 0,
            max : 120    
        },
        vAxis: {
            title: y_Axis,
            baseline: 0,
            viewWindow: {
                min: 0,
                max: 100
            }
        },
        legend: {position: 'none'}
    };
    setTimeout(function() {
        chart.draw(data, options);
    }, 0); // without this, this initial axis numbers don't show up
}    

      
 