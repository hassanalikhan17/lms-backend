<?php
header("Content-Type: application/json");

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["message"=>"No data received"]);
    exit;
}

$name = trim($input["name"] ?? "");
$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");
$role = trim($input["role"] ?? "");

// Simple validation
if ($name==="" || $email==="" || $password==="" || $role==="") {
    echo json_encode(["message"=>"Please fill all fields"]);
    exit;
}

// Decide file path: prefer D:/LMS_Data if present
$externalDir = "D:/LMS_Data";
if (is_dir($externalDir) && is_writable($externalDir)) {
    $file = $externalDir . "/users.txt";
    // ensure file exists
    if (!file_exists($file)) { file_put_contents($file, ""); }
} else {
    // fallback to local project data folder
    $localDataDir = __DIR__ . "/data";
    if (!is_dir($localDataDir)) { mkdir($localDataDir, 0755, true); }
    $file = $localDataDir . "/users.txt";
    if (!file_exists($file)) { file_put_contents($file, ""); }
}

// Format line (note: for learning/demo only; do NOT store plaintext passwords in real apps)
$line = "Name: $name | Email: $email | Password: $password | Role: $role" . PHP_EOL;

// Append safely (file_put_contents with LOCK_EX)
file_put_contents($file, $line, FILE_APPEND | LOCK_EX);

echo json_encode(["message"=>"Signup successful"]);
?>
