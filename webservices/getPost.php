<?php
include_once('config.php');

$id = $_GET['id'];
if (!empty($id)) {
    $sql = "SELECT * FROM  lbl_posts WHERE id = $id";
    $query = $con->query($sql);
    if ($query->num_rows > 0) {
        while ($row = $query->fetch_array()) {
            $id = $row['id'];
            $title = $row['title'];
            $des = $row['description'];
            $created_at = $row['created_at'];
            $result = array('id' => $id, 'title' => $title, 'description' => $des, 'created_at' => $created_at);
        }
        $json = $result;
    } else {
        $json = array('status' => 0, 'msg' => 'NOT FOUND!');
    }

    header('Content-type: application/json');
    echo json_encode($json);
}
