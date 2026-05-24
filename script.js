const formulario = document.getElementById('form-ruta');

formulario.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const ruta = document.getElementById('nombre-ruta').value;
    const conductor = document.getElementById('conductor').value;
    const hora = document.getElementById('hora-salida').value;

    console.log({ ruta, conductor, hora });

    formulario.reset();
});