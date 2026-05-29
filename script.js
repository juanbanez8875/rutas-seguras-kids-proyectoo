class RouteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const id = this.getAttribute('id-ruta');
        const ruta = this.getAttribute('ruta');
        const conductor = this.getAttribute('conductor');
        const estudiantes = this.getAttribute('estudiantes');
        const hora = this.getAttribute('hora');
        const clima = this.getAttribute('clima');

        this.shadowRoot.innerHTML = `
            <style>
                .tarjeta-ruta {
                    background-color: white;
                    border-left: 5px solid #3498db;
                    border-radius: 8px;
                    padding: 15px;
                    width: 280px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    font-family: Arial, sans-serif;
                }
                h3 {
                    margin-top: 0;
                    color: #2c3e50;
                    font-size: 18px;
                }
                p {
                    margin: 8px 0;
                    color: #555;
                    font-size: 14px;
                }
                .btn-eliminar {
                    margin-top: 15px;
                    padding: 8px;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: bold;
                }
                .btn-eliminar:hover {
                    background-color: #c0392b;
                }
            </style>
            <div class="tarjeta-ruta">
                <h3>Ruta: ${ruta}</h3>
                <p>Conductor: ${conductor}</p>
                <p><strong>Estudiantes:</strong> ${estudiantes}</p>
                <p>Salida: ${hora}</p>
                <p><strong>Clima:</strong> ${clima}</p>
                <button class="btn-eliminar">Eliminar Ruta</button>
            </div>
        `;

        this.shadowRoot.querySelector('.btn-eliminar').addEventListener('click', () => {
            eliminarRutaDeMemoria(id);
            this.remove();
        });
    }
}

customElements.define('route-card', RouteCard);

const formulario = document.getElementById('form-ruta');
const contenedor = document.getElementById('contenedor-rutas');

let listaRutas = JSON.parse(localStorage.getItem('rutas_escolares')) || [];

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

function renderizarRutas() {
    contenedor.innerHTML = '';
    listaRutas.forEach(ruta => {
        const nuevaTarjeta = document.createElement('route-card');
        nuevaTarjeta.setAttribute('id-ruta', ruta.id);
        nuevaTarjeta.setAttribute('ruta', ruta.nombre);
        nuevaTarjeta.setAttribute('conductor', ruta.conductor);
        nuevaTarjeta.setAttribute('estudiantes', ruta.estudiantes);
        nuevaTarjeta.setAttribute('hora', ruta.hora);
        nuevaTarjeta.setAttribute('clima', ruta.clima);
        contenedor.appendChild(nuevaTarjeta);
    });
}

function eliminarRutaDeMemoria(id) {
    listaRutas = listaRutas.filter(ruta => ruta.id !== Number(id));
    localStorage.setItem('rutas_escolares', JSON.stringify(listaRutas));
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const nombre = document.getElementById('nombre-ruta').value;
    const conductor = document.getElementById('conductor').value;
    const estudiantes = document.getElementById('estudiantes-ruta').value;
    const hora = document.getElementById('hora-salida').value;

    const infoClima = await obtenerClima();

    const nuevaRuta = {
        id: Date.now(),
        nombre: nombre,
        conductor: conductor,
        estudiantes: estudiantes,
        hora: hora,
        clima: infoClima
    };

    listaRutas.push(nuevaRuta);
    localStorage.setItem('rutas_escolares', JSON.stringify(listaRutas));
    
    renderizarRutas();
    formulario.reset();
});
//agregar funcionalidad de filtro
const formularioFiltro = document.getElementById('form-ruta-filtro');
formularioFiltro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreRutaFiltro = document.getElementById('nombre-ruta-filtro').value.toLowerCase();
    const conductorFiltro = document.getElementById('conductor-filtro').value.toLowerCase();
    const estudiantesFiltro = parseInt(document.getElementById('estudiantes-filtro').value);
    const horaSalidaFiltro = document.getElementById('hora-salida-filtro').value;
    const tarjetas = contenedor.querySelectorAll('route-card');

    tarjetas.forEach(tarjeta => {
        const ruta = tarjeta.getAttribute('ruta').toLowerCase();
        const conductor = tarjeta.getAttribute('conductor').toLowerCase();
        const hora = tarjeta.getAttribute('hora');
        const estudiantes = parseInt(tarjeta.getAttribute('estudiantes')) || 0;
        const listaEstudiantes = tarjeta.getAttribute('estudiantes') ? tarjeta.getAttribute('estudiantes').split(',') : [];



        const coincideRuta = ruta.includes(nombreRutaFiltro);
        const coincideConductor = conductor.includes(conductorFiltro);
        const coincideEstudiantes = estudiantesFiltro ? estudiantes >= estudiantesFiltro : true;
        const coincideHora = horaSalidaFiltro ? hora >= horaSalidaFiltro : true; 

        if (coincideRuta && coincideConductor && coincideEstudiantes && coincideHora) {
            tarjeta.style.display = 'block';

renderizarRutas();
