<?php
include_once('config.php');

$id = $_GET['id'];
if (!empty($id)) {
    $sql = "DELETE FROM lbl_posts WHERE id = $id";
    $query = $con->query($sql);
    if($query){
        $result = array('status' => 1 , 'msg' => "Post Delete Successfully");
    }
    else{
        $result = array('status' => 0 , 'msg' => "Failed to delete Message!");
    }
      
   header('Content-type: application/json');
   echo json_encode($result);
}
