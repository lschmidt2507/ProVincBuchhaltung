<?php
session_start();
if(!isset($_SESSION["login"])){
  header("Location: ../login.php");
  exit();
}
if(isset($_POST['updateid'])){
  $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
  $sql = "UPDATE `supply` SET `productId`='".$_POST['productId']."', `amount`='".$_POST['amount']."', `supplyDate`='".$_POST['supplyDate']."', `mhd`='".$_POST['mhd']."', `creationDate`='".date("Y\-m\-d")."', `author`='".$_SESSION['name']."' WHERE id='".$_POST['updateid']."'";
  mysqli_query($connection, $sql);
  
}elseif(isset($_POST['amount'])){
  $target='./lieferscheine/';
  $count=0;
  $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');

  $sql = "SELECT * from supply WHERE id=( SELECT max(id) FROM supply )";
  $result = mysqli_query($connection, $sql);
  if(mysqli_num_rows($result) != 0){
    $id = mysqli_fetch_assoc($result)['id']+1;
  }else{
    $id=0;
  }

  foreach ($_FILES['file']['name'] as $filename) 
  {
    $temp=$target;
    $tmp=$_FILES['file']['tmp_name'][$count];
    $pathinf=pathinfo($_FILES['file']['name'][$count]);
    $count=$count + 1;
    $temp=strtolower($temp."lieferschein_".$id."_".$count.".".$pathinf['extension']);
    move_uploaded_file($tmp,$temp);
    $temp='';
  }
  $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
  $sql = "INSERT INTO `supply` (`productId`, `amount`, `supplyDate`, `mhd`, `creationDate`, `fileCount`, `author`,`weekStatId`) 
  VALUES ('".$_POST['productId']."', '".$_POST['amount']."', '".$_POST['supplyDate']."', '".$_POST['mhd']."', '".date("Y\-m\-d")."', '".$count."', '".$_SESSION['name']."', -1)";
  mysqli_query($connection, $sql);
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

  <title>ProVinc Buchhaltung - Wareneingang</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link
    href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
    rel="stylesheet">

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
      <li class="nav-item">
        <a class="nav-link collapsed" href="wsoverview.php" data-toggle="collapse" data-target="#collapseTwo"
          aria-expanded="true" aria-controls="collapseTwo">
          <i class="fas fa-calendar-week"></i>
          <span>Wochenstatisiken</span>
        </a>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <a class="collapse-item" href="wsoverview.php">Übersicht</a>
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
      <li class="nav-item active">
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
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
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
          <h1 class="mb-4 text-alert">Wareneingang</h1>

          <?php
          if(isset($_GET['editid'])){ ?>
          <form method="POST" action="supply.php" enctype="multipart/form-data">
            <div class="row">
              <div class="col-md-12">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Bearbeiten</h6>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <label for="products">Produkt</label>
                        <select class="form-control form-control-user" id="productId" name="productId" required>
                          <?php 
                            $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                            $sql = "SELECT * FROM supply WHERE id = ".$_GET['editid'];
                            $oldEntry = mysqli_fetch_assoc(mysqli_query($connection, $sql));
                            $sql = "SELECT * FROM products WHERE current_product = 1";
                            $resulte = mysqli_query($connection, $sql);
                            while($product = mysqli_fetch_assoc($resulte)){ ?>
                          <option value="<?php echo $product['id']?>"
                            <?php if($product['id']==$oldEntry['productId']){echo 'selected="selected"';}?>>
                            <?php echo $product['name']?></option>
                          <?php } ?>
                        </select>
                      </div>
                      <div class="col-md-2">
                        <label>Menge</label>
                        <input type="number" class="form-control form-control-user" name="amount"
                          value="<?php echo $oldEntry['amount']?>" required>
                      </div>
                      <div class="col-md-3">
                        <label>Eingangsdatum</label>
                        <input type="date" class="form-control form-control-user" name="supplyDate"
                          value="<?php echo $oldEntry['supplyDate']?>" required>
                      </div>
                      <div class="col-md-3">
                        <label>MHD</label>
                        <input type="date" class="form-control form-control-user" name="mhd"
                          value="<?php echo $oldEntry['mhd']?>" required>
                      </div>
                    </div>
                    <hr />
                    <div class="row">
                      <div class="col-md-12">
                        <input class="btn btn-secondary btn-user btn-block" id="fileButton" type="submit" name="submit"
                          value="Speichern (ich garantiere für die Richtigkeit)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <input type="hidden" name="updateid" value="<?php echo $_GET['editid']?>">
          </form>
          <?php }else{ ?>
          <form method="POST" action="supply.php" enctype="multipart/form-data">
            <div class="row">
              <div class="col-md-12">
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Wareneingang registrieren</h6>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <label for="products">Produkt</label>
                        <select class="form-control form-control-user" id="productId" name="productId" required>
                          <?php 

                            $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                            $sql = "SELECT * FROM products WHERE current_product = 1";
                            $result = mysqli_query($connection, $sql);
                            while($product = mysqli_fetch_assoc($result)){ ?>
                          <option value="<?php echo $product['id']?>"><?php echo $product['name']?></option>
                          <?php } ?>
                        </select>
                      </div>
                      <div class="col-md-2">
                        <label>Menge</label>
                        <input type="number" class="form-control form-control-user" name="amount" required>
                      </div>
                      <div class="col-md-3">
                        <label>Eingangsdatum</label>
                        <input type="date" value="<?php echo date("Y\-m\-d");?>" class="form-control form-control-user"
                          name="supplyDate" required>
                      </div>
                      <div class="col-md-3">
                        <label>MHD</label>
                        <input type="date" class="form-control form-control-user" name="mhd" required>
                      </div>
                    </div>
                    <hr />
                    <div class="row">
                      <input type="file" id="file" class="filesInput" name="file[]" multiple>
                      <label class="btn btn-primary" for="file">Lieferschein-Datei(en) auswählen</label>
                    </div>
                    <div class="row">
                      <table id="dataTable" class="table table-striped table-bordered display" style="width:100%">
                        <thead>
                          <tr>
                            <th>Dateiname</th>
                            <th>Dateityp(muss jpg sein)</th>
                          </tr>
                        </thead>
                        <tbody id="showFiles">
                        </tbody>
                      </table>
                    </div>
                    <hr />
                    <div class="row">
                      <div class="col-md-12">
                        <input class="btn btn-secondary btn-user btn-block" id="fileButton" type="submit" name="submit"
                          value="Speichern (ich garantiere für die Richtigkeit)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="row">
            <div class="col-md-12">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary">letzte Wareneingänge</h6>
                </div>
                <div class="card-body">
                  <table id="dataTableSupply" class="table table-striped table-bordered display" style="width:100%">
                    <thead>
                      <tr>
                        <th>Eingangsdatum</th>
                        <th>Produkt</th>
                        <th>Menge</th>
                        <th>MHD</th>
                        <th>Erstellungsdatum</th>
                        <th>Ersteller</th>
                        <th>Wochenstat. ID</th>
                        <th>ID</th>
                        <th>Belege</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <?php
                          function get_product_name_by_id($id){
                            $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                            $sql = "SELECT * FROM products WHERE id = ".$id;
                            $result = mysqli_query($connection, $sql);
                            $product = mysqli_fetch_assoc($result);
                            return $product['name'];
                          }
                          
                          $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
                          $sql = "SELECT * FROM supply";
                          $result = mysqli_query($connection, $sql);
                          while($supply = mysqli_fetch_assoc($result)){ ?>
                      <tr>
                        <td><?php echo $supply['supplyDate']?></td>
                        <td><?php echo get_product_name_by_id($supply['productId'])?></td>
                        <td><?php echo $supply['amount']?></td>
                        <td><?php echo $supply['mhd']?></td>
                        <td><?php echo $supply['creationDate']?></td>
                        <td><?php echo $supply['author']?></td>
                        <td><?php echo $supply['weekStatId']?></td>
                        <td><?php echo $supply['id']?></td>
                        <td><?php 
                            for ($i=0;$i<$supply['fileCount'];$i++){
                              echo "<a href='/showFile.php?weekStatId=".$supply['id']."&number=".($i+1)."' target='_blank'>Beleg Nr. ".($i+1)."</a><br>";
                            }
                            ?>
                        </td>
                        <td><a href="supply.php?editid=<?php echo $supply['id'] ?>"><input class="btn btn-primary btn-block" type="submit" value="Bearbeiten"></a></td>
                      </tr>
                      <?php }?>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <?php } ?>
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
  <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
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
  <div class="modal fade" id="changePassModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
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

  <script src="js/fileImport.min.js"></script>

  <!-- Data Tables -->
  <script src="vendor/datatables/jquery.dataTables.min.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.min.js"></script>
  <script src="js/dataTable.min.js"></script>

</body>

</html>