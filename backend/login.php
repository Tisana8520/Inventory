<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$user = isset($input['username']) ? trim($input['username']) : '';
$pass = isset($input['password']) ? trim($input['password']) : '';

if (empty($user) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "กรุณากรอก Username และ Password"]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $user]);
    $account = $stmt->fetch();

    if ($account && (password_verify($pass, $account['password']) || $pass === $account['password'])) {
        unset($account['password']);
        echo json_encode([
            "success" => true,
            "message" => "เข้าสู่ระบบสำเร็จ",
            "token" => bin2hex(random_bytes(16)),
            "user" => $account
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Username หรือ Password ไม่ถูกต้อง"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error: " . $e->getMessage()]);
}