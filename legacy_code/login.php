<?php 
session_start();

if(isset($_GET["login"])){
  if($_GET["login"]=="logout"){
    session_unset();
    session_destroy();
    header("Location: ../login.php");
    exit();
  }
}

$connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');

if(isset($_POST['oldPasswd'])){
  unset($_POST['submit']);
  if($_POST['newPasswd']==$_POST['confirmPasswd']){
    $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');
    $id=$_SESSION['id'];

    $sql = "SELECT * FROM users WHERE id = '$id'";
    $result = mysqli_query($connection, $sql);
    $row = mysqli_fetch_assoc($result);
    $validPassword = password_verify($_POST['oldPasswd'], $row['password']);
    if($validPassword == true){
      $newPasswdhash = password_hash(mysqli_real_escape_string($connection, $_POST['newPasswd']),PASSWORD_DEFAULT);
      $sql = "UPDATE users SET password = '$newPasswdhash' WHERE id = '$id'";
      mysqli_query($connection, $sql);
      session_unset();
      session_destroy();
      session_start();
      $_SESSION['passwdchange']="sucess";
    }else{
      $_SESSION['passwdchange']="wrong";
    }
  }else{
    $_SESSION['passwdchange']="mismatch";
  }
}

if (isset($_POST['submit'])) {

  $connection = mysqli_connect('localhost', 'root', 'root', 'buchhaltung');

  $user = mysqli_real_escape_string($connection, $_POST['username']);
  $password = mysqli_real_escape_string($connection, $_POST['password']);
  $_SESSION['userentered']=$user;
  $_SESSION['passwdentered']=$password;

  $sql = "SELECT * FROM users WHERE user = '$user'";
  $result = mysqli_query($connection, $sql);

  $resultCheck = mysqli_num_rows($result);
  if ($resultCheck < 1) {
      header("Location: ../login.php?login=user");
      exit();
  } else {
      if ($row = mysqli_fetch_assoc($result)) {
          $hashedPassword = password_verify($password, $row['password']);
          if ($hashedPassword == false) {
              header("Location: ../login.php?login=password");
              exit();
          } elseif($hashedPassword == true){
            $_SESSION['login'] = 1;
            $_SESSION['id'] = $row['id'];
            $_SESSION['name'] = $row['user'];
            header("Location: ../index.php");
            exit();
          }
      }
  }

} 

if(isset($_SESSION["login"])){
  header("Location: ../index.php");
  exit();
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

  <title>ProVinc Buchhaltung - Login</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin-2.min.css" rel="stylesheet">

</head>

<body id="page-top" class="bg-gradient-primary">

  <div class="container">

    <!-- Outer Row -->
    <div class="row justify-content-center flex-grow-1">
    <!--<div class="d-flex flex-row">-->
      <div class="col-xl-8 col-lg-6 col-md-9">

        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-lg-12">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4 font-weight-bold">ProVinc Buchhaltungssystem</h1>
                  </div>
                  <form class="user" method="POST" action="login.php">
                    <div class="form-group">
                      <label>Name</label>
                      <input type="text" class="form-control form-control-user" id="username" name="username" value="<?php if(isset($_SESSION['userentered'])){echo htmlentities($_SESSION['userentered']);}?>">
                    </div>
                    <div class="form-group">
                      <label>Passwort</label>
                      <input type="password" class="form-control form-control-user" id="password" name="password" value="<?php if(isset($_SESSION['passwdentered'])){echo htmlentities($_SESSION['passwdentered']);}?>">
                    </div>
                    <?php 
                    if(isset($_GET["login"])){
                      if($_GET["login"]=="user"){
                        echo "<p class='text-danger'>Name existiert nicht</p>";
                      }elseif ($_GET["login"]=="password") {
                        echo "<p class='text-danger'>Falsches Passwort</p>";
                      }elseif ($_GET["login"]=="error") {
                        echo "<p class='text-danger'>Ein Error ist aufgetreten</p>";
                      }
                    }
                    if(isset($_SESSION['passwdchange'])){
                      if($_SESSION['passwdchange']=="sucess"){
                        echo "<p class='text-success'>Passwort erfolgreich geändert!</p>";
                      }elseif($_SESSION['passwdchange']=="mismatch"){
                        echo "<p class='text-danger'>Passwörter stimmten nicht überein!</p>";
                      }elseif($_SESSION['passwdchange']=="wrong"){
                        echo "<p class='text-danger'>Falsches Passwort!</p>";
                      }
                    }
                    ?>
                    <input class="btn btn-secondary btn-user btn-block" type="submit" name="submit" value="Login">
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>

  <footer class="sticky-footer bg-white">
    <div class="container my-auto">
      <div class="copyright text-center my-auto">
        <span>Copyright &copy; Linus Schmidt 2021</span>
      </div>
    </div>
</footer>
  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin-2.min.js"></script>
  <script src="js/livecalc.js"></script>

</body>

</html>
