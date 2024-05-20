<?php
include 'config.php'; // Database connection

$searchQuery = isset($_GET['q']) ? $_GET['q'] : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10; // Number of posts per page
$offset = ($page - 1) * $limit;

// Modify the query to support search
$sql = "SELECT * FROM lbl_posts WHERE title LIKE ? OR description LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?";

$stmt = $con->prepare($sql);
$searchTerm = "%$searchQuery%";
$stmt->bind_param("ssii", $searchTerm, $searchTerm, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
}

// Get the total number of posts for pagination
$sqlTotal = "SELECT COUNT(*) as total FROM lbl_posts WHERE title LIKE ? OR description LIKE ?";
$stmtTotal = $con->prepare($sqlTotal);
$stmtTotal->bind_param("ss", $searchTerm, $searchTerm);
$stmtTotal->execute();
$resultTotal = $stmtTotal->get_result();
$total = $resultTotal->fetch_assoc()['total'];

$response = [
    'info' => $posts,
    'total' => $total,
    'page' => $page,
    'limit' => $limit
];

header('Content-type: application/json');
echo json_encode($response);
?>
