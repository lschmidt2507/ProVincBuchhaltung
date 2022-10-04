<?php
session_start();
if(!isset($_SESSION["login"])){
  header("Location: ../login.php");
  exit();
}

$connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
$lastWS=null;
if(isset($_GET['id'])){
  $sql = "SELECT * from week_stats WHERE id={$_GET['id']}";
  $result = mysqli_query($connection, $sql);
  $thisWS = mysqli_fetch_assoc($result);
  $lastID = $_GET['id']-1;
  $sql = "SELECT * from week_stats WHERE id={$lastID}";
  $result = mysqli_query($connection, $sql);
  $lastWS = mysqli_fetch_assoc($result);
}else{
  $sql = "SELECT * from week_stats WHERE endDate=( SELECT max(endDate) FROM week_stats )";
  $result = mysqli_query($connection, $sql);
  $lastWS = mysqli_fetch_assoc($result);

}
?>

<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Buchhaltungssystem der Schülerfirma ProVinc">
  <meta name="author" content="Linus Schmidt">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
  <link rel="manifest" href="/favicon/site.webmanifest">

  <title>ProVinc Buchhaltung - Neue Wochenstatistik</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin-2.min.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="vendor/datatables/dataTables.bootstrap4.min.css">

</head>

<body id="page-top">

  <!-- Page Wrapper -->
  <div id="wrapper">

    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.php">
        <div class="sidebar-brand-icon">
          <i class="fas fa-check"></i>
        </div>
        <div class="sidebar-brand-text mx-3">ProVinc</div>
      </a>
        
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">

      <!-- Nav Item - Dashboard -->
      <li class="nav-item">
        <a class="nav-link" href="index.php">
          <i class="fas fa-fw fa-info-circle"></i>
          <span>Dashboard</span></a>
      </li>
      

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
        Buchhaltung
      </div>

      <!-- Nav Item - Neue Wocehnstatistik -->
      <li class="nav-item active">
        <a class="nav-link expanded" href="wsoverview.php" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
          <i class="fas fa-calendar-week"></i>
          <span>Wochenstatisiken</span>
        </a>
        <div id="collapseTwo" class="collapse show" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <a class="collapse-item" href="wsoverview.php">Übersicht</a>
            <a class="collapse-item active" href="selectwsdate.php">Neue Wochenstatistik</a>
            <a class="collapse-item" href="wsimport.php">Import</a>
            <a class="collapse-item" href="wsexport.php">Export</a>
          </div>
        </div>
      </li>

      <!-- Nav Item - MHD -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="mhd.php">
          <i class="fas fa-fw fa-drumstick-bite"></i>
          <span>MHD</span>
        </a>
      </li>

      <!-- Nav Item - Finanzen -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="finance.php">
          <i class="fas fa-fw fa-euro-sign"></i>
          <span>Finanzen</span>
        </a>
      </li>

      <!-- Nav Item - Bestellplanung -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="orders.php">
          <i class="fas fa-fw fa-receipt"></i>
          <span>Bestellungen</span>
        </a>
      </li>


      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
        Einkauf
      </div>

      <!-- Nav Item - Charts -->
      <li class="nav-item">
        <a class="nav-link" href="supply.php">
          <i class="fas fa-fw fa-truck-loading"></i>
          <span>Wareneingang</span></a>
      </li>

      <!-- Nav Item - Tables -->
      <li class="nav-item">
        <a class="nav-link" href="logistics.php">
          <i class="fas fa-fw fa-boxes"></i>
          <span>Warenbestand</span></a>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="invoices.php">
          <i class="fas fa-fw fa-wallet"></i>
          <span>Rechnugen</span></a>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block">

      <!-- Sidebar Toggler (Sidebar) -->
      <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
      </div>

    </ul>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-fw fa-user mr-2"></i>
                <span class="d-lg-inline text-gray-600 small"><?php echo $_SESSION["name"]?></span>
              </a>
              <!-- Dropdown - User Information -->
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#changePassModal">
                    <i class="fas fa-key fa-sm fa-fw mr-2 text-gray-400"></i>
                    Passwort ändern
                </a>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>

          </ul>

        </nav>
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid">

          <!-- Page Heading -->
          <?php 
          if(isset($_GET['id'])){
            $startDate = $thisWS['startDate'];
            $endDate = $thisWS['endDate'];
          }else{
            $startDate = $_POST['startDay'];
            $endDate = $_POST['endDay'];
          }
          ?>
          <h1 class="mb-4 text-alert">Neue Wochenstatistik erstellen</h1>
          <form method="POST" action="wsoverview.php">
            <div class="row">
              <div class="col-md-6">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Allgemeine Daten</h6>
                  </div>
                  <div class="card-body">  
                    <div class="row">
                      <div class="col-sm-6">
                        <label>Starttag</label>
                        <h6 class="m-0 font-weight-bold text-primary"><?php echo $startDate?></h6>
                      </div>
                      <div class="col-sm-6">
                        <label>Endtag</label>
                        <h6 class="m-0 font-weight-bold text-primary"><?php echo $endDate?></h6>
                      </div>
                    </div>
                    <div class="row pt-1">
                      <div class="col-sm-12">
                        <label>Ersteller/Bearbeiter</label>
                        <input type="text" value="<?php echo $_SESSION['name']?>" class="form-control form-control-user" name="creator" required>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Kasse/Transfer(ohne € mit . statt ,)</h6>
                  </div>
                  <div class="card-body">
                    <h6 class="m-0 font-weight-bold text-primary">Zählung</h6>
                    <div class="row">
                      <div class="col-sm-6">
                        <label>Münzen</label>
                        <input type="text" class="form-control form-control-user coinsBegin" name="coinsBegin" value="<?php if(isset($_GET['id'])){echo $thisWS['coinsRegister'];}?>" required>
                      </div>
                      <div class="col-sm-6">
                        <label>Scheine</label>
                        <input type="text" class="form-control form-control-user billsBegin" name="billsBegin" value="<?php if(isset($_GET['id'])){echo $thisWS['billsRegister'];}?>" required>
                      </div>
                    </div>
                    <h6 class="pt-1 m-0 font-weight-bold text-primary">Transfer</h6>
                    <div class="row">
                      <div class="col-sm-6">
                        <label>Münzen</label>
                        <input type="text" class="form-control form-control-user coinsTransfer" name="coinsTransfer" value="<?php if(isset($_GET['id'])){echo $thisWS['coinsTransfer'];}?>" required>
                      </div>
                      <div class="col-sm-6">
                        <label>Scheine</label>
                        <input type="text" class="form-control form-control-user billsTransfer" name="billsTransfer" value="<?php if(isset($_GET['id'])){echo $thisWS['billsTransfer'];}?>" required>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Produkte</h6>
                  </div>
                  <div class="card-body">  
                    <table id="dataTableProducts" class="table table-striped table-bordered display nowrap" style="width:100%">
                      <thead>
                        <tr>
                          <th>Produkt</th>
                          <th>Bestand letzte WS</th>
                          <th>Bestand jetzt</th>
                          <th>Verlust</th>
                          <th>EK Preis</th>
                          <th>VK Preis</th>
                          <th>Wareneingang</th>
                          <th>Verkauft</th>
                          <th>Umsatz</th>
                          <th>Gewinn</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        <?php
                          function get_supply_by_id($id,$startDate,$endDate){
                            $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                            if(isset($_GET['id'])){
                              $sql = "SELECT * FROM supply WHERE weekStatId = ".$_GET['id']." AND productId=".$id;
                            }else{
                              $sql = "SELECT * FROM supply WHERE '".$startDate."'<=`supplyDate` AND `supplyDate`<='".$endDate."' AND `productId`=".$id;
                            }
                            $result = mysqli_query($connection, $sql);
                            $total = 0;
                            $resstring='';
                            while($delivery = mysqli_fetch_assoc($result)){
                              $resstring = $resstring.$delivery['id'].", ";
                              $total = $total + $delivery['amount'];
                            }
                            return ["Menge: ".$total." <br>ID:".$resstring,$total];
                          }
                          function get_product_name_by_id($id){
                            $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                            $sql = "SELECT * FROM products WHERE id = ".$id;
                            $result = mysqli_query($connection, $sql);
                            $product = mysqli_fetch_assoc($result);
                            return $product['name'];
                          }
                          $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                          if (isset($_GET['id'])){
                            $sql = "SELECT * FROM sales WHERE weekStatId = ".$_GET['id'];
                            $result = mysqli_query($connection, $sql);
                            $idCount=0;
                            while($sale = mysqli_fetch_assoc($result)){ ?>
                              <tr class="productCalc">
                                <td><?php echo get_product_name_by_id($sale['productId'])?></td>
                                <td><input type="text" class="form-control form-control-user BestVorher" name="BestVorher<?php echo $idCount;?>" value="<?php echo $sale['bestBefore']?>" required></td>
                                <td><input type="text" class="form-control form-control-user BestNachher" name="BestNachher<?php echo $idCount;?>" value="<?php echo $sale['bestAfter']?>" required></td>
                                <td><input type="text" class="form-control form-control-user Verlust" name="Verlust<?php echo $idCount;?>" value="<?php echo $sale['lost']?>"></td>
                                <td><input type="text" class="form-control form-control-user EK" name="EK<?php echo $idCount;?>" value="<?php echo $sale['EK'];?>"></td>
                                <td><input type="text" class="form-control form-control-user VK" name="VK<?php echo $idCount;?>" value="<?php echo $sale['VK'];?>"></td>
                                <td class="productInput"><?php echo get_supply_by_id($sale['productId'],$startDate,$endDate)[0]?></td>
                                <td class="soldItems"></td>
                                <td class="sales"></td>
                                <td class="profit"></td>
                                <input type="hidden" class="productInputRaw" value="<?php echo get_supply_by_id($sale['productId'],$startDate,$endDate)[1]?>">
                                <input type="hidden" name="productID<?php echo $idCount;?>" value="<?php echo $sale['productId'];?>">
                                <input type="hidden" class="profitSingleInput" name="profit<?php echo $idCount;?>" value="Nicht berechnet">
                                <input type="hidden" class="amountSingleInput" name="amount<?php echo $idCount;?>" value="Nicht berechnet">
                              </tr>
                              <?php $idCount++;}
                          }else{

                            
                            function get_last_stock_amount_by_id($id,$lastWS){
                              $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                              $sql = "SELECT * FROM sales WHERE weekStatId = ".$lastWS['id']." and productId=".$id;
                              $result = mysqli_query($connection, $sql);
                              if(mysqli_num_rows($result) == 0){
                                return 0;
                              }
                              $sale = mysqli_fetch_assoc($result);
                              return $sale['bestAfter'];
                            }

                            $sql = "SELECT * FROM products WHERE current_product = 1";
                            $result = mysqli_query($connection, $sql);

                            $idCount=0;
                            while($product = mysqli_fetch_assoc($result)){ ?>
                            <tr class="productCalc">
                              <td><?php echo $product['name']?></td>
                              <td><?php echo get_last_stock_amount_by_id($product['id'],$lastWS);?></td>
                              <td><input type="text" class="form-control form-control-user BestNachher" name="BestNachher<?php echo $idCount;?>" required></td>
                              <td><input type="text" class="form-control form-control-user Verlust" name="Verlust<?php echo $idCount;?>" value="0"></td>
                              <td><input type="text" class="form-control form-control-user EK" name="EK<?php echo $idCount;?>" value="<?php echo $product['buy_value'];?>"></td>
                              <td><input type="text" class="form-control form-control-user VK" name="VK<?php echo $idCount;?>" value="<?php echo $product['sell_value'];?>"></td>
                              <td class="productInput"><?php echo get_supply_by_id($product['id'],$startDate,$endDate)[0]?></td>
                              <td class="soldItems"></td>
                              <td class="sales"></td>
                              <td class="profit"></td>
                              <input type="hidden" class="productInputRaw" value="<?php echo get_supply_by_id($product['id'],$startDate,$endDate)[1]?>">
                              <input type="hidden" name="productID<?php echo $idCount;?>" value="<?php echo $product['id'];?>">
                              <input type="hidden" class="BestVorher" name="BestVorher<?php echo $idCount;?>" value="<?php echo get_last_stock_amount_by_id($product['id'],$lastWS);?>">
                              <input type="hidden" class="profitSingleInput" name="profit<?php echo $idCount;?>" value="Nicht berechnet">
                              <input type="hidden" class="amountSingleInput" name="amount<?php echo $idCount;?>" value="Nicht berechnet">
                            </tr>
                            <?php $idCount++;}
                          }?>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Übersicht</h6>
                  </div>
                  <div class="card-body"> 
                    <div class="row">
                      <div class="col-md-3">
                      <h6 class="m-0 font-weight-bold text-primary">Kasse nach letzer Statistik</h6>
                        <h6 class="m-0 font-weight-medium text-primary lastMoney"><?php echo $lastWS['coinsRegister']+$lastWS['billsRegister']-$lastWS['coinsTransfer']-$lastWS['billsTransfer'] ?>€</h6>
                        <h6 class="m-0 font-weight-bold text-primary">Kasse vor dieser Statistik</h6>
                        <h6 class="m-0 font-weight-medium text-primary nowMoney">0.00€</h6>
                      </div>
                      <div class="col-md-3">
                        <h6 class="m-0 font-weight-bold text-primary">Umsatz hypothetisch</h6>
                        <h6 class="m-0 font-weight-medium text-primary overallProfit"></h6>
                        <h6 class="m-0 font-weight-bold text-primary">Umsatz real</h6>
                        <h6 class="m-0 font-weight-medium text-primary realProfit">0.00€</h6>
                      </div>
                      <div class="col-md-3">
                        <h6 class="m-0 font-weight-bold text-primary">Differenz hypothetisch/real</h6>
                        <h6 class="m-0 font-weight-medium text-primary diffMoney">0.00€</h6>
                        <h6 class="m-0 font-weight-bold text-primary">Transfer</h6>
                        <h6 class="m-0 font-weight-medium text-primary transComb">0.00€</h6>
                      </div>
                      <div class="col-md-3">
                        <h6 class="m-0 font-weight-bold text-primary">Gewinn gesamt</h6>
                        <h6 class="m-0 font-weight-medium text-primary profitTotal">0.00€</h6>
                      </div>
                    </div>
                    <hr/>
                    <?php if(!isset($_GET['id'])){?>
                    <div class="row justify-content-md-center">
                      <div class="col-md-10">
                        <h6 class="m-0 font-weight-bold text-danger">Achtung: Es sind noch Wareneingänge offen, welche beim Speichern automatisch dieser Wochenstatisik zugeordnet werden, prüfe bitte genau die Wareneingänge!<br>Solltest du dir unsicher sein, speichere auf keinen Fall und überprüfe die Wareneingänge, welche bisher keiner Wochenstatistik zugeordnet wurden!</h6>
                      </div>
                    </div>
                    <hr/>
                    <?php } ?>
                    <div class="row justify-content-md-center">
                      <div class="col-md-4">
                        <input class="btn btn-secondary btn-user btn-block" type="submit" name="submit" value="Speichern (ich garantiere für die Richtigkeit)">
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <input type="hidden" name="productnum" value="<?php echo mysqli_num_rows($result);?>">
            <input type="hidden" class="profitInput" name="profit" value="NN">
            <input type="hidden" class="salesInput" name="salesInput" value="NN">
            <input type="hidden" class="diffInput" name="diff" value="NN">
            <input type="hidden" class="startDay" name="startDay" value="<?php echo $startDate?>">
            <input type="hidden" class="endDay" name="endDay" value="<?php echo $endDate?>">
            <input type="hidden" class="statId" name="id" value="<?php if(isset($_GET['id'])){echo $_GET['id'];}else{echo '-1';}?>">
          </form>

        </div>
        <!-- /.container-fluid -->

      </div>
      <!-- End of Main Content -->

      <!-- Footer -->
      <footer class="sticky-footer bg-white">
        <div class="container my-auto">
          <div class="copyright text-center my-auto">
            <span>Copyright &copy; Linus Schmidt 2021</span>
          </div>
        </div>
      </footer>
      <!-- End of Footer -->

    </div>
    <!-- End of Content Wrapper -->

  </div>
  <!-- End of Page Wrapper -->

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

  <!-- Logout Modal-->
  <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Logout</h5>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">Wirlich die Session beenden?</div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="button" data-dismiss="modal">Abbrechen</button>
          <a class="btn btn-secondary" href="login.php?login=logout">Logout</a>
        </div>
      </div>
    </div>
  </div>
  <!-- Change Password Modal-->
  <div class="modal fade" id="changePassModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form role="form" method="POST" action="login.php">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Passwort ändern</h5>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
              <label>Altes Passwort</label>
              <input type="password" class="form-control" name="oldPasswd">
          </div>
          <div class="form-group">
              <label>Neues Passwort</label>
              <input type="password" class="form-control" name="newPasswd">
          </div>
          <div class="form-group">
              <label>Bestätigen</label>
              <input type="password" class="form-control" name="confirmPasswd">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="button" data-dismiss="modal">Abbrechen</button>
          <input class="btn btn-secondary" type="submit" value="Ändern" href="login.html">
        </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin-2.min.js"></script>
  

  <script src="js/livecalc.min.js"></script>

  <!-- Data Tables -->
  <script src="vendor/datatables/jquery.dataTables.min.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
  <script src="js/dataTable.min.js"></script>

</body>

</html>
