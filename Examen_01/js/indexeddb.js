// =====================================
// INDEXEDDB.JS - BASE DE DATOS INDEXEDDB
// =====================================

const DB_NAME = "PokedexDB";
const DB_VERSION = 1;
const STORE_ENTRENADORES = "entrenadores";
const STORE_EQUIPOS = "equipos";

let db = null;

// =====================================
// INICIALIZAR INDEXEDDB
// =====================================
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function(event) {
            console.error("Error al abrir IndexedDB:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("IndexedDB abierta exitosamente");
            resolve(db);
        };

        request.onupgradeneeded = function(event) {
            const database = event.target.result;

            // Crear store de entrenadores si no existe
            if (!database.objectStoreNames.contains(STORE_ENTRENADORES)) {
                const entrenadoresStore = database.createObjectStore(STORE_ENTRENADORES, {
                    keyPath: "id",
                    autoIncrement: true
                });
                entrenadoresStore.createIndex("nombre", "nombre", { unique: false });
                console.log("Store de entrenadores creado");
            }

            // Crear store de equipos si no existe
            if (!database.objectStoreNames.contains(STORE_EQUIPOS)) {
                const equiposStore = database.createObjectStore(STORE_EQUIPOS, {
                    keyPath: "id",
                    autoIncrement: true
                });
                equiposStore.createIndex("nombre", "nombre", { unique: false });
                equiposStore.createIndex("entrenador", "entrenador", { unique: false });
                console.log("Store de equipos creado");
            }
        };
    });
}

// =====================================
// ENTRENADORES - OPERACIONES
// =====================================

// Agregar entrenador
function agregarEntrenador(entrenador) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_ENTRENADORES], "readwrite");
        const store = transaction.objectStore(STORE_ENTRENADORES);

        // Asegurar que tenga fecha
        if (!entrenador.fecha) {
            entrenador.fecha = new Date().toLocaleDateString('es-ES');
        }

        const request = store.add(entrenador);

        request.onsuccess = function(event) {
            console.log("Entrenador agregado con ID:", event.target.result);
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.error("Error al agregar entrenador:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Obtener todos los entrenadores
function obtenerEntrenadores() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_ENTRENADORES], "readonly");
        const store = transaction.objectStore(STORE_ENTRENADORES);
        const request = store.getAll();

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.error("Error al obtener entrenadores:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Buscar entrenador por nombre
function buscarEntrenadorPorNombre(nombre) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_ENTRENADORES], "readonly");
        const store = transaction.objectStore(STORE_ENTRENADORES);
        const index = store.index("nombre");
        
        // Usar getAll con rango para búsqueda parcial
        const request = store.openCursor();
        const resultados = [];

        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.nombre.toLowerCase().includes(nombre.toLowerCase())) {
                    resultados.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(resultados);
            }
        };

        request.onerror = function(event) {
            console.error("Error al buscar entrenador:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Eliminar entrenador
function eliminarEntrenador(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_ENTRENADORES], "readwrite");
        const store = transaction.objectStore(STORE_ENTRENADORES);
        const request = store.delete(id);

        request.onsuccess = function() {
            console.log("Entrenador eliminado con ID:", id);
            resolve();
        };

        request.onerror = function(event) {
            console.error("Error al eliminar entrenador:", event.target.error);
            reject(event.target.error);
        };
    });
}

// =====================================
// EQUIPOS - OPERACIONES
// =====================================

// Agregar equipo
function agregarEquipo(equipo) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_EQUIPOS], "readwrite");
        const store = transaction.objectStore(STORE_EQUIPOS);

        const request = store.add(equipo);

        request.onsuccess = function(event) {
            console.log("Equipo agregado con ID:", event.target.result);
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.error("Error al agregar equipo:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Obtener todos los equipos
function obtenerEquipos() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_EQUIPOS], "readonly");
        const store = transaction.objectStore(STORE_EQUIPOS);
        const request = store.getAll();

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.error("Error al obtener equipos:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Buscar equipo por nombre
function buscarEquipoPorNombre(nombre) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_EQUIPOS], "readonly");
        const store = transaction.objectStore(STORE_EQUIPOS);
        const request = store.openCursor();
        const resultados = [];

        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.nombre.toLowerCase().includes(nombre.toLowerCase())) {
                    resultados.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(resultados);
            }
        };

        request.onerror = function(event) {
            console.error("Error al buscar equipo:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Eliminar equipo
function eliminarEquipo(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_EQUIPOS], "readwrite");
        const store = transaction.objectStore(STORE_EQUIPOS);
        const request = store.delete(id);

        request.onsuccess = function() {
            console.log("Equipo eliminado con ID:", id);
            resolve();
        };

        request.onerror = function(event) {
            console.error("Error al eliminar equipo:", event.target.error);
            reject(event.target.error);
        };
    });
}

// =====================================
// MIGRACIÓN DESDE LOCALSTORAGE
// =====================================

