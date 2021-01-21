export class PedidoDetalle {
    detaId: number = 0;
    detaPediId: number = 0;
    detaProdId: number = 0;
    detaCantidad: number = 0;
    detaPrecio: number = 0;
    detaBorrado: boolean = false;
    detaFechaAlta: Date = new Date();
    
    prodDescripcion: string = "";
}