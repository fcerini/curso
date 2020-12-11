# curso
Curso

Copiarse el api desde desnuncias-web y limpiarlo

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
