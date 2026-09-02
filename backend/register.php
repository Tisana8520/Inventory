<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$user = isset($input['username']) ? trim($input['username']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$pass = isset($input['password']) ? trim($input['password']) : '';

if (empty($user) || empty($email) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "กรุณากรอกข้อมูลให้ครบถ้วน"]);
    exit();
}

try {
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1");
    $checkStmt->execute(['username' => $user, 'email' => $email]);
    
    if ($checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Username หรือ Email นี้ถูกใช้งานแล้ว"]);
        exit();
    }

    $hashedPassword = password_hash($pass, PASSWORD_BCRYPT);
    $insertStmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
    $insertStmt->execute([
        'username' => $user,
        'email' => $email,
        'password' => $hashedPassword
    ]);

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "สมัครสมาชิกสำเร็จ"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error: " . $e->getMessage()]);
}