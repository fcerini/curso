<?php
use Firebase\JWT\JWT;

include_once("config.php");

class G
{

    public static function GetInsertedId($result) {
        /**
        ** Restorna el ID del ultimo elemento insertado.
        ** NOTE: Es necesario agregar '; SELECT SCOPE_IDENTITY()' al
        ** final de la consulta de INSERT.
        */
        sqlsrv_next_result($result); 
        sqlsrv_fetch($result); 
        return sqlsrv_get_field($result, 0);
    }

    public static function CrearToken($data){
        $time = time();
        $token = array(
            'iat' => $time, // Tiempo que inició el token
            'exp' => $time + 60*60,// + 60*60*24,// (60*60*24), // Tiempo que expirará el token (+24 horas)
            'data' => $data
        );

        return JWT::encode($token, TOKEN_KEY);
    }

    
    public static function ObtenerIP(){
        if (!empty($_SERVER["HTTP_CLIENT_IP"])) {   
            //check ip from share internet
            $ip=$_SERVER["HTTP_CLIENT_IP"];
        } elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
            //to check ip is pass from proxy
            $ip=$_SERVER["HTTP_X_FORWARDED_FOR"];
        } else {
            $ip=$_SERVER["REMOTE_ADDR"];
        }

        return $ip;
    }

    /* Devuelve el token decodificado.
    La validacion contra algun permiso es opcional */
    /* Devuelve el token decodificado.
    La validacion contra algun permiso es opcional */
    public static function Autenticar($request, $permiso=null, $log=true)
    {
        $jwt= null;
        if ($request->getHeader('SIS_auth') != null && count($request->getHeader('SIS_auth'))) {
            $jwt=$request->getHeader('SIS_auth')[0];
        }elseif (isset(getallheaders()['SIS_auth'])) {
            $jwt=getallheaders()['SIS_auth'] ;
        } elseif (isset(getallheaders()['Sis_auth'])) {
            $jwt=getallheaders()['Sis_auth'] ;
        } elseif (isset(getallheaders()['Authorization'])) {
            $jwt= getallheaders()['Authorization']  ;
        }

        
        if ($jwt) {
            try {
                $token = JWT::decode($jwt, TOKEN_KEY, array('HS256'));
                // Chequea si la ip que hace la consulta es la misma que genero el Token
                // if ($token->data->ip != G::ObtenerIP()) {
                //     G::Fin(401, 'No autorizado, IP diferente');
                // }
                
                // Si se requiere un permiso, chequea si lo tiene
                if (isset($permiso)) {
                    if (!in_array($permiso, $token->data->permisos)) {
                        G::Fin(401, 'No autorizado');
                    }
                }

                if ($log) {
                   // Auditoria::Log($request, $permiso, $request->getParam('data'), $token->data->usuario_id);
                }

                return $token;
            } catch (Exception $e) {
            }
        }
        
        G::Fin(410, 'La sesion del usuario ha caducado');
    }

    /* Metodo para autenticar token que no venga por headers como puede pasar en un GET originado con href */
    public static function AutenticarToken($token, $permiso=null){
        if ($token != null)
        {
        $jwt = $token;
        if ($jwt) {
                try {
                $token = JWT::decode($jwt, TOKEN_KEY, array('HS256'));
                // Chequea si la ip que hace la consulta es la misma que genero el Token
                if ($token->data->ip != G::ObtenerIP()) {
                    G::Fin(401, 'No autorizado, IP diferente');
                }
                // Si se requiere un permiso, chequea si lo tiene
                if (isset($permiso)){
                    if (!in_array($permiso, $token->data->permisos)){
                       G::Fin(401, 'No autorizado' );
                    }

                }
                return $token;

                } catch (Exception $e) {

                }
            }
        }        
        
        G::Fin(410, 'La sesion del usuario ha caducado' );
    }

    public static function Fin($codigo, $mensaje){
        http_response_code($codigo);
		echo json_encode(array("error"=>$mensaje));
        // FALTA CERRAR LA CONEXION A LA BASE?
        die;

    }

    public static function Permisos($codigo=null) {
        // Arrays de permisos por modulo
        include("permisos/permisosGis.php");
        $permisos = array();
        $permisos = array_merge($permisos, $permisosGis);

        if (isset($codigo) && $codigo != 'LISTAR') {
            foreach($permisos as $permiso) {
                if ($permiso["codigo"] == $codigo)
                    return $permiso;
            }
        }
        if($codigo == 'LISTAR')
            return $permisos;
        else
            return array();
    }
    

    public static function FormatDatetoSQL ($strDate) {
        $result = null;
        if(isset($strDate)) {
            $date = new DateTime($strDate);;
            $result = (strpos($strDate, ":") === false) ? $date->format('Ymd') : $date->format('Ymd H:i:s');
        }
        return $result;
    }
}


?>