// Verificar si ya se realizó la migración
function yaMigrado() {
    return localStorage.getItem("PokedexDB_Migrado") === "true";
}

// Marcar migración como completada
function marcarMigrado() {
    localStorage.setItem("PokedexDB_Migrado", "true");
}

// Función para migrar datos desde localStorage a IndexedDB
// Se ejecuta SIEMPRE para asegurar que los datos estén disponibles
function migrarDesdeLocalStorage() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("=== Iniciando migración/verificación desde localStorage ===");

            // Obtener datos actuales de IndexedDB
            let indexedDBEntrenadores = [];
            let indexedDBEquipos = [];
            
            try {
                await initDB();
                indexedDBEntrenadores = await obtenerEntrenadores();
                indexedDBEquipos = await obtenerEquipos();
            } catch (e) {
                console.log("IndexedDB vacío o no disponible");
            }

            // Migrar entrenadores desde localStorage
            const entrenadoresLS = localStorage.getItem("Entrenadores");
            if (entrenadoresLS) {
                const localStorageEntrenadores = JSON.parse(entrenadoresLS);
                console.log("localStorage tiene", localStorageEntrenadores.length, "entrenadores");
                console.log("IndexedDB tiene", indexedDBEntrenadores.length, "entrenadores");
                
                // Solo migrar si localStorage tiene más datos que IndexedDB
                if (localStorageEntrenadores.length > indexedDBEntrenadores.length) {
                    console.log("Migrando entrenadores faltantes...");
                    for (const entrenador of localStorageEntrenadores) {
                        // Verificar si ya existe por ID
                        const existe = indexedDBEntrenadores.some(e => e.id === entrenador.id);
                        if (!existe) {
                            try {
                                await initDB();
                                await agregarEntrenador(entrenador);
                                console.log("✅ Entrenador migrado:", entrenador.nombre);
                            } catch (error) {
                                console.warn("Error migrando entrenador:", error);
                            }
                        }
                    }
                }
            }

            // Migrar equipos desde localStorage
            const equiposLS = localStorage.getItem("Equipos");
            if (equiposLS) {
                const localStorageEquipos = JSON.parse(equiposLS);
                console.log("localStorage tiene", localStorageEquipos.length, "equipos");
                console.log("IndexedDB tiene", indexedDBEquipos.length, "equipos");
                
                // Solo migrar si localStorage tiene más datos que IndexedDB
                if (localStorageEquipos.length > indexedDBEquipos.length) {
                    console.log("Migrando equipos faltantes...");
                    for (const equipo of localStorageEquipos) {
                        try {
                            await initDB();
                            await agregarEquipo(equipo);
                            console.log("✅ Equipo migrado:", equipo.nombre);
                        } catch (error) {
                            console.warn("Error migrando equipo:", error);
                        }
                    }
                }
            }

            // Marcar como migrado
            marcarMigrado();
            console.log("=== Migración/verificación completada ===");

            resolve();
        } catch (error) {
            console.error("Error en migración:", error);
            reject(error);
        }
    });
}


// =====================================
// FUNCIÓN PARA OBTENER ENTRENADOR POR ID
// =====================================
  
function obtenerEntrenadorPorId(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_ENTRENADORES], "readonly");
        const store = transaction.objectStore(STORE_ENTRENADORES);
        const request = store.get(id);

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.error("Error al obtener entrenador:", event.target.error);
            reject(event.target.error);
        };
    });
}

// =====================================
//FUNCION PARA GENERAR UNA ID ALEATORIA A CADA VEZ QUE SE CREA UN NUEVO ENTRENADOR
// =====================================
function generarIdAleatorio() {
    return Math.floor(Math.random() * 1000000);
} 



// =====================================
// FUNCIÓN PARA OBTENER EQUIPO POR ID
// =====================================
function obtenerEquipoPorId(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_EQUIPOS], "readonly");
        const store = transaction.objectStore(STORE_EQUIPOS);
        const request = store.get(id);

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.error("Error al obtener equipo:", event.target.error);
            reject(event.target.error);
        };
    });
}

// =====================================
// FUNCIÓN PARA LIMPIAR DATOS (DEBUG)
// =====================================
function limpiarBaseDeDatos() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("IndexedDB no inicializada");
            return;
        }

        const transaction = db.transaction([STORE_ENTRENADORES, STORE_EQUIPOS], "readwrite");
        
        transaction.objectStore(STORE_ENTRENADORES).clear();
        transaction.objectStore(STORE_EQUIPOS).clear();

        transaction.oncomplete = function() {
            console.log("Base de datos limpiada");
            resolve();
        };

        transaction.onerror = function(event) {
            console.error("Error al limpiar:", event.target.error);
            reject(event.target.error);
        };
    });
}

// =====================================
// FUNCIÓN PARA ELIMINAR MIGRACIÓN (DEBUG)
// =====================================
function resetearMigracion() {
    localStorage.removeItem("PokedexDB_Migrado");
    console.log("Migración reseteada - se puede volver a migrar");
}
