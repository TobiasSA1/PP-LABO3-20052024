// local-storage.js

/*NO TOCAR*/
// Función para leer del localStorage
export function leer(clave) {
  return JSON.parse(localStorage.getItem(clave));
}

/*NO TOCAR*/
// Función para escribir en el localStorage
export function escribir(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/*NO TOCAR*/
// Función para limpiar del localStorage
export function limpiar(clave) {
  localStorage.removeItem(clave);
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