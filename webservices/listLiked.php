<?php
include_once('config.php');
$userId = $_GET['userId'];
$response = array();
if ($userId) {
    $sql = "SELECT * FROM user_post_likes WHERE user_post_likes.user_id = '$userId'";
    $result = $con->query($sql);
    $response = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response[] = $row['post_id'];
        }
    }
}
echo json_encode($response);
