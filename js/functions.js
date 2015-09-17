
//select a row from table
$('.table_style tr').click(function(){
if ($(this).find('td')){
$(this).addClass('selected').siblings().removeClass('selected');
}
});


//GET DATA FROM AN HTML TABLE
function getData(table){
  var data = [];
  table.find("tr").each(function(index,cell){
      var rows = [];
      $(this).find('td').each(function(colIndex,cell){
        rows.push(cell.textContent);
      });
      data.push(rows);
  });
  return data;
}

// BUILD TABLE FROM ARRAY,HEADER,TABLENAME
function buildTable(data,header_array,table_name){
  var table = document.getElementById(table_name);
  eraseTable(table);
  var header = table.createTHead();
  var header_row = header.insertRow(0);
  for (var i = 0; i <header_array.length; i++){
    var cell =  header_row.insertCell(i);
    cell.innerHTML = "<b>"+header_array[i]+"</b>";
  }
  var body  = table.createTFoot();
  for (var i = 0; i <data.length; i++){
    var body_row = body.insertRow();// no i needed, first row is inserted after the header row
    var array_row = data[i]; 
    for (var k = 0; k <array_row.length; k++){
      var cell = body_row.insertCell(k);
      cell.innerHTML = array_row[k];
    } 
  }
}

// //create dataArray for HTML table, all arrays inside must have the same length
function buildArray(arrays){
  var data_array = [];
  for (var row = 0; row <arrays[0].length; row++){
      var data_row = []
      for (var i = 0; i<arrays.length; i++){
          data_row.push(arrays[i][row]);
      }
      data_array.push(data_row);
  }
  return data_array
}

//Erase table content
function eraseTable(table){
  while(table.rows.length >  0){
    table.deleteRow(0);
  }
}

//REMOVE duplicates from an array and return a new array
function removeDup(array){
  var new_array = [];
  $.each(array,function(i,value){
    if($.inArray(value,new_array) == -1){
      new_array.push(value);
    }
  });
  return new_array;
}
// COUNT OCCURENCES OF ITEMS IN AN ARRAY
function Occurences(ary, classifier) {
    return ary.reduce(function(counter, item) {
        var p = (classifier || String)(item);
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
        return counter;
    }, {})
}
//return a number that is greater than 1000  with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//combine 2 arrays a = [a1,a2,...] and b = [b1,b2,...] in the format [(a1,b1),(a2,b2),....]
function zip(a,b){
var c = a.map(function (e, i) {
    return [a[i], b[i]];
});
return c;
}

//round an array to a given decimal point
function round_array(array,decimal_points){
  var x = 0;
  var len = array.length
  while(x < len){ 
  array[x] = parseFloat(array[x]).toFixed(2); 
  x++
  }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


