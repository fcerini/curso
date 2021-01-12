<?php

header("Access-Control-Allow-Origin: *");

include_once "config.php";
include_once "sql_srv.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$db = SQLSRV::connect();

$stmt = sqlsrv_query($db,
    "INSERT INTO Heroes ( name )
    VALUES (?);
    SELECT @@IDENTITY id;",
    [$data["name"]] );

if($stmt === false) {
    SQLSRV::error(500, 'Error interno del servidor', $db);
}


$results= [];

sqlsrv_fetch($stmt);

sqlsrv_next_result($stmt); 

$row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

$results = $data;
$results["id"] = $row["id"];

sqlsrv_free_stmt($stmt);
SQLSRV::close($db);

echo json_encode($results);

?>