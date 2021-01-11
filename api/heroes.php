<?php

header("Access-Control-Allow-Origin: *");

include_once "config.php";
include_once "sql_srv.php";

$db = SQLSRV::connect();

$stmt = sqlsrv_query($db,"SELECT id, name FROM Heroes", null);

if($stmt === false) {
    SQLSRV::error(500, 'Error interno del servidor', $db);
}

$results = array();
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $results[] = $row;
}

sqlsrv_free_stmt($stmt);
SQLSRV::close($db);

echo json_encode($results);

?>