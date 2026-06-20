
// ==========================================
// VARIABLES GLOBALES
// ==========================================

const listaPokemon = document.getElementById("listaPokemon");
const generacion = document.getElementById("generacion");
const buscar = document.getElementById("buscar");
const loading = document.getElementById("loading");

let listaCompleta = [];
let pokemonActualId = 0; // Para almacenar el ID del pokemon actual en el modal

// ==========================================
// AL CARGAR LA PÁGINA
// ==========================================

window.onload = function () {

    cargarGeneracion(0,151);

};

// ==========================================
// CAMBIAR GENERACIÓN
// ==========================================

generacion.addEventListener("change", function(){

    let datos = this.value.split(",");

    let offset = datos[0];

    let limit = datos[1];

    cargarGeneracion(offset,limit);

});

// ==========================================
// BUSCADOR
// ==========================================

buscar.addEventListener("keyup", function(){

    let texto = this.value.toLowerCase();

    let filtrados = listaCompleta.filter(function(pokemon){

        return pokemon.name.includes(texto);

    });

    mostrarPokemon(filtrados);

});

// ==========================================
// CARGAR GENERACIÓN
// ==========================================

function cargarGeneracion(offset,limit){

    loading.style.display="block";

    listaPokemon.innerHTML="";

    let url="https://pokeapi.co/api/v2/pokemon?offset="+offset+"&limit="+limit;

    let xhr=new XMLHttpRequest();

    xhr.open("GET",url,true);

    xhr.onreadystatechange=function(){

        if(xhr.readyState===4 && xhr.status===200){

            let respuesta=JSON.parse(xhr.responseText);

            listaCompleta=respuesta.results;

            mostrarPokemon(listaCompleta);

            loading.style.display="none";

        }

    };

    xhr.send();

}

// ==========================================
// MOSTRAR TARJETAS
// ==========================================

function mostrarPokemon(lista){

    listaPokemon.innerHTML="";

    lista.forEach(function(pokemon){

        let numero = obtenerNumeroPokemon(pokemon.url);

        let imagen = obtenerImagen(numero);

        let tarjeta=`

        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">

            <div class="cardPokemon"

                 onclick="detallePokemon('${pokemon.name}')">

                <img src="${imagen}">

                <div class="card-body">

                    <p class="numeroPokemon">

                        #${numero}

                    </p>

                    <h4 class="nombrePokemon">

                        ${capitalizar(pokemon.name)}

                    </h4>

                </div>

            </div>

        </div>

        `;

        listaPokemon.innerHTML += tarjeta;

    });

}

// ==========================================
// OBTENER NÚMERO DEL POKÉMON
// ==========================================

function obtenerNumeroPokemon(url){

    let partes = url.split("/");

    let numero = partes[6];

    return numero.padStart(3,"0");

}

// ==========================================
// OBTENER IMAGEN
// ==========================================

function obtenerImagen(numero){
    // Usar las imágenes oficiales de PokeAPI
    // El número ya viene con ceros a la izquierda (ej: "001"), pero la API de PokeAPI usa el número sin ceros
    let numeroSinCeros = parseInt(numero);
    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + numeroSinCeros + ".png";
}

// ==========================================
// PRIMERA LETRA MAYÚSCULA
// ==========================================

function capitalizar(texto){

    return texto.charAt(0).toUpperCase()+texto.slice(1);

}

// ==========================================
// MOSTRAR DETALLE DEL POKÉMON (MODAL)
// ==========================================

function detallePokemon(nombre){

    // Buscar el pokemon en la lista completa
    let pokemon = listaCompleta.find(function(p){
        return p.name === nombre;
    });

    if(!pokemon){
        console.error("Pokemon no encontrado:", nombre);
        return;
    }

    // Obtener el ID del pokemon
    let id = obtenerNumeroPokemon(pokemon.url);
    pokemonActualId = parseInt(id);

    // Obtener la imagen
    let imagen = obtenerImagen(id);

    // Cargar los datos básicos del modal
    document.getElementById("modalNombre").textContent = capitalizar(pokemon.name);
    document.getElementById("modalID").textContent = "#" + id;
    document.getElementById("modalImagen").src = imagen;

    // Limpiar contenidos anteriores
    document.getElementById("modalTipos").innerHTML = "";
    document.getElementById("modalHabilidades").innerHTML = "";
    document.getElementById("modalMovimientos").innerHTML = "";

    // Mostrar loading en el modal mientras cargan los datos
    document.getElementById("modalAltura").textContent = "Cargando...";
    document.getElementById("modalPeso").textContent = "Cargando...";

    // Obtener datos detallados del pokemon desde la API
    let urlDetalle = "https://pokeapi.co/api/v2/pokemon/" + pokemonActualId;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", urlDetalle, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            let datos = JSON.parse(xhr.responseText);

            // Altura y peso
            document.getElementById("modalAltura").textContent = (datos.height / 10) + " m";
            document.getElementById("modalPeso").textContent = (datos.weight / 10) + " kg";

            // Tipos
            let tiposHtml = "";
            datos.types.forEach(function(t){
                tiposHtml += '<span class="badge ' + t.type.name + '">' + capitalizar(t.type.name) + '</span>';
            });
            document.getElementById("modalTipos").innerHTML = tiposHtml;

            // Habilidades
            let habilidadesHtml = "";
            datos.abilities.forEach(function(a){
                habilidadesHtml += '<span class="habilidad">' + capitalizar(a.ability.name) + '</span>';
            });
            document.getElementById("modalHabilidades").innerHTML = habilidadesHtml;

            // Movimientos (mostrar solo los primeros 15)
            let movimientosHtml = "";
            let movimientos = datos.moves.slice(0, 15);
            movimientos.forEach(function(m){
                movimientosHtml += '<span class="movimiento">' + capitalizar(m.move.name) + '</span>';
            });
            if(datos.moves.length > 15){
                movimientosHtml += '<span class="movimiento">... y ' + (datos.moves.length - 15) + ' más</span>';
            }
            document.getElementById("modalMovimientos").innerHTML = movimientosHtml;
        }
    };
    xhr.send();

    // Abrir el modal
    let modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    modal.show();
}

// ==========================================
// NAVEGAR AL SIGUIENTE POKÉMON (+1)
// ==========================================

function siguientePokemon(){
    let siguienteId = pokemonActualId + 1;
    if(siguienteId > 1025){
        alert("¡No hay más Pokémon después del #1025!");
        return;
    }
    cargarDetallePorId(siguienteId);
}

// ==========================================
// NAVEGAR AL POKÉMON ANTERIOR (-1)
// ==========================================

function pokemonAnterior(){
    let anteriorId = pokemonActualId - 1;
    if(anteriorId < 1){
        alert("¡No hay Pokémon antes del #001!");
        return;
    }
    cargarDetallePorId(anteriorId);
}

// ==========================================
// CARGAR DETALLE POR ID (usado por navegación +1/-1)
// ==========================================

function cargarDetallePorId(id){
    pokemonActualId = id;

    // Actualizar ID en el modal
    let idFormateado = id.toString().padStart(3, "0");
    document.getElementById("modalID").textContent = "#" + idFormateado;

    // Actualizar imagen
    let imagen = obtenerImagen(idFormateado);
    document.getElementById("modalImagen").src = imagen;

    // Limpiar contenidos
    document.getElementById("modalTipos").innerHTML = "";
    document.getElementById("modalHabilidades").innerHTML = "";
    document.getElementById("modalMovimientos").innerHTML = "";
    document.getElementById("modalAltura").textContent = "Cargando...";
    document.getElementById("modalPeso").textContent = "Cargando...";

    // Obtener datos del pokemon
    let urlDetalle = "https://pokeapi.co/api/v2/pokemon/" + id;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", urlDetalle, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            let datos = JSON.parse(xhr.responseText);

            // Nombre
            document.getElementById("modalNombre").textContent = capitalizar(datos.name);

            // Altura y peso
            document.getElementById("modalAltura").textContent = (datos.height / 10) + " m";
            document.getElementById("modalPeso").textContent = (datos.weight / 10) + " kg";

            // Tipos
            let tiposHtml = "";
            datos.types.forEach(function(t){
                tiposHtml += '<span class="badge ' + t.type.name + '">' + capitalizar(t.type.name) + '</span>';
            });
            document.getElementById("modalTipos").innerHTML = tiposHtml;

            // Habilidades
            let habilidadesHtml = "";
            datos.abilities.forEach(function(a){
                habilidadesHtml += '<span class="habilidad">' + capitalizar(a.ability.name) + '</span>';
            });
            document.getElementById("modalHabilidades").innerHTML = habilidadesHtml;

            // Movimientos (mostrar solo los primeros 15)
            let movimientosHtml = "";
            let movimientos = datos.moves.slice(0, 15);
            movimientos.forEach(function(m){
                movimientosHtml += '<span class="movimiento">' + capitalizar(m.move.name) + '</span>';
            });
            if(datos.moves.length > 15){
                movimientosHtml += '<span class="movimiento">... y ' + (datos.moves.length - 15) + ' más</span>';
            }
            document.getElementById("modalMovimientos").innerHTML = movimientosHtml;
        }
    };
    xhr.send();
}
