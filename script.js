const formulario = document.getElementById('form-ruta');
const contenedor = document.getElementById('contenedor-rutas');

formulario.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const ruta = document.getElementById('nombre-ruta').value;
    const conductor = document.getElementById('conductor').value;
    const hora = document.getElementById('hora-salida').value;

    // Creación del elemento visual
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.classList.add('tarjeta-ruta'); 

    nuevaTarjeta.innerHTML = `
        <h3>Ruta: ${ruta}</h3>
        <p>Conductor: ${conductor}</p>
        <p>Salida: ${hora}</p>
        <button class="btn-eliminar">Eliminar Ruta</button>
        <hr>
    `;

    // Lógica para eliminar la tarjeta
    const botonEliminar = nuevaTarjeta.querySelector('.btn-eliminar');
    botonEliminar.addEventListener('click', () => {
        nuevaTarjeta.remove(); 
    });

    // Inserción en la pantalla
    contenedor.appendChild(nuevaTarjeta);
    formulario.reset();
});