<?php
include_once('config.php');

// Get the POST data
$id = $_POST['id'];
$title = $_POST['title'];
$description = $_POST['description'];

$response = [];

// Validate the input
if (!empty($id) && is_numeric($id) && !empty($title) && !empty($description)) {
    $sql = "UPDATE lbl_posts SET title = ?, description = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssi", $title, $description, $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $response = array('status' => 1, 'msg' => "Post updated successfully");
        } else {
            $response = array('status' => 0, 'msg' => "No post found with the given ID");
        }
    } else {
        $response = array('status' => 0, 'msg' => "Failed to update post");
    }

    $stmt->close();
} else {
    $response = array('status' => 0, 'msg' => "Invalid input");
}

header('Content-type: application/json');
echo json_encode($response);
?>
