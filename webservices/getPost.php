<?php
include_once('config.php');


$id = $_GET['id'];

if (!empty($id)) {
    $sql = "SELECT lbl_posts.*, user_post_likes.user_id FROM lbl_posts JOIN user_post_likes ON lbl_posts.id = user_post_likes.post_id WHERE lbl_posts.id = '$id'";
    $query = $con->query($sql);
    if ($query) {
        $likes = $query->num_rows;
        if ($likes > 0) {
            $row = $query->fetch_array();
            $id = $row['id'];
            $title = $row['title'];
            $des = $row['description'];
            $created_at = $row['created_at'];
            $result = array(
                'id' => $id,
                'title' => $title,
                'description' => $des,
                'created_at' => $created_at,
                'likes' => $likes,
                // 'userLiked' => $userLiked
            );
            $json = $result;
        } else {
            $sql = "SELECT * FROM  lbl_posts WHERE id = $id";
            $query = $con->query($sql);
            if ($query->num_rows > 0) {
                $row = $query->fetch_array();
                $id = $row['id'];
                $title = $row['title'];
                $des = $row['description'];
                $created_at = $row['created_at'];
                $result = array('id' => $id, 'title' => $title, 'description' => $des, 'created_at' => $created_at, 'likes' => 0);
                // $result = array('id' => $id, 'title' => $title, 'description' => $des, 'created_at' => $created_at, 'likes' => 0, 'userLiked' => $userLiked);
                $json = $result;
            } else {
                $json = array('status' => 0, 'msg' => 'NOT FOUND!');
            }
        }
    } else {
        $json = array('status' => 0, 'msg' => 'Query failed: ' . $con->error);
    }
    header('Content-type: application/json');
    echo json_encode($json);
}
