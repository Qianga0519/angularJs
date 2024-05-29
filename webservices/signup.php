<?php
include_once('config.php');

// Lấy dữ liệu từ biểu mẫu đăng ký
$username = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

// Kiểm tra tính hợp lệ của dữ liệu (có thể thêm các kiểm tra khác như độ dài tối thiểu của mật khẩu)
if (empty($username) || empty($email) || empty($password)) {
    $json = array('message' => 'Please fill in all fields');
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $json = array('message' => 'Invalid email format');
} else {
    // Kiểm tra xem email đã được sử dụng chưa
    $check_email_query = "SELECT * FROM users WHERE email = '$email'";
    $check_email_result = $con->query($check_email_query);

    if ($check_email_result->num_rows > 0) {
        $json = array('message' => 'Email already exists');
    } else {

        $insert_query = "INSERT INTO users ( username, email ,password) VALUES ('$username', '$email', '$password')";

        if ($con->query($insert_query) === TRUE) {
            $json = array('message' => 'Registration successful');
        } else {
            $json = array('message' => 'Registration failed');
        }
    }
}

header('Content-type: application/json');
echo json_encode($json);
