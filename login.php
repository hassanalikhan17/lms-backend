<?php
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["success"=>false,"message"=>"No data received"]);
    exit;
}

$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");
$role = trim($input["role"] ?? "");

// Choose file (same logic as signup)
$externalDir = "D:/LMS_Data";
if (is_dir($externalDir) && is_readable($externalDir)) {
    $file = $externalDir . "/users.txt";
} else {
    $file = __DIR__ . "/data/users.txt";
}

if (!file_exists($file)) {
    echo json_encode(["success"=>false,"message"=>"No users found"]);
    exit;
}

$lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$found = false;
foreach ($lines as $l) {
    // crude parse - checks all three fields exist in the same line
    if (strpos($l, "Email: $email") !== false &&
        strpos($l, "Password: $password") !== false &&
        strpos($l, "Role: $role") !== false) {
        $found = true;
        break;
    }
}

if ($found) {
    echo json_encode(["success"=>true,"message"=>"Login successful"]);
} else {
    echo json_encode(["success"=>false,"message"=>"Incorrect credentials"]);
}
?>
