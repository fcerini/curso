<?php
$app->get('/pedido', function ($request, $response, $args) {
    $token = G::Autenticar($request, "ADMIN_VER");

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"SELECT pediId
                                    ,CONVERT(VARCHAR, pediFecha, 126) pediFecha
                                    ,pediClienId
                                    ,pediBorrado
                                    ,CONVERT(VARCHAR, pediFechaAlta, 126) pediFechaAlta
                                    ,clienNombre
                                    FROM dbo.Pedido
                                    LEFT OUTER JOIN dbo.Cliente ON pediClienId = clienId
                                    WHERE pediBorrado = 0");
    
    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $results[] = $row;
    }

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');
});

$app->delete('/pedido/{id}', function ($request, $response, $args) {
    $token = G::Autenticar($request, "ADMIN_BORRAR");

    $id = $args['id'];

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Pedido 
                                SET pediBorrado = 1
                                WHERE pediId = ?", [ $id ]);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $results[] = $row;
    }

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
            ->withHeader('Content-Type', 'application/json');
});

$app->put('/pedido/{id}', function ($request, $response, $args) {
    $token = G::Autenticar($request, "ADMIN_MODIFICAR");

    $id = $args['id'];
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    $params = array( $data["pediFecha"], $data["pediClienId"], $data["pediBorrado"]);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"UPDATE dbo.Pedido 
                                SET pediFecha = ?,
                                    pediClienId = ?,
                                    pediBorrado = ?
                                WHERE pediId = ?", [
                                    $params[0],
                                    $params[1],
                                    $params[2],
                                    $id ]); 

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    if (isset($row)){
        $results= $data;
    }

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

$app->post('/pedido', function ($request, $response, $args) {
    $token = G::Autenticar($request, "ADMIN_AGREGAR");

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    $params = array( $data["pediFecha"], $data["pediClienId"]);

    $db = SQLSRV::connect();
    $stmt = sqlsrv_query($db,"INSERT INTO dbo.Pedido
                                (pediFecha
                                ,pediClienId
                                ,pediBorrado
                                ,pediFechaAlta) VALUES
                        (?, ?, 0, GETDATE());
                        
                            SELECT SCOPE_IDENTITY() pediId
                                ,CONVERT(VARCHAR, GETDATE(), 126) pediFechaAlta",
                        $params);

    if($stmt === false) {
        SQLSRV::error(500, 'Error interno del servidor', $db);
    }

    $results= [];

    sqlsrv_fetch($stmt);
    sqlsrv_next_result($stmt); 
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    
    $results= $data;
    $results["pediId"] = $row["pediId"];
    $results["pediFechaAlta"] = $row["pediFechaAlta"];
    $results["pediBorrado"] = 0;

    sqlsrv_free_stmt($stmt);
    SQLSRV::close($db);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response
              ->withHeader('Content-Type', 'application/json');

});

?>