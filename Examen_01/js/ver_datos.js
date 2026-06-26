// =====================================
// VER_DATOS.JS - VISUALIZACIÓN DE ENTRENADORES Y EQUIPOS
// =====================================

console.log("=== VER_DATOS.JS CARGADO ===");

// =====================================
// FUNCIONES COMUNES
// =====================================

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// =====================================
// ENTRENADORES.HTML - MOSTRAR ENTRENADORES
// =====================================

async function mostrarEntrenadoresEnPagina() {
    console.log("=== Cargando entrenadores ===");
    
    const contenedor = document.getElementById("listaEntrenadores");
    if (!contenedor) {
        console.log("No hay contenedor listaEntrenadores");
        return;
    }
    
    try {
        // Inicializar IndexedDB
        await initDB();
        
        // Obtener todos los entrenadores
        const entrenadores = await obtenerEntrenadores();
        const equipos = await obtenerEquipos();
        console.log("Entrenadores encontrados:", entrenadores.length);
        console.log("Equipos encontrados:", equipos.length);
        
        contenedor.innerHTML = "";
        
        if (entrenadores.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info" role="alert">
                        No hay entrenadores registrados. 
                        <a href="crear_equipo.html" class="alert-link">Crea uno aquí</a>
                    </div>
                </div>
            `;
            return;
        }
        
        // Mostrar contador
        const contadorHTML = `
            <div class="col-12 mb-4 d-flex justify-content-between align-items-center">
                <h2>Total de entrenadores: ${entrenadores.length}</h2>
                <button class="btn btn-outline-danger" onclick="location.reload()">🔄 Recargar</button>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', contadorHTML);
        
        // Mostrar cada entrenador como carta
        entrenadores.forEach((entrenador, index) => {
            console.log("Mostrando entrenador:", entrenador.nombre);
            
            // Determinar imagen por defecto basada en el género
            const imagenPorDefecto = entrenador.sexo === "Masculino" 
                ? "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Scarlet_Florian.png"
                : "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_female_SM_concept_art.jpg";
            
            const imagen = entrenador.foto || imagenPorDefecto;
            const equiposDelEntrenador = equipos.filter(e => e.entrenador && e.entrenador.id === entrenador.id);
            const equipoListaHTML = equiposDelEntrenador.length > 0
                ? equiposDelEntrenador.map(e => `<li>${e.nombre || 'Equipo sin nombre'}</li>`).join('')
                : '<li>No tiene equipos registrados</li>';
            
            const html = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="cardPokemon">
                        <img src="${imagen}" 
                             alt="${entrenador.nombre}"
                             style="width:250px;height:250px;object-fit:contain;"
                             onerror="this.src='${imagenPorDefecto}'">
                        <div class="card-body">
                            <h3>${entrenador.nombre}</h3>
                            <div class="entrenador-info mt-3 p-3 bg-light rounded text-start">
                                <p class="mb-2"><strong>ID:</strong> ${entrenador.id || 'N/A'}</p>
                                <p class="mb-2"><strong>Localidad:</strong> ${entrenador.localidad || 'N/A'}</p>
                                <p class="mb-2"><strong>Género:</strong> ${entrenador.sexo || 'N/A'}</p>
                                <p class="mb-2"><strong>Dinero:</strong> $${entrenador.dinero ? entrenador.dinero.toLocaleString() : '0'}</p>
                                <p class="mb-2"><strong>Pokédex:</strong> ${entrenador.pokedex || 0}/151 capturados</p>
                                <p class="mb-2"><strong>Fecha de inicio:</strong> ${entrenador.fechaInicio || 'N/A'}</p>
                                <p class="mb-2"><strong>Equipos:</strong></p>
                                <ul class="mb-0 ps-3">
                                    ${equipoListaHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.insertAdjacentHTML('beforeend', html);
        });
        
    } catch (error) {
        console.error("Error cargando entrenadores:", error);
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Error cargando entrenadores: ${error.message}
                </div>
            </div>
        `;
    }
}

// =====================================
// EQUIPOS.HTML - MOSTRAR EQUIPOS
// =====================================

async function mostrarEquiposEnPagina() {
    console.log("=== Cargando equipos ===");
    
    const contenedor = document.getElementById("listaEquipos");
    if (!contenedor) {
        console.log("No hay contenedor listaEquipos");
        return;
    }
    
    try {
        // Inicializar IndexedDB
        await initDB();
        
        // Obtener todos los equipos
        const equipos = await obtenerEquipos();
        console.log("Equipos encontrados:", equipos.length);
        
        contenedor.innerHTML = "";
        
        if (equipos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        No hay equipos creados. 
                        <a href="crear_equipo.html">Crea uno aquí</a>
                    </div>
                </div>
            `;
            return;
        }
        
        // Mostrar contador
        const contadorHTML = `
            <div class="col-12 mb-4 d-flex justify-content-between align-items-center">
                <h2>Total de equipos: ${equipos.length}</h2>
                <button class="btn btn-outline-danger" onclick="location.reload()">🔄 Recargar</button>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', contadorHTML);
        
        // Mostrar cada equipo como carta
        equipos.forEach((equipo, index) => {
            console.log("Mostrando equipo:", equipo.nombre);
            
            // ID único para el contenedor de Pokémon
            const pokemonContainerId = `pokemon-team-${index}-${Date.now()}`;
            
            // HTML de la información del entrenador (si existe) - AHORA ARRIBA
            let entrenadorHTML = "";
            if (equipo.entrenador) {
                const imagenPorDefecto = equipo.entrenador.sexo === "Masculino"
                    ? "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Scarlet_Florian.png"
                    : "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_female_SM_concept_art.jpg";
                
                entrenadorHTML = `
                    <div class="entrenador-header mb-3 p-3 bg-light rounded text-center">
                        <img src="${equipo.entrenador.foto}" 
                             alt="${equipo.entrenador.nombre}" 
                             class="rounded mb-2" 
                             style="width:180px;height:180px;object-fit:contain;border:3px solid #dc3545;"
                             onerror="this.src='${imagenPorDefecto}'">
                        <h4 class="mb-2" style="color: #dc3545;">${equipo.entrenador.nombre}</h4>
                        <div class="entrenador-stats text-start">
                            <p class="mb-1"><strong>ID:</strong> ${equipo.entrenador.id || 'N/A'}</p>
                            <p class="mb-1"><strong>Localidad:</strong> ${equipo.entrenador.localidad || 'N/A'}</p>
                            <p class="mb-1"><strong>Género:</strong> ${equipo.entrenador.sexo}</p>
                            <p class="mb-1"><strong>Dinero:</strong> $${equipo.entrenador.dinero ? equipo.entrenador.dinero.toLocaleString() : '0'}</p>
                            <p class="mb-1"><strong>Pokédex:</strong> ${equipo.entrenador.pokedex || 0}/151</p>
                            <p class="mb-1"><strong>Inicio:</strong> ${equipo.entrenador.fechaInicio || 'N/A'}</p>
                        </div>
                    </div>
                `;
            }
            
            // HTML de la carta del equipo - AHORA ABAJO
            const html = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="cardPokemon">
                        <div class="card-body">
                            ${entrenadorHTML}
                            <hr class="my-3">
                            <h5 class="text-center mb-3">${equipo.nombre}</h5>
                            <div class="equipo-imagen text-center mb-3">
                                <img src="${equipo.imagen}" 
                                     alt="${equipo.nombre}"
                                     style="width:100px;height:100px;object-fit:contain;"
                                     onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png'">
                            </div>
                            <h6 class="text-center">Pokémon del Equipo:</h6>
                            <div id="${pokemonContainerId}" class="d-flex flex-wrap justify-content-center"></div>
                        </div>
                    </div>
                </div>
            `;
            
            contenedor.insertAdjacentHTML('beforeend', html);
            
            // Cargar Pokémon del equipo
            if (equipo.pokemon && equipo.pokemon.length > 0) {
                setTimeout(() => {
                    equipo.pokemon.forEach(pokeId => {
                        cargarPokemonEnEquipo(pokeId, pokemonContainerId);
                    });
                }, 100);
            }
        });
        
    } catch (error) {
        console.error("Error cargando equipos:", error);
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Error cargando equipos: ${error.message}
                </div>
            </div>
        `;
    }
}

// =====================================
// CARGAR POKÉMON INDIVIDUAL EN EQUIPO
// =====================================

function cargarPokemonEnEquipo(id, contenedorId) {
    console.log("Cargando Pokémon ID:", id);
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${id}`, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const pokemon = JSON.parse(xhr.responseText);
            const contenedor = document.getElementById(contenedorId);
            
            if (contenedor) {
                const imagenUrl = pokemon.sprites.other['official-artwork'].front_default || 
                                 pokemon.sprites.front_default || 
                                 `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                
                const pokemonHTML = `
                    <div class="text-center m-2" title="${pokemon.name}">
                        <img src="${imagenUrl}" 
                             width="60" 
                             height="60" 
                             alt="${pokemon.name}"
                             onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png'">
                        <br>
                        <small style="text-transform:capitalize;font-size:11px;">${pokemon.name}</small>
                    </div>
                `;
                
                contenedor.insertAdjacentHTML('beforeend', pokemonHTML);
            }
        } else if (xhr.readyState === 4) {
            console.error("Error cargando Pokémon " + id + ":", xhr.status);
        }
    };
    
    xhr.send();
}

// =====================================
// INICIALIZACIÓN AUTOMÁTICA
// =====================================

window.onload = async function() {
    console.log("=== Página cargada ===");
    
    // Detectar en qué página estamos y cargar los datos correspondientes
    const listaEntrenadores = document.getElementById("listaEntrenadores");
    const listaEquipos = document.getElementById("listaEquipos");
    
    if (listaEntrenadores) {
        console.log("Modo: entrenadores.html");
        await mostrarEntrenadoresEnPagina();
    }
    
    if (listaEquipos) {
        console.log("Modo: equipos.html");
        await mostrarEquiposEnPagina();
    }
};