<?php

header("Access-Control-Allow-Origin: *");

include_once "config.php";
include_once "sql_srv.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$db = SQLSRV::connect();

$stmt = sqlsrv_query($db,
    "UPDATE Heroes SET name = ?
    WHERE id = ?", [$data["name"], $data["id"]] );

if($stmt === false) {
    SQLSRV::error(500, 'Error interno del servidor', $db);
}

$results = array();
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $results = $row;
}

sqlsrv_free_stmt($stmt);
SQLSRV::close($db);

echo $input;

?>