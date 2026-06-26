// =====================================
// CREAR_ENTRENADOR_SIMPLE.JS - CREACIÓN SIMPLE DE ENTRENADORES
// =====================================

console.log("=== CREAR_ENTRENADOR_SIMPLE.JS CARGADO ===");

// =====================================
// IMÁGENES DE ENTRENADORES POR GÉNERO
// =====================================

const IMAGENES_ENTRENADORES = {
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

// Función para obtener imagen aleatoria
function obtenerImagenAleatoria(sexo) {
    const imagenes = IMAGENES_ENTRENADORES[sexo] || IMAGENES_ENTRENADORES.Masculino;
    const indice = Math.floor(Math.random() * imagenes.length);
    return imagenes[indice];
}

// =====================================
// MANEJAR ENVÍO DEL FORMULARIO
// =====================================

async function manejarEnvioFormulario(e) {
    e.preventDefault();
    console.log("=== FORMULARIO ENVIADO ===");
    
    try {
        // Inicializar IndexedDB
        await initDB();
        
        const nombre = document.getElementById("nombre").value;
        const sexo = document.getElementById("sexo").value;
        const residencia = document.getElementById("residencia").value;
        let foto = document.getElementById("foto").value;
        
        // Si no hay foto, usar una aleatoria según el género
        if (!foto) {
            foto = obtenerImagenAleatoria(sexo);
        }
        
        console.log("Datos del formulario:", { nombre, sexo, residencia, foto });
        
        // Generar ID único (solo números)
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const dinero = Math.floor(Math.random() * 5000) + 500;
        const pokedex = Math.floor(Math.random() * 151) + 1;
        const tiempoJugado = Math.floor(Math.random() * 100) + 1;
        const fechaInicio = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString();
        
        // Crear objeto entrenador
        const entrenador = {
            id: id,
            nombre: nombre,
            sexo: sexo,
            residencia: residencia,
            foto: foto,
            dinero: dinero,
            pokedex: pokedex,
            tiempoJugado: tiempoJugado + " horas",
            fechaInicio: fechaInicio
        };
        
        console.log("Entrenador a guardar:", entrenador);
        
        // Guardar entrenador en IndexedDB
        await agregarEntrenador(entrenador);
        console.log("✅ Entrenador guardado en IndexedDB");
        
        alert("Entrenador guardado exitosamente");
        
        // Limpiar formulario
        e.target.reset();
        
        // Redirigir a la página de entrenadores
        window.location.href = "entrenadores.html";
        
    } catch (error) {
        console.error("Error guardando entrenador:", error);
        alert("Error al guardar el entrenador: " + error.message);
    }
}

// =====================================
// INICIALIZACIÓN
// =====================================

window.onload = function() {
    console.log("window.onload ejecutado");
    
    const formulario = document.getElementById("formEntrenador");
    if (formulario) {
        console.log("Formulario encontrado, agregando event listener");
        formulario.addEventListener("submit", manejarEnvioFormulario);
    } else {
        console.log("Formulario NO encontrado");
    }
};