/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};


Plantilla.plantillaPersonas = {}

Plantilla.personaMostrada = null

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "Miguel Angel Carrasco Infante",
    email: "maci0002@red.ujaen.es",
    fecha: "13/08/01"
}

// Tags que voy a usar para sustituir los campos
Plantilla.plantillaTags = {
    "NOMBRE": "### NOMBRE ###",
    "APELLIDOS": "### APELLIDOS ###",

}
Plantilla.plantillaTagsTodos = {
    "NOMBRE": "### NOMBRE ###",
    "APELLIDOS": "### APELLIDOS ###",
    "fechaNacimiento": "### fechaNacimiento ###",
    "DIRECCION" : "### DIRECCION ###",
    "PESO" : "### PESO ###",
    "ALTURA" : "### ALTURA ###",
    "manoDominante" : "###  manoDominante ###",
    "clubActual" : "### clubActual ###",
    "nTorneosGanados" : "### nTorneosGanados ###",
    "nTorneosjugados" : "### nTorneosjugados ###"

}






/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos
    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos
    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos
    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Mensaje/a</b>: ${datosDescargados.mensaje}</li>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}




/**
 * Función para mostrar en pantalla todas las personas que se han recuperado de la BBDD.
 * @param {Vector_de_personas} vector Vector con los datos de las personas a mostrar
 */

Plantilla.imprimePersonas = function (vector) {
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaPersonas.cabecera
    vector.forEach(e => msj += Plantilla.plantillaPersonas.actualiza(e))
    msj += Plantilla.plantillaPersonas.pie

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Listado de personas", msj)
}

Plantilla.imprimeTodasPersonas = function (vector) {
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaPersonas.cabeceraTodos
    vector.forEach(e => msj += Plantilla.plantillaPersonas.actualizaTodos(e))
    msj += Plantilla.plantillaPersonas.pie

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Listado de personas", msj)
}

Plantilla.ordenaCampos = function(vector,campo){
    vector.sort(function(a,b)
     {
         let campoA = null; 
         let campoB = null;  
         
             campoA = a.data[campo].toUpperCase();
             campoB = b.data[campo].toUpperCase();
         
             if (campoA < campoB) {
                 return -1;
             }
             if (campoA > campoB) {
                 return 1;
             }
             return 0;
     });
     let msj = Plantilla.plantillaPersonas.cabecera
     if (vector && Array.isArray(vector)) {
         vector.forEach(e => msj += Plantilla.plantillaPersonas.actualizaTodos(e))
     }
     msj += Plantilla.plantillaPersonas.pie
     Frontend.Article.actualizar("Listado de personas solo con su nombre", msj)
    }
    Plantilla.ordenaNombre = function(vector,nombre){
        vector.sort(function(a,b)
         {
             let nombreA = null; 
             let nombreB = null;  
             
                 nombreA = a.data[nombre].toUpperCase();
                 nombreB = b.data[nombre].toUpperCase();
             
                 if (nombreA < nombreB) {
                     return -1;
                 }
                 if (nombreA > nombreB) {
                     return 1;
                 }
                 return 0;
         });
         let msj = Plantilla.plantillaPersonas.cabecera
         if (vector && Array.isArray(vector)) {
             vector.forEach(e => msj += Plantilla.plantillaPersonas.actualiza(e))
         }
         msj += Plantilla.plantillaPersonas.pie
         Frontend.Article.actualizar("Listado de personas solo con su nombre", msj)
        }
    

     


//Funciones para crear una table
//Funcion para crear la cabecera de una table
Plantilla.plantillaPersonas.cabecera = `<table width="100%" class="listado-personas">
                    <thead>
                        <th width="20%">Nombre</th>
                        <th width="20%">Apellidos</th>
                        

                  

                    </thead>
                    <tbody>
    `;
    Plantilla.plantillaPersonas.cabeceraTodos = `<table width="100%" class="listado-personas">
    <thead>
        <th width="20%">Nombre</th>
        <th width="20%">Apellidos</th>
        <th width="20%">F_nacimiento</th>
        <th width="20%">Direccion </th>
        <th width="20%">Peso</th>
        <th width="20%">Altura</th>
        <th width="20%">Mano dominante</th>
        <th width="20%">Club actual</th>
        <th width="20%">Número de torneos ganados</th>
        <th width="20%">Número de torneos jugados</th>


    </thead>
    <tbody>
`;
Plantilla.plantillaPersonas.pie = `        </tbody>
    </table>
    `;

