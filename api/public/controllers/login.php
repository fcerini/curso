<?php
    $app->post('/login', function ($request, $response, $args) {

        $res = [];
    
        // esto deberia irse a buscar a la base de datos!!!
        if(DATA["user"] == "admin" && DATA["pass"] == "admin"){

            $res["user"] = DATA["user"];
            
            $idusuario = 1;
            $res["id"] = $idusuario;

            $token = [];
            $token["idUsuario"] = $idusuario;
            $token["usuario"] = "Usuario ADMIN";
            $token["permisos"] = ["PRODUCTO_BORRAR"
                                 ,"CLIENTE_BORRAR"
                                 ,"PEDIDO_BORRAR"];
    
            $res["token"] = G::CrearToken($token);
        } elseif (DATA["user"] == "juan" && DATA["pass"] == "1234"){
            $res["user"] = DATA["user"];
            
            $idusuario = 2;
            $res["id"] = $idusuario;

            $token = [];
            $token["idUsuario"] = $idusuario;
            $token["usuario"] = "Juan Perez";
            $token["permisos"] = [];
            
            $res["token"] = G::CrearToken($token);
        }else{
            $res["user"] = "Error";
            $res["id"] = -1;
            $res["token"] = null;
        }

        $payload = json_encode($res);
        
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    });
?>