# curso
Curso

PHP
https://windows.php.net/downloads/releases/php-7.4.14-nts-Win32-vc15-x64.zip

ODBC
https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15

Driver SQL php
https://docs.microsoft.com/en-us/sql/connect/php/download-drivers-php-sql-server?view=sql-server-ver15


copiar php_sqlsrv_74_nts_x64.dll a C:\php\ext\php_sqlsrv.dll

Modificar C:\php\php.ini  agregar

extension=php_sqlsrv.dll



VPN
https://openvpn.net/downloads/openvpn-connect-v3-windows.msi



```
Grilla de Clientes
clienId	int
clienNombre	varchar(50)
clienDireccion	varchar(50)
```

```
Grilla de Productos
prodId	int
prodDescripcion	varchar(50)
prodPrecio	float
```

```
Grilla de Pedidos
pediId	int
pediFecha	datetime
pediClienId	int
clienNombre
```

```
Formulario Pedido
pediId	AUTOMATICO
pediFecha	datetime
pediClienId	SELECT de clienNombre

  Grilla de Detalle
    prodDescripcion
    detaCantidad int
    detaPrecio	float
    
  Formulario de Detalle
    SELECT prodDescripcion
    detaCantidad int
    detaPrecio <- Sugerirlo desde prodPrecio

```
