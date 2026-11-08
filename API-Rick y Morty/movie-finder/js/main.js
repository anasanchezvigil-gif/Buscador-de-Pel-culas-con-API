// Referencias a elementos del DOM (respetando los IDs del index.html original)
const formBusqueda = document.getElementById('form-busqueda');
const inputPelicula = document.getElementById('input-pelicula');
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const loading = document.getElementById('loading');
const alertaError = document.getElementById('alerta-error');
const errorMensaje = document.getElementById('error-mensaje');

// OMDb API Key pública para pruebas
const API_KEY = 'trilogy';
const API_URL = 'https://www.omdbapi.com/';

// Escuchar el evento submit del formulario (Paso 2)
formBusqueda.addEventListener('submit', (event) => {
  event.preventDefault();
  const tituloBusqueda = inputPelicula.value.trim();

  if (tituloBusqueda) {
    buscarPeliculas(tituloBusqueda);
  }
});

// Paso 2: Conectar con la API usando fetch()
async function buscarPeliculas(titulo) {
  // Limpiar estados anteriores y mostrar spinner de carga
  limpiarPantalla();
  loading.classList.remove('d-none');

  try {
    const respuesta = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(titulo)}`);

    if (!respuesta.ok) {
      throw new Error('Error al conectar con la API.');
    }

    const datos = await respuesta.json();

    // Paso 4: Manejar errores cuando no se encuentran resultados
    if (datos.Response === 'False') {
      mostrarError('Película no encontrada.');
      return;
    }

    // Paso 3: Mostrar los resultados
    mostrarResultados(datos.Search);

  } catch (error) {
    // Paso 4: Manejo de errores de conexión o red
    mostrarError('Ocurrió un error de conexión. Inténtalo de nuevo más tarde.');
    console.error('Error Fetch:', error);
  } finally {
    loading.classList.add('d-none');
  }
}

// Paso 3: Renderizado en el DOM de Título, Año e Imagen/Detalles
function mostrarResultados(peliculas) {
  peliculas.forEach((pelicula) => {
    const poster = pelicula.Poster !== 'N/A' 
      ? pelicula.Poster 
      : 'https://via.placeholder.com/300x450?text=Sin+Imagen';

    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card h-100 bg-secondary bg-opacity-10 border-secondary shadow-sm">
        <img src="${poster}" class="card-img-top" alt="${pelicula.Title}" style="height: 350px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-light">${pelicula.Title}</h5>
          <p class="card-text text-primary fw-bold mb-1">Año: ${pelicula.Year}</p>
          <p class="card-text text-secondary small">Tipo: ${pelicula.Type.toUpperCase()}</p>
        </div>
      </div>
    `;

    contenedorTarjetas.appendChild(col);
  });
}

function mostrarError(mensaje) {
  errorMensaje.textContent = mensaje;
  alertaError.classList.remove('d-none');
}

function limpiarPantalla() {
  contenedorTarjetas.innerHTML = '';
  alertaError.classList.add('d-none');
  errorMensaje.textContent = '';
}