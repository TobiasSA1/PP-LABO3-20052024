// local-storage.js
// Simulando una respuesta asincrónica con un retardo de 2 segundos
const delay = 2.5; // en segundos

/*NO TOCAR*/
// Función asincrónica para leer del localStorage
export function leer(clave) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const valor = JSON.parse(localStorage.getItem(clave));
        resolve(valor);
      } 
      catch (error) {
        reject(error);
      }
    }, delay * 1000);
  });
}

/*NO TOCAR*/
// Función asincrónica para escribir en el localStorage
export function escribir(clave, valor) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        resolve();
      } catch (error) {
        reject(error);
      }
    }, delay * 1000);
  });
}

/*NO TOCAR*/
// Función asincrónica para limpiar una clave del localStorage
export function limpiar(clave) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        localStorage.removeItem(clave);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, delay * 1000);
  });
}

/*NO TOCAR*/
// Función para convertir de JSON string a objeto
export function jsonToObject(jsonString) {
  return JSON.parse(jsonString);
}

/*NO TOCAR*/
// Función para convertir de objeto a JSON string
export function objectToJson(objeto) {
  return JSON.stringify(objeto);
}

/*NO TOCAR*/
export function eliminarItem(clave, id, items) {
  return new Promise(async (resolve, reject) => {
    try {
      // Verificar que items sea un arreglo
      if (!Array.isArray(items)) {
        throw new Error('Los datos recuperados no son un arreglo');
      }
      const index = items.findIndex(item => Number(item.id) === id);
      console.log(index);
      if (index !== -1) {
        
        items.splice(index, 1);
        console.log(items); // Items ahora contiene el array sin el elemento eliminado
        await escribir(clave, items); // Asumiendo que escribir es una función que guarda los datos
      } else {
        throw new Error('No se encontró el elemento con el id proporcionado');
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/*NO TOCAR*/
export function editarItem(clave, id, nuevosDatos, items) {
  return new Promise(async (resolve, reject) => {
    try {
      // Verificar que items sea un arreglo
      if (!Array.isArray(items)) {
        throw new Error('Los datos recuperados no son un arreglo');
      }

      // Encontrar el índice del elemento con el id proporcionado
      const index = items.findIndex(item => Number(item.id) === id);

      if (index !== -1) {
        // Editar el elemento con los nuevos datos
        Object.assign(items[index], nuevosDatos);

        // Escribir los cambios en el almacenamiento
        await escribir(clave, items); // Suponiendo que `escribir` es una función que guarda los datos

        resolve();
      } else {
        throw new Error('No se encontró el elemento con el id proporcionado');
      }

    } catch (error) {
      reject(error);
    }
  });
}