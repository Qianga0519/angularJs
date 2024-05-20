<?php
include_once('config.php');
$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'];
$des =  $data['description'];
$today = date('Y-m-d');
$query = "INSERT INTO lbl_posts (title, description, published_on) VALUES ('$title','$des','$today')";

if ($con->query($query) == TRUE) {
    echo "POST Added Succesfully";
} else {
    echo
        "False to add Post!";
}
