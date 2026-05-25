const formulario = document.getElementById('form-ruta');
const contenedor = document.getElementById('contenedor-rutas');

async function obtenerClima() {
    try {
        
        const respuesta = await fetch('https://wttr.in/Piedecuesta?format=j1');
        const datos = await respuesta.json();
        
        
        const temperatura = datos.current_condition[0].temp_C;
        const condicion = datos.current_condition[0].lang_es[0].value;
        
        return `${temperatura}°C, ${condicion}`;
    } catch (error) {
        return "Clima no disponible";
    }
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const ruta = document.getElementById('nombre-ruta').value;
    const conductor = document.getElementById('conductor').value;
    const hora = document.getElementById('hora-salida').value;

    
    const infoClima = await obtenerClima();

    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.classList.add('tarjeta-ruta'); 

    
    nuevaTarjeta.innerHTML = `
        <h3>Ruta: ${ruta}</h3>
        <p>Conductor: ${conductor}</p>
        <p>Salida: ${hora}</p>
        <p><strong>Clima actual:</strong> ${infoClima}</p>
        <button class="btn-eliminar">Eliminar Ruta</button>
        <hr>
    `;

    const botonEliminar = nuevaTarjeta.querySelector('.btn-eliminar');
    botonEliminar.addEventListener('click', () => {
        nuevaTarjeta.remove(); 
    });

    contenedor.appendChild(nuevaTarjeta);
    formulario.reset();
});