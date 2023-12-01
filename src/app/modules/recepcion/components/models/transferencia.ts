/**
 * Esta interfaz es para crear el registro en la tabla transferencia
 */
export interface Transferencia {
  gim_Origen: number;
  gim_Destino: number;
  usuario_Id: number;
  fecha_Envio: string;
}
