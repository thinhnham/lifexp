<?php
//Back-end processing code!
//Calculator.php handles calculations for life expectancy and expected survival chance
//This file is the original version of the Life Expectancy Calculator written entierly in PHP 
// I, Thinh (Tim), modified this file so that it can handle calculations for AJAX calls from the front-end 
//Date of Modification: 05/11/2015 by Thinh (Tim) Nham

$gender = $_POST['sex'];
$agemo = $_POST['agemo'];
$ageyr = $_POST['ageyr'];
$dateyr = $_POST['dateyr'];
$livepercent = $_POST['livepercent'];
$liveyr = $_POST['liveyr'];
$liveage = $_POST['liveage'];
$liveyrschg = $_POST['liveyrschg'];
$perchg = $_POST['perchg'];

$f  = $_SERVER['DOCUMENT_ROOT']."/lifexp/ajax/MortTable/RP2000CombinedHealthy.csv";
$f1 = fopen($f,"r");
$qm = array();
$qf = array();
$data = array();

$i = 0;
do{
$data[$i]= fgets($f1);
$i++;
}while(!feof($f1));
fclose($f1);

foreach($data as $row)
{
$pieces = explode(",",$row);
$nCol  = count($pieces);    
$index = $pieces[0];
    
if($nCol <=2){
$qm[$index] = $pieces[1];    
}
else{    
$qm[$index] = $pieces[1];    
$qf[$index] = $pieces[2];
}
}
if($nCol == 2){
$qf = $qm;
}
$aam = array();
$aaf = array(); 

include $_SERVER['DOCUMENT_ROOT']."/lifexp/ajax/aa.php"; 


if ($gender) {$aa = $aam; $qs = $qm;} else {$aa = $aaf; $qs = $qf;}


if ($ageyr < 20){ //if the age is less than the lowest age in the mortablity table , set age = the lowest age 
$ageyr = 20;
}      

krsort($qs);
reset($qs);//set the first index to the first element
$lastq_age = key($qs);
$lastq_val = current($qs);



if ($liveyrschg == 0){// we need to determine liveyr and liveage if either age or percentage is changed
  $pprod = 1;
  $i = $ageyr;
  $value1=0;
  $prob1= 0;
  $prob2 =0;
  while (1) {
    if (!isset($aa[$i]) ){$aa[$i] =0;}
      $aafac = pow(1 - $aa[$i], $dateyr - 1994 + $i - $ageyr);
      if ($i<=$lastq_age) {$q0 = $qs[$i];} else {$q0 = $lastq_val;}
      $q = $q0 * $aafac;
      if ($q == 0) {$q = min($qs);}
      $p = 1 - $q;
      $pprod *= $p;
      if ($pprod < ($livepercent/100)) {
        $prob2 =$pprod;
        break;
      } 
      $value1 = $i;
      $prob1= $pprod;
      $i++;     
  }
  if( $value1 != 0 ){
     $liveage  = floatval(((($livepercent/100-$prob1)*($i-$value1))/($prob2-$prob1))+$value1);
  }else{$liveage = $ageyr;}
  $liveyr = 0;
  }else if($liveyrschg == 1){
  $pprod = 1;
  $i = $ageyr;
  while (1) {
    if (!isset($aa[$i]) ){$aa[$i] =0;}
    $aafac = pow(1 - $aa[$i], $dateyr - 1994 + $i - $ageyr);
    if ($i<=$lastq_age) {$q0 = $qs[$i];} else {$q0 = $lastq_val;}
    $q = $q0 * $aafac;
    $p = 1 - $q;
    $pprod *= $p;
    if ($i >= $liveage) {break;}
    $i++;
  }
  $livepercent = $pprod * 100;
  $livepercent = number_format($livepercent,2);
  if($livepercent < 0.005) {$livepercent = 100; $liveage = $ageyr + ($agemo/12); $liveyr = 0;}
  if($liveyr < 1) {$livepercent = 100; $liveage = $ageyr + ($agemo/12); $liveyr = 0;}
}

$liveyr = number_format($liveyr, 2);
$liveage = number_format($liveage, 2);

if($liveyrschg == 0 && $perchg == 0){
//life expectancy
  $lifeexp =0;
  $b_lifeexp =0;  
   $pprod = 1;
   $i = $ageyr;
   $b_pprod = 1;
   while (1) {
       if (!isset($aa[$i])){$aa[$i] =0;}
        $aafac = pow(1 - $aa[$i], $dateyr - 1994 + $i - $ageyr);         
        if ($i<=$lastq_age) {$q0 = $qs[$i];} else {$q0 = $lastq_val;}     
        $q = $q0 * $aafac;                                              
            $p = 1 - $q;
        $pprod *= $p;
        $lifeexp += $pprod;
        if ($i>=($ageyr + 1)) {
             $b_pprod *= $p; $b_lifeexp += $b_pprod;
        }
        if ($pprod < .00001) {break;}
        if ($b_pprod < .00001) {break;}
        $i++;
   }
  $lifeexpyr = (((12 - $agemo)/12) * ($lifeexp)) + (($agemo/12) * ($b_lifeexp));
  $lifeexpyr = number_format($lifeexpyr, 2);
  $lifeexpage = $ageyr + ($agemo / 12) + $lifeexpyr;
  $lifeexpage = number_format($lifeexpage, 2);

  //creating data points for the graph
  $data_points = array();
  $key = 0;
  $value = 0;
  $j =0.000001;// $j is the percentage - starts at 0
  $k= 0;// $k is the index
  while($j <= 100){
      $pprod = 1;
      $i = $ageyr;
      $value1=0;
      $prob1= 0;
      $prob2 =0;
      while($i < 120){
        if (!isset($aa[$i]) ){$aa[$i] =0;}
          $aafac = pow(1 - $aa[$i], $dateyr - 1994 + $i - $ageyr);
          if ($i<=$lastq_age) {$q0 = $qs[$i];} else {$q0 = $lastq_val;}
          $q = $q0 * $aafac;
          if ($q == 0) {$q = min($qs);}
          $p = 1 - $q;
          $pprod *= $p;
          if ($pprod <= ($j/100)) {
            $prob2 =$pprod;
            break;
          }   
          $value1 = $i;// value is the value i before the i+1 
          $prob1= $pprod;
          $i++; 
        }
      if( $value1!=0 ){    
        $key = number_format( floatval(((($j/100-$prob1)*($i-$value1))/($prob2-$prob1))+$value1), 2);
        $value=  number_format(floatval($j),2) ;   
      }elseif($i == $ageyr){
        $key  = number_format($ageyr,2);
        $value= 100;
      }else{
        $key = $i;
        $value = 0; 
      }

      $data_points[$key] = floatval($value);
  $k = $k+1;
  $j += 0.1;    
  }
  $data_points = array_unique($data_points);
  $results = array("lifeexpyr" => $lifeexpyr,"lifeexpage" => $lifeexpage, "liveyr" => $liveyr, "liveage" => $liveage, "livepercent" => $livepercent,  "data_points" => $data_points);     
}
else{
  //if only percentage or liveage && year is changed, do not need to return life epxectancy
  if($liveyrschg == 1){
    $results = array("livepercent" => $livepercent);
  }else if($perchg == 1){
    $results = array("liveyr" => $liveyr,"liveage" => $liveage,"livepercent" => $livepercent);
  }
}
echo json_encode($results);// sends back results in JSON format
?>