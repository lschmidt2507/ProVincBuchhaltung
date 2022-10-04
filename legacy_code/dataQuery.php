<?php
session_start();
if(!isset($_SESSION["login"])){
  exit();
}
?>

<?php
$connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
function getProductName($id){
  $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
  $sql = "SELECT * FROM `products` WHERE `id`=".$id;
  $result = mysqli_query($connection, $sql);
  $product = mysqli_fetch_assoc($result);
  return ($product['name']);
};
if (isset($_GET['method'])){
  if ($_GET['method']=='getLastWSStock'){
    $labels = array();
    $values = array();
    $sql = "SELECT * FROM `sales` WHERE `weekStatId`=(SELECT MAX(`weekStatId`) FROM `sales`)";
    $result = mysqli_query($connection, $sql);
    while($product = mysqli_fetch_assoc($result)){
      array_push($labels,getProductName($product['productId']));
      array_push($values,intval($product['bestAfter']));
    }
    echo(json_encode(array('labels' => $labels, 'values' => $values)));
  };
};
?>

