<?php

function pre_r($array){
  echo '<pre>';
  print_r($array);
  echo '</pre>';
}

function getDatesAndPrice(){

$servername = "private";
$username = "private";
$password = "private";
$dbname = "private";

$sql = "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='priceHistory' AND `TABLE_NAME`='lowPrice';";

$mysqli = new mysqli($servername, $username, $password, $dbname);

$columnNames = array();

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

if ($result = $mysqli->query($sql)) {
    /* fetch object array */
    while($row = $result->fetch_row()) {
      $rows[]=$row;
    }
    for($i = 0; $i < count($rows); $i++){
      if($rows[$i][0] != 'id' && $rows[$i][0] != 'foil' && $rows[$i][0] != 'edition'){
        array_push($columnNames, $rows[$i][0]);
      }
    }
    /* free result set */
    $result->close();
}

$card = json_decode($_POST['card']);

$dateString = implode("`,`", $columnNames);

$dateString = "`{$dateString}`";

$id = $card[0]->id;
$foil = $card[0]->foil;
$edition = $card[0]->edition;

$sql = "SELECT $dateString FROM priceHistory.lowPrice WHERE id = $id AND edition = $edition AND foil = $foil;";

$price = array();

if ($result = $mysqli->query($sql)) {
    /* fetch object array */
    $price = $result->fetch_row();
    /* free result set */
    $result->close();
}

/* close connection */
$mysqli->close();

echo json_encode(array($columnNames, $price));
}

getDatesAndPrice();

?>
