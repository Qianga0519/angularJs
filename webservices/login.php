<?php
include_once('config.php');

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email = '$email'";
$query = $con->query($sql);
if ($query->num_rows > 0) {
    while ($row = $query->fetch_array()) {
        if ($password == $row['password']) {
            $result = array('success' => true, 'id' => $row['id'], 'username' => $row['username'], 'message' => 'Login success');
        } else {
            $result = array('success' => false, 'message' => 'Password error');
        }
    }
} else {
    $result = array('success' => false, 'message' => 'User does not exist!');
}

header('Content-type: application/json');
echo json_encode($result);
