/*-------- CAMBIAR IMPORTS --------*/

import { CriptoBase } from './criptobase.js';

/*-------- CAMBIAR ESTA CLASE HIJO --------*/
class Cripto extends CriptoBase {
  constructor(id, nombre, simbolo, fechaCreacion, precioActual,consenso,circulacion,algoritmo,pagina) {
    super(id, nombre, simbolo,fechaCreacion,precioActual) ;
    this.consenso = consenso;
    this.circulacion = circulacion;
    this.algoritmo = algoritmo;
    this.pagina = pagina;
  }

}

/*-------- CAMBIAR EXPORT --------*/
export { Cripto };