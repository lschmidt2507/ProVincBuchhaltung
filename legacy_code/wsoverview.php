<?php
session_start();
if(!isset($_SESSION["login"])){
  header("Location: ../login.php");
  exit();
}

if(isset($_POST['productnum'])){
  $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');


  if($_POST['id']==-1){ 
    $sql = "INSERT INTO `week_stats` (`startDate`, `endDate`, `coinsRegister`, `billsRegister`, `coinsTransfer`, `billsTransfer`, `author`, `profit`, `diff`, `sales`) 
    VALUES ('".$_POST['startDay']."', '".$_POST['endDay']."', '".$_POST['coinsBegin']."', '".$_POST['billsBegin']."', '".$_POST['coinsTransfer']."', '".$_POST['billsTransfer']."', '".$_SESSION['name']."', '".$_POST['profit']."', '".$_POST['diff']."', '".$_POST['salesInput']."')";
  }else{
    $sql = "DELETE FROM `week_stats` WHERE id=".$_POST['id'];
    mysqli_query($connection, $sql);

    $sql = "INSERT INTO `week_stats` (`startDate`, `endDate`, `coinsRegister`, `billsRegister`, `coinsTransfer`, `billsTransfer`, `author`, `profit`, `diff`, `id`, `sales`) 
    VALUES ('".$_POST['startDay']."', '".$_POST['endDay']."', '".$_POST['coinsBegin']."', '".$_POST['billsBegin']."', '".$_POST['coinsTransfer']."', '".$_POST['billsTransfer']."', '".$_SESSION['name']."', '".$_POST['profit']."', '".$_POST['diff']."','".$_POST['id']."', '".$_POST['salesInput']."')";
  }
  mysqli_query($connection, $sql);
  if($_POST['id']==-1){ 
    $statId=mysqli_fetch_assoc(mysqli_query($connection, "SELECT MAX(id) FROM week_stats"))['MAX(id)'];
  }else{
    $statId=$_POST['id'];
    $sql = "DELETE FROM `sales` WHERE weekStatId=".$_POST['id'];
    mysqli_query($connection, $sql);
  }

  $sql = "UPDATE `supply` SET `weekStatId`=".$statId." WHERE `supplyDate` BETWEEN '".$_POST['startDay']."' AND '".$_POST['endDay']."'";
  mysqli_query($connection, $sql);

  $sql = "DELETE FROM `sales` WHERE `weekStatId`=".$statId;
  mysqli_query($connection, $sql);

  for($count=0;$count<$_POST['productnum'];$count++){
    $sql = "INSERT INTO `sales` (`startDate`, `endDate`, `productId`, `bestBefore`, `bestAfter`, `lost`, `countSold`, `EK`, `VK`, `profit`, `weekStatId`) 
    VALUES ('".$_POST['startDay']."', '".$_POST['endDay']."', '".$_POST['productID'.$count]."', '".$_POST['BestVorher'.$count]."', '".$_POST['BestNachher'.$count]."', '".$_POST['Verlust'.$count]."', '".$_POST['amount'.$count]."', '".$_POST['EK'.$count]."', '".$_POST['VK'.$count]."', '".$_POST['profit'.$count]."', '".$statId."')";
    mysqli_query($connection, $sql);
    if(isset($_POST['id'])){
      $sql = "UPDATE sales SET bestBefore='".$_POST['BestNachher'.$count]."' WHERE weekStatId='".($statId+1)."' AND productId='".$_POST['productID'.$count]."'";
      mysqli_query($connection, $sql);
    }
  }
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

  <title>ProVinc Buchhaltung - Wochenstatisiken</title>

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
            <a class="collapse-item active" href="wsoverview.php">Übersicht</a>
            <a class="collapse-item" href="selectwsdate.php">Neue Wochenstatistik</a>
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
          <h1 class="mb-4 text-alert">Übersicht</h1>

            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Wochenstatistiken</h6>
              </div>
              <div class="card-body">
                <table id="dataTable" class="table table-striped table-bordered display " width="100%" style="width:100%">
                  <thead>
                    <tr>
                      <th>Startdatum</th>
                      <th>Enddatum</th>
                      <th>Umsatz</th>
                      <th>Gewinn</th>
                      <th>Transfer</th>
                      <th>Differenz</th>
                      <th>Kasse vorher</th>
                      <th>Kasse nachher</th>
                      <th>Ersteller/Bearbeiter</th>
                      <th>ID</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                      $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                      $sql = "SELECT * FROM week_stats";
                      $result = mysqli_query($connection, $sql);
                      while($stat = mysqli_fetch_assoc($result)){ ?>
                      <tr>
                        <td><?php echo $stat['startDate']?></td>
                        <td><?php echo $stat['endDate']?></td>
                        <td><?php echo $stat['sales']?></td>
                        <td><?php echo $stat['profit']?></td>
                        <td><?php echo $stat['coinsTransfer']+$stat['billsTransfer']?></td>
                        <?php
                          if($stat['sales']==0){
                            echo "<td class='text-danger font-weight-bold'>".$stat['diff']."</td>";
                          }else{
                            if(abs($stat['diff']/$stat['sales'])>0.07){
                              echo "<td class='text-danger font-weight-bold'>".$stat['diff']."(".(round($stat['diff']/$stat['sales']*100,1))."%)</td>";
                            }else{
                              echo "<td class='text-success font-weight-bold'>".$stat['diff']."(".(round($stat['diff']/$stat['sales']*100,1))."%)</td>";
                            }
                          }?>
                        <td><?php echo $stat['coinsRegister']+$stat['billsRegister']?></td>
                        <td><?php echo $stat['coinsRegister']+$stat['billsRegister']-$stat['coinsTransfer']-$stat['billsTransfer']?></td>
                        <td><?php echo $stat['author']?></td>
                        <td><?php echo $stat['id']?></td>
                        <td><a href="wsnew.php?id=<?php echo $stat['id'] ?>"><input class="btn btn-primary btn-block" type="submit" value="Bearbeiten"></a></td>
                      </tr>
                      <?php }?>
                  </tbody>
                </table>
              </div>
            </div>

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

  <!-- Data Tables -->
  <script src="vendor/datatables/jquery.dataTables.min.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
  <script src="js/dataTable.min.js"></script>

</body>

</html>
