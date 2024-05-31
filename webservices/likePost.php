<?php
include_once('config.php');

$postData = file_get_contents("php://input");
$request = json_decode($postData, true);
$postId = $request['postId'];
$userId = $request['userId'];
$response = [];

$sqlFind = "SELECT * FROM user_post_likes WHERE user_id = '$userId' AND  post_id = '$postId'";
$result = $con->query($sqlFind);
$status;
$msg;
$icon;
if ($result->num_rows > 0) {
    $delete = "DELETE FROM user_post_likes WHERE user_id = '$userId' AND  post_id = '$postId'";
    if ($con->query($delete) == TRUE) {
        $status = 1;
        $msg = 'unliked';
        $icon = 'fa-regular';
    } else {
        $status = 0;
        $msg = 'liked';
        $icon = 'fa-regular';
    }
} else {
    $sql = "INSERT INTO user_post_likes (user_id, post_id) VALUES ('$userId','$postId')";
    if ($con->query($sql) == TRUE) {
        $status = 1;
        $msg = 'liked';
        $icon = 'fa-solid';
    } else {
        $status = 0;
        $msg = 'failed';
        $icon = 'fa-solid';
    }
}
$sqlLike = "SELECT lbl_posts.*, user_post_likes.user_id FROM lbl_posts JOIN user_post_likes ON lbl_posts.id = user_post_likes.post_id WHERE lbl_posts.id = '$postId'";
$resultLike = $con->query($sqlLike);
$likes = 0;
if ($resultLike) {
    $likes = $resultLike->num_rows;
}

$response = array('status' => $status, 'msg' => $msg, 'icon' => $icon, 'likes' => $likes);
echo json_encode($response);
