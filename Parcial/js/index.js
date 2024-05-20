/*-------- CAMBIAR IMPORTS --------*/
import { leer, escribir, limpiar, jsonToObject, objectToJson, eliminarItem } from './local-storage-async.js';

import { Cripto } from "./cripto.js";

/*NO TOCAR*/
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

/*-------- CAMBIAR ESTA VARIABLE --------*/
const KEY_STORAGE = "criptos";

/*NO TOCAR*/
let items = []; // array vacio
const formulario = document.getElementById("form-item");
const btnGuardar = document.getElementById("btnGuardar");
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");
const btnEditar = document.getElementById("btnEditar");

/*NO TOCAR*/
document.getElementById('navbar-toggle').addEventListener('click', function() {
  var menu = document.querySelector('.navbar-menu');
  menu.classList.toggle('active');
});

/*NO TOCAR*/
window.addEventListener('resize', function() {
  var menu = document.querySelector('.navbar-menu');
  if (window.innerWidth > 768) {
      menu.classList.remove('active');
  }
});

/*NO TOCAR*/
window.addEventListener("DOMContentLoaded", () => {
  btnCancelar.addEventListener("click", handlerCancelar);
  document.addEventListener("click", handlerClick);
  loadItems();
  handlerEditar();
  handlerEliminar();
  escuchandoFormulario();
  escuchandoBtnDeleteAll(); // le agreggo el evento click al documento
});

/*-------- CAMBIAR ESTA FUNCION --------*/
async function loadItems() {
  mostrarSpinner();
  let str = await leer(KEY_STORAGE);
  ocultarSpinner();

  const objetos = jsonToObject(str) || [];
  
  objetos.forEach(obj => {
    const model = new Cripto(
      obj.id,
      obj.nombre,
      obj.simbolo,
      obj.fechaCreacion,
      obj.precioActual,
      obj.consenso,
      obj.circulacion,
      obj.algoritmo,
      obj.pagina
    );
  
    items.push(model);
  });

  rellenarTabla();
}

/*-------- CAMBIAR ESTA FUNCION --------*/
function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];
  
    tbody.innerHTML = ''; // Me aseguro que esté vacio, hago referencia al agregar otro

    const celdas = ["id", "nombre","simbolo","fechaCreacion","precioActual","consenso","circulacion","algoritmo","pagina"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");

        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];

            nuevaFila.appendChild(nuevaCelda);
        });

        // Agregar la fila al tbody
        tbody.appendChild(nuevaFila);
    });
  }

/*-------- CAMBIAR ESTA FUNCION --------*/
function escuchandoFormulario() {
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario(formulario)) {
      return;
    }
    
    mostrarSpinner();
    
    var fechaActual = new Date();

    const consenso = formulario.querySelector('#consenso').value;
    const algoritmo = formulario.querySelector('#algoritmo').value;
    const fechaFormateada = obtenerFechaFormateada();
    const model = new Cripto(
      fechaActual.getTime(),
      formulario.querySelector("#nombre").value,
      formulario.querySelector("#simbolo").value,
      fechaFormateada,
      formulario.querySelector("#precioActual").value,
      consenso,
      formulario.querySelector("#circulacion").value,
      algoritmo,
      formulario.querySelector("#pagina").value
    );

    const respuesta = model.verify();

    if (respuesta.success) {
      items.push(model);
      const str = objectToJson(items);
      
      try {
        await escribir(KEY_STORAGE, str);
        ocultarSpinner();
        actualizarFormulario();
        rellenarTabla();
      }
      catch (error) {
        ocultarSpinner();
        alert(error);
      }
    }
    else {
      ocultarSpinner();
      alert(respuesta.rta);
    }
  });
}
/*-------- CAMBIAR ESTA FUNCION --------*/
function cargarFormulario(formulario, ...datos) {
  //metodo que cargar el formulario con datos segun un ID recibido

  formulario.id.value = datos[0]; // este atributo esta como hidden, oculto
  formulario.nombre.value = datos[1];
  formulario.simbolo.value = datos[2];
  formulario.fechaCreacion.value = datos[3];
  formulario.precioActual.value = datos[4];
  formulario.consenso.value = datos[5];
  formulario.circulacion.value = datos[6];
  formulario.algoritmo.value = datos[7];
  formulario.pagina.value = datos[8];
}
function escuchandoBtnDeleteAll() {
  const btn = document.getElementById("btn-delete-all");

  btn.addEventListener("click", async (e) => {

    mostrarSpinner();

    const rta = confirm('Desea eliminar todos los Items?');

    if(rta) {
      items.splice(0, items.length);

      try {
        await limpiar(KEY_STORAGE);
        ocultarSpinner();
        rellenarTabla();
      }
      catch (error) {
        ocultarSpinner();
        alert(error);
      }
    }
  });
}

/*-------- CAMBIAR ESTA FUNCION --------*/
function handlerClick(e) {
  if (e.target.tagName === "TD") { // Verifica si el clic proviene de una celda de la tabla
    const row = e.target.closest("tr"); // Encuentra el elemento 'tr' más cercano (fila de la tabla)
    if (row) {
      const cells = row.querySelectorAll("td"); // Obtén todas las celdas de la fila
      if (cells.length >= 8) { // Verifica que haya suficientes celdas en la fila
        cargarFormulario(
          formulario,
          cells[0].textContent, // ID
          cells[1].textContent, // Nombre
          cells[2].textContent, // Simbolo
          cells[3].textContent, // Fecha creacion
          cells[4].textContent, // Precio Actual
          cells[5].textContent, // Consenso
          cells[6].textContent, // Circulacion
          cells[7].textContent, // Algoritmo
          cells[8].textContent  // Pagina
        ); 
        modificarFuncionBoton(e.target);
      } else {
        console.error("La fila de la tabla no tiene suficientes celdas");
      }
    } else {
      console.error("No se pudo encontrar la fila de la tabla");
    }
  } else if (!e.target.matches("input") && !e.target.matches("select")) { // Incluye la coincidencia con 'select'
    modificarFuncionBoton(e.target);
    limpiar(formulario);
  }
}
/*NO TOCAR*/
function handlerEliminar() {

  const btn = document.getElementById("btnEliminar");

  btn.addEventListener("click", async (e) => {

    e.preventDefault();
    
    mostrarSpinner();
    
    try {

      let id = parseInt(formulario.id.value);
      console.log(id);
      
      await eliminarItem(KEY_STORAGE,id,items);

      ocultarSpinner();
      actualizarFormulario();
      rellenarTabla();
    }
    catch (error) {
      ocultarSpinner();
      alert(error);
    }

  });
}

/*-------- CAMBIAR ESTA FUNCION --------*/
function handlerEditar() {

  const btn = document.getElementById("btnEditar");

  btn.addEventListener("click", async (e) => {

    if (!validarFormulario(formulario)) {
      return;
    }

    e.preventDefault();
    
    mostrarSpinner();
    
    try {

      let id = parseInt(formulario.id.value);

      if (!Array.isArray(items)) {
        throw new Error('Los datos recuperados no son un arreglo');
      }
      const index = items.findIndex(item => Number(item.id) === id);
      console.log(index);
      if (index !== -1) {

        var fechaActual = new Date();

        const consenso = formulario.querySelector('#consenso').value;
        const algoritmo = formulario.querySelector('#algoritmo').value;
        const fechaFormateada = obtenerFechaFormateada();
        const model = new Cripto(
          fechaActual.getTime(),
          formulario.querySelector("#nombre").value,
          formulario.querySelector("#simbolo").value,
          fechaFormateada,
          formulario.querySelector("#precioActual").value,
          consenso,
          formulario.querySelector("#circulacion").value,
          algoritmo,
          formulario.querySelector("#pagina").value
        );
    
    
        const respuesta = model.verify();
    
        if (respuesta.success) {

          await eliminarItem(KEY_STORAGE,id,items);

          items.push(model);

          const str = objectToJson(items);

          await escribir(KEY_STORAGE, str);
          
          ocultarSpinner();
          actualizarFormulario();
          rellenarTabla();
        }
      }

    }
    catch (error) {

      ocultarSpinner();
      alert(error);
    }

  });
}

/*NO TOCAR*/
function handlerCancelar(e) {
  modificarFuncionBoton(e.target);
  limpiar(formulario);
}


/*NO TOCAR*/
function actualizarFormulario() {
  formulario.reset();
}


/*NO TOCAR*/
function modificarFuncionBoton(target) {
  if (target.matches("td")) {

    btnGuardar.setAttribute("class", "oculto");
    btnEliminar.removeAttribute("class");
    btnCancelar.removeAttribute("class");
    btnEditar.removeAttribute("class");

    btnEliminar.setAttribute("class", "btn btn-danger");
    btnCancelar.setAttribute("class", "btn btn-secondary");
    btnEditar.setAttribute("class", "btn btn-primary");

  } else {
    btnGuardar.removeAttribute("class");
    btnGuardar.setAttribute("class","btn btn-primary" );

    btnEliminar.setAttribute("class", "btn btn-danger oculto");
    btnCancelar.setAttribute("class", "btn btn-secondary oculto");
    btnEditar.setAttribute("class", "btn btn-primary oculto");
  }
}

// Validar que los campos de texto no estén vacíos
function validarCampoVacio(input) {
  return input.value.trim() !== "";
}

// Validar que los campos de texto tengan menos de 50 caracteres
function validarTexto(input) {
  return input.value.trim().length <= 50 && validarCampoVacio(input);
}

// Validar que los campos numéricos sean mayores a 0
function validarNumero(input) {
  const valor = parseFloat(input.value);
  return !isNaN(valor) && valor > 0 && validarCampoVacio(input);
}

// Validar que los campos select no estén vacíos
function validarSelect(input) {
  return input.value !== "";
}

// Validar todo el formulario
function validarFormulario(formulario) {
  const camposTexto = ["#nombre", "#simbolo", "#pagina"];
  const camposNumero = ["#precioActual", "#circulacion"];
  const camposSelect = ["#consenso", "#algoritmo"];
  
  for (const selector of camposTexto) {
      const input = formulario.querySelector(selector);
      if (!validarTexto(input)) {
          alert(`El campo ${selector} debe tener menos de 50 caracteres y no puede estar vacío.`);
          return false;
      }
  }
  
  for (const selector of camposNumero) {
      const input = formulario.querySelector(selector);
      if (!validarNumero(input)) {
          alert(`El campo ${selector} debe ser mayor a 0 y no puede estar vacío.`);
          return false;
      }
  }

  for (const selector of camposSelect) {
      const input = formulario.querySelector(selector);
      if (!validarSelect(input)) {
          alert(`El campo ${selector} no puede estar vacío.`);
          return false;
      }
  }
  
  return true;
}

function obtenerFechaFormateada() {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Los meses son indexados desde 0
  const año = fechaActual.getFullYear();
  return `${dia}/${mes}/${año}`;
}