//Cuerpo de la tabla
Plantilla.plantillaPersonas.cuerpo = `
    <tr title="${Plantilla.plantillaTags.NOMBRE}">
        <td>${Plantilla.plantillaTags.NOMBRE}</td>
        <td>${Plantilla.plantillaTags.APELLIDOS}</td>
        <td>
    </tr>
    `;
    Plantilla.plantillaPersonas.cuerpoTodas = `
    <tr title="${Plantilla.plantillaTagsTodos.NOMBRE}">
        <td>${Plantilla.plantillaTagsTodos.NOMBRE}</td>
        <td>${Plantilla.plantillaTagsTodos.APELLIDOS}</td>
        <td>${Plantilla.plantillaTagsTodos.fechaNacimiento}</td>
        <td>${Plantilla.plantillaTagsTodos.DIRECCION}</td> 
        <td>${Plantilla.plantillaTagsTodos.PESO}</td>
        <td>${Plantilla.plantillaTagsTodos.ALTURA}</td>
        <td>${Plantilla.plantillaTagsTodos.manoDominante}</td>
        <td>${Plantilla.plantillaTagsTodos.clubActual}</td>
        <td>${Plantilla.plantillaTagsTodos.nTorneosGanados}</td>
        <td>${Plantilla.plantillaTagsTodos.nTorneosjugados}</td>
        <td>
    </tr>
    `;


/** 
* Actualiza el cuerpo de la tabla con los datos de la persona que se le pasa
* @param {Persona} Persona Objeto con los datos de la persona que queremos escribir en el TR
* @returns La plantilla del cuerpo de la tabla con los datos actualizados
*/
Plantilla.plantillaPersonas.actualiza = function (persona) {
   return Plantilla.sustituyeTags(this.cuerpo, persona)
}

Plantilla.plantillaPersonas.actualizaTodos = function (persona) {
    return Plantilla.sustituyeTagsTodos(this.cuerpoTodas, persona)
 }

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos de la persona que se le pasa
 * @param {String} Plantilla Cadena conteniendo HTML en la que se desea cambiar lso campos de la plantilla por datos
 * @param {Persona} Persona Objeto con los datos de la persona que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados
 */
Plantilla.sustituyeTags = function (plantilla, persona) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.NOMBRE, 'g'), persona.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.APELLIDOS, 'g'), persona.data.apellidos)
        .replace(new RegExp(Plantilla.plantillaTags.APELLIDOS, 'g'), persona.data.apellidos)



}

Plantilla.sustituyeTagsTodos = function (plantilla, persona) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTagsTodos.NOMBRE, 'g'), persona.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.APELLIDOS, 'g'), persona.data.apellidos)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.fechaNacimiento, 'g'), persona.data.fechaNacimiento)        
        .replace(new RegExp(Plantilla.plantillaTagsTodos.DIRECCION, 'g'), persona.data.direccion)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.PESO, 'g'), persona.data.peso)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.ALTURA, 'g'), persona.data.altura)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.manoDominante, 'g'), persona.data.manoDominante)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.clubActual, 'g'), persona.data.clubActual)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.nTorneosGanados, 'g'), persona.data.nTorneosGanados)
        .replace(new RegExp(Plantilla.plantillaTagsTodos.nTorneosjugados, 'g'), persona.data.nTorneosJugados)
}


/**
 * Función que recuperar todas las personas llamando al MS Personas
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio personas
    try {
        const url = Frontend.API_GATEWAY + "/badminton/listarPersonas"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todas las persoans que se han descargado
    let vectorPersonas = null
    if (response) {
        vectorPersonas = await response.json()
        callBackFn(vectorPersonas.data)
    }
}
Plantilla.recuperaTodos = async function (callBackFn, campo) {
    let response = null

    // Intento conectar con el microservicio personas
    try {
        const url = Frontend.API_GATEWAY + "/badminton/listarPersonas"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todas las persoans que se han descargado
    let vectorPersonas = null
    if (response) {
        vectorPersonas = await response.json()
        callBackFn(vectorPersonas.data, campo)
    }
}
Plantilla.recuperaUna = async function (nombre, callBackFn) {
    try {
        const url = Frontend.API_GATEWAY + "/badminton/listarUna/" + nombre
        const response = await fetch(url);
        if (response) {
            const persona = await response.json()
            callBackFn(persona)
        }
    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
    }
}

Plantilla.personaTabla = function (persona){
    return Plantilla.plantillaPersonas.cabeceraTodos
    + Plantilla.plantillaPersonas.actualizaTodos(persona)
    + Plantilla.plantillaPersonas.pie;
}

Plantilla.imprimeUna = function (persona){
    let msj = Plantilla.personaTabla(persona)
    Frontend.Article.actualizar("Muestra una persona", msj)
    Plantilla.almacenaUna(persona)
}
Plantilla.almacenaUna = function (persona) {
    Plantilla.personaMostrada = persona;
}
Plantilla.mostrar = function (nombre){
    this.recuperaUna(nombre, this.imprimeUna)
}



/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/badminton/", this.mostrarHome);
}

Plantilla.procesarListarNombres = function (){
    Plantilla.recupera(Plantilla.imprimePersonas);
}

Plantilla.procesarListarTodos = function (){
    Plantilla.recupera(Plantilla.imprimeTodasPersonas);
}

Plantilla.procesarCampoOrdenado = function (campo){
    Plantilla.recuperaTodos(Plantilla.ordenaCampos, campo);
}

Plantilla.procesarOrdenadoAlfabeticamente = function (nombre){
    Plantilla.recuperaTodos(Plantilla.ordenaNombre, nombre);
}



/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/badminton/acercade", this.mostrarAcercaDe);
}



