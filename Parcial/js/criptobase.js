/*-------- CAMBIAR ESTA CLASE --------*/
class CriptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual) {
      this.id = id;
      this.nombre = nombre;
      this.simbolo = simbolo;
      this.fechaCreacion = fechaCreacion;
      this.precioActual = precioActual;
    }
    

    verify() {
        return this.checkTitulo();
      }
    
      checkTitulo() {
        return { success: true, rta: null };
      }

  }
  
  /*-------- CAMBIAR EXPORT --------*/
  export {CriptoBase};
  