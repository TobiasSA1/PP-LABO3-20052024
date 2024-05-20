/*NO TOCAR*/
// Función para mostrar el spinner
export function mostrarSpinner() {
    action(true);
}

/*NO TOCAR*/
// Función para ocultar el spinner
export function ocultarSpinner() {
    action();
}

/*NO TOCAR*/
function action(visible = false) {
    const display = visible ? 'flex' : 'none';
    document.getElementById('spinner').style.display = display;
}