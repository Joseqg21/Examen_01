// =====================================
// CREAR_DATOS.JS - CREACIÓN DE ENTRENADORES Y EQUIPOS
// =====================================

console.log("=== CREAR_DATOS.JS CARGADO ===");

// =====================================
// IMÁGENES DE ENTRENADORES POR GÉNERO
// =====================================

const ENTRENADOR_IMAGENES = {
    Masculino: [
        // Originales
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Scarlet_Florian.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Legends_Arceus_Rei.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_male_SM_concept_art.jpg",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_male_ORAS_concept_art.jpg",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_m_XY_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Waves_Male_Trainer.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Winds_Male_Trainer.png",
        // Nuevas variedades
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_male_XY_concept_art.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_M_XY_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_M_SM_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Swimmer_Male_XY.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Swimmer_Male_ORAS.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Black_Belt_XY_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Hiker_XY_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Bug_Catcher_FRLG_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Backpacker_m_XY_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Cooltrainer_m_RSE_OD.png"
    ],
    Femenino: [
        // Originales
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_female_SM_concept_art.jpg",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_female_ORAS_concept_art.jpg",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_F_ORAS_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_f_SM_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Macro_Cosmos_Employee_F_artwork.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Spr_Masters_Ace_Trainer_F.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Gold_Silver_Kimono_Girl.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Waves_Female_Trainer.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Winds_Female_Trainer.png",
        // Nuevas variedades
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_female_XY_concept_art.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_F_XY_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Ace_Trainer_F_SM_OD.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Swimmer_Female_XY.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Swimmer_Female_ORAS.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Beauty_F_DPPt.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Beauty_F_FRLG.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Kimono_Girl_HGSS.png",
        "https://archives.bulbagarden.net/wiki/Special:Redirect/file/Lass_DPPt.png"
    ]
};

// Almacenar nombres de Pokémon para los selectores
let pokemonNamesCache = {};

const GENERATION_RANGES = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 }
};

// =====================================
// FUNCIONES DE UTILIDAD
// =====================================

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function obtenerGeneracionSeleccionada(slot) {
    const generacionSelect = document.querySelector(`.generacion-slot[data-slot="${slot}"]`);
    return generacionSelect ? parseInt(generacionSelect.value, 10) : 1;
}

async function cargarPokemonEnSelectores(slot) {
    console.log(`Cargando Pokémon en selectores para slot ${slot}...`);
    
    const selector = document.querySelector(`.pokemon-select[data-slot="${slot}"]`);
    if (!selector) return;

    const generacion = obtenerGeneracionSeleccionada(slot);
    const rango = GENERATION_RANGES[generacion] || GENERATION_RANGES[1];

    selector.innerHTML = '<option value="">-- Seleccionar Pokémon --</option>';

    for (let i = rango.start; i <= rango.end; i++) {
        try {
            if (!pokemonNamesCache[i]) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const data = await response.json();
                pokemonNamesCache[i] = capitalizar(data.name);
            }
            const nombre = pokemonNamesCache[i];

            const option = document.createElement('option');
            option.value = i;
            option.textContent = `#${String(i).padStart(3, '0')} - ${nombre}`;
            selector.appendChild(option);
        } catch (error) {
            console.error(`Error cargando Pokémon ${i}:`, error);
        }
    }
    
    console.log(`Pokémon cargados en selectores para slot ${slot}, generación ${generacion}:`, rango.end - rango.start + 1);
}

// =====================================
// MOSTRAR VISTA PREVIA DE POKÉMON SELECCIONADO
// =====================================

async function mostrarPreviewPokemon(slot, pokemonId) {
    const previewDiv = document.getElementById(`preview-${slot}`);
    if (!previewDiv) return;
    
    if (!pokemonId) {
        previewDiv.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        const imagenUrl = data.sprites.other['official-artwork'].front_default || 
                         data.sprites.front_default || 
                         `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        
        previewDiv.innerHTML = `
            <img src="${imagenUrl}" 
                 alt="${data.name}" 
                 width="60" 
                 height="60"
                 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png'">
            <br>
            <small style="text-transform:capitalize;">${capitalizar(data.name)}</small>
        `;
    } catch (error) {
        console.error("Error mostrando preview:", error);
    }
}

// =====================================
// SELECCIONAR POKÉMON ALEATORIO EN UN SLOT
// =====================================

function seleccionarAleatorioEnSlot(slot) {
    const selector = document.querySelector(`.pokemon-select[data-slot="${slot}"]`);
    if (!selector) return;

    const generacion = obtenerGeneracionSeleccionada(slot);
    const rango = GENERATION_RANGES[generacion] || GENERATION_RANGES[1];
    const randomId = Math.floor(Math.random() * (rango.end - rango.start + 1)) + rango.start;

    selector.value = randomId;
    mostrarPreviewPokemon(slot, randomId);

    console.log(`Pokémon aleatorio seleccionado en slot ${slot}: #${randomId} - ${pokemonNamesCache[randomId] || 'Cargando...'}`);
}

// =====================================
// OBTENER POKÉMON SELECCIONADOS
// =====================================

function obtenerPokemonSeleccionados() {
    const seleccionados = [];
    const selectores = document.querySelectorAll('.pokemon-select');
    
    selectores.forEach(selector => {
        const value = selector.value;
        if (value) {
            seleccionados.push(parseInt(value));
        }
    });
    
    return seleccionados;
}

// =====================================
// GENERAR IMAGEN ALEATORIA DEL ENTRENADOR
// =====================================

function generarImagenAleatoria() {
    const sexoMasculino = document.getElementById("sexoMasculino");
    const sexo = sexoMasculino && sexoMasculino.checked ? "Masculino" : "Femenino";
    const imagenes = ENTRENADOR_IMAGENES[sexo];
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    const imagenUrl = imagenes[indiceAleatorio];
    
    console.log("Imagen generada:", { sexo, indiceAleatorio, imagenUrl });
    
    const preview = document.getElementById("previewEntrenador");
    const hiddenInput = document.getElementById("fotoEntrenador");
    if (preview) preview.src = imagenUrl;
    if (hiddenInput) {
        hiddenInput.value = imagenUrl;
        console.log("Foto guardada en hidden input:", hiddenInput.value);
    }
}

// =====================================
// INICIALIZAR FORMULARIO
// =====================================

function inicializarFormulario() {
    console.log("Inicializando formulario...");
    
    const btnRealeatorizar = document.getElementById("btnRealeatorizar");
    const sexoMasculino = document.getElementById("sexoMasculino");
    const sexFemenino = document.getElementById("sexFemenino");
    const formulario = document.getElementById("formEntrenadorEquipo");
    
    console.log("Elementos encontrados:", {
        btnRealeatorizar: !!btnRealeatorizar,
        sexoMasculino: !!sexoMasculino,
        sexFemenino: !!sexFemenino,
        formulario: !!formulario
    });
    
    if (btnRealeatorizar) {
        btnRealeatorizar.addEventListener("click", generarImagenAleatoria);
    }
    if (sexoMasculino) {
        sexoMasculino.addEventListener("change", generarImagenAleatoria);
    }
    if (sexFemenino) {
        sexFemenino.addEventListener("change", generarImagenAleatoria);
    }
    
    // Generar primera imagen
    generarImagenAleatoria();
    
    // Cargar Pokémon en selectores por slot
    const selectores = document.querySelectorAll('.pokemon-select');
    selectores.forEach(selector => {
        const slot = selector.getAttribute('data-slot');
        cargarPokemonEnSelectores(slot);
    });
    
    // Agregar event listeners a los selectores
    selectores.forEach(selector => {
        selector.addEventListener('change', function() {
            const slot = this.getAttribute('data-slot');
            const pokemonId = this.value;
            mostrarPreviewPokemon(slot, pokemonId);
        });
    });
    
    // Agregar event listeners a los selects de generación por slot
    const generacionSlots = document.querySelectorAll('.generacion-slot');
    generacionSlots.forEach(generacionSelect => {
        const slot = generacionSelect.getAttribute('data-slot');
        generacionSelect.addEventListener('change', function() {
            cargarPokemonEnSelectores(slot);
            const selector = document.querySelector(`.pokemon-select[data-slot="${slot}"]`);
            if (selector) selector.value = '';
            mostrarPreviewPokemon(slot, '');
        });
    });
    
    // Agregar event listeners a los botones aleatorios
    const botonesRandom = document.querySelectorAll('.btn-random');
    botonesRandom.forEach(boton => {
        boton.addEventListener('click', function() {
            const slot = this.getAttribute('data-slot');
            seleccionarAleatorioEnSlot(slot);
        });
    });
}

// =====================================
// MOSTRAR VISTA PREVIA DEL EQUIPO
// =====================================

function mostrarVistaPrevia(pokemonIds) {
    const contenedor = document.getElementById("vistaPreviaEquipo");
    if (!contenedor) {
        console.log("Contenedor vistaPreviaEquipo no encontrado");
        return;
    }
    
    const nombreEquipo = document.getElementById("nombreEquipo") ? document.getElementById("nombreEquipo").value : "Equipo sin nombre";
    const nombreEntrenador = document.getElementById("nombreEntrenador") ? document.getElementById("nombreEntrenador").value : "Entrenador";
    console.log("Mostrando vista previa con Pokémon:", pokemonIds);
    contenedor.style.display = "flex";
    
    // Limpiar vista previa anterior
    contenedor.innerHTML = "";
    
    const titleRow = document.createElement("div");
    titleRow.className = "col-12";
    titleRow.innerHTML = `
        <div class="text-center mb-4">
            <h3 class="mb-1">Vista Previa del Equipo</h3>
            <p class="mb-0"><strong>Equipo:</strong> ${nombreEquipo}</p>
            <p class="mb-0"><strong>Entrenador:</strong> ${nombreEntrenador}</p>
        </div>
    `;
    contenedor.appendChild(titleRow);
    
    // Cargar cada Pokémon
    pokemonIds.forEach(function(id) {
        console.log("Cargando Pokémon ID:", id);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${id}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const p = JSON.parse(xhr.responseText);
                    const tiposHTML = p.types.map(t => 
                        `<span class="badge tipo ${t.type.name}">${capitalizar(t.type.name)}</span>`
                    ).join("");
                    
                    const imagenUrl = p.sprites.other['official-artwork'].front_default || 
                                     p.sprites.front_default || 
                                     `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                    
                    const html = `<div class="col-md-4 col-sm-6 mb-4">
                        <div class="cardPokemon">
                            <img src="${imagenUrl}" alt="${p.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png'">
                            <div class="card-body">
                                <span class="numeroPokemon">#${String(p.id).padStart(3, '0')}</span>
                                <h3 class="nombrePokemon">${capitalizar(p.name)}</h3>
                                <div class="mt-2">${tiposHTML}</div>
                            </div>
                        </div>
                    </div>`;
                    
                    contenedor.insertAdjacentHTML('beforeend', html);
                } else {
                    console.error("Error cargando Pokémon " + id + ":", xhr.status);
                }
            }
        };
        xhr.send();
    });
}

// =====================================
// GUARDAR ENTRENADOR Y EQUIPO
// =====================================

async function manejarEnvioFormulario(e) {
    e.preventDefault();
    console.log("=== FORMULARIO ENVIADO ===");
    
    try {
        // Inicializar IndexedDB
        await initDB();
        
        const nombre = document.getElementById("nombreEntrenador").value;
        const nombreEquipo = document.getElementById("nombreEquipo").value;
        const sexo = document.getElementById("sexoMasculino").checked ? "Masculino" : "Femenino";
        const foto = document.getElementById("fotoEntrenador").value;
        const localidad = document.getElementById("localidadEntrenador") ? document.getElementById("localidadEntrenador").value : "";
        
        console.log("Datos del formulario:", { nombre, nombreEquipo, sexo, foto, localidad });
        
        if (!nombre) {
            alert("Por favor ingrese un nombre");
            return;
        }
        if (!nombreEquipo) {
            alert("Por favor ingrese un nombre para el equipo");
            return;
        }
        
        // Obtener Pokémon seleccionados manualmente
        let pokemonEquipo = obtenerPokemonSeleccionados();
        
        // Verificar que haya al menos un Pokémon
        if (pokemonEquipo.length === 0) {
            alert("⚠️ Debes seleccionar al menos un Pokémon. Usa los selectores o el botón 🎲 para elegir.");
            return;
        }
        
        // Verificar que no haya duplicados
        const unicos = [...new Set(pokemonEquipo)];
        if (unicos.length < pokemonEquipo.length) {
            alert("⚠️ Hay Pokémon duplicados en tu equipo. Se eliminarán los duplicados.");
            pokemonEquipo = unicos;
        }
        
        console.log("Pokémon del equipo:", pokemonEquipo);
        
        // Mostrar vista previa
        mostrarVistaPrevia(pokemonEquipo);
        
        // Generar datos del entrenador
        const id = generarIdAleatorio();
        const dinero = Math.floor(Math.random() * 5000) + 500;
        const pokedex = Math.floor(Math.random() * 151) + 1;
        const tiempoJugado = Math.floor(Math.random() * 100) + 1;
        const fechaInicio = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString();
        
        console.log("Datos generados:", { id, dinero, pokedex, tiempoJugado, fechaInicio });
        
        const entrenador = {
            id: id,
            nombre: nombre,
            sexo: sexo,
            foto: foto,
            localidad: localidad,
            dinero: dinero,
            pokedex: pokedex,
            tiempoJugado: tiempoJugado + " horas",
            fechaInicio: fechaInicio
        };
        
        console.log("Entrenador a guardar:", entrenador);
        
        // Guardar entrenador en IndexedDB
        await agregarEntrenador(entrenador);
        console.log("✅ Entrenador guardado en IndexedDB");
        
        // Crear equipo
        const equipo = {
            nombre: nombreEquipo,
            imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png",
            entrenador: entrenador,
            pokemon: pokemonEquipo
        };
        
        console.log("Equipo a guardar:", equipo);
        
        // Guardar equipo en IndexedDB
        await agregarEquipo(equipo);
        console.log("✅ Equipo guardado en IndexedDB");
        
        // Mostrar mensaje de éxito
        setTimeout(function() {
            alert("¡Entrenador y Equipo creados!\n\nNombre: " + nombre + 
                      "\nUbicación: " + localidad + 
                      "\nEquipo: " + equipo.nombre + 
                      "\nPokémon: " + pokemonEquipo.join(", ") + 
                      "\n\nAhora ve a Equipos o Entrenadores para verlos.");
                
                // Limpiar formulario
                document.getElementById("nombreEntrenador").value = "";
                if (document.getElementById("localidadEntrenador")) {
                    document.getElementById("localidadEntrenador").value = "";
                }
            // Limpiar selectores
            document.querySelectorAll('.pokemon-select').forEach(s => s.value = "");
            document.querySelectorAll('.pokemon-preview').forEach(p => p.innerHTML = "");
        }, 500);
        
    } catch (error) {
        console.error("Error guardando datos:", error);
        alert("Error al guardar los datos: " + error.message);
    }
}

// =====================================
// INICIALIZACIÓN
// =====================================

window.onload = function() {
    console.log("window.onload ejecutado");
    
    const formulario = document.getElementById("formEntrenadorEquipo");
    if (formulario) {
        console.log("Formulario encontrado, agregando event listener");
        formulario.addEventListener("submit", manejarEnvioFormulario);
        inicializarFormulario();
    } else {
        console.log("Formulario NO encontrado");
    }
};