// tablero 
const SIZE = 7; // tamaño del tablero
const boardText = `
. . - > . . .
. . . . . . .
. . . . - - >
| . . . . . .
v . . . . - B
. . . . . . |
. . - - > . v
`;

/*
. . - > . . .
. . . . . . .
. . . . - - >
| . . . . . .
v . . . - B |
. . . . . . |
. . - - > . v
`;
*/ 

// imágenes disponibles según tipo y orientación
const images = {
  horizontal: {
    carro: ["recursos/azulhor.png"],
    camion: ["recursos/amarillohor.png", "recursos/celestehor.png"]
  },
  vertical: {
    carro: ["recursos/grisver.png", "recursos/cyanver.png"],
    camion: ["recursos/rosaver.png", "recursos/limaver.png"]
  },
  objetivo: "recursos/rojohor.png"
};

// coordenadas de la salida
const EXIT_ROW = 4;
const EXIT_COL = 6;

/*
function analizarTablero(tableroTexto) {
  const lineas = tableroTexto.trim().split("\n").map(linea => linea.trim().split(/\s+/));
  const vehiculos = [];
  const visitadas = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  // contadores para asignar imágenes
  const contadores = {
    hCarro: 0,
    hCamion: 0,
    vCarro: 0,
    vCamion: 0
  };

  let idVehiculo = 1;

  for (let fila = 0; fila < SIZE; fila++) {
    for (let columna = 0; columna < SIZE; columna++) {
      if (visitadas[fila][columna]) continue;

      const celda = lineas[fila][columna];

      // -----------------
      // Vehículo horizontal o objetivo
      // -----------------
      if (celda === "-" || celda === ">" || celda === "B") {
        let largo = 1;
        let colActual = columna;
        let esObjetivo = false;

        // Verificar si es el carro objetivo "- B"
        if (celda === "-" && colActual + 1 < SIZE && lineas[fila][colActual + 1] === "B") {
          largo = 2;
          esObjetivo = true;
          visitadas[fila][colActual + 1] = true;
        } else {
          while (colActual + 1 < SIZE && (lineas[fila][colActual + 1] === "-" || lineas[fila][colActual + 1] === ">")) {
            colActual++;
            largo++;
            visitadas[fila][colActual] = true;
          }
        }
        visitadas[fila][columna] = true;

        const tipo = largo === 3 ? "camion" : "carro";
        let imagen = null;

        if (esObjetivo) {
          imagen = images.objetivo;
        } else if (images.horizontal[tipo][contadores["h" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]]) {
          imagen = images.horizontal[tipo][contadores["h" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]++];
        }

        vehiculos.push({
          id: idVehiculo++,
          fila,
          columna,
          largo,
          orientacion: "H",
          esObjetivo,
          imagen
        });
      }

      // Vehículo vertical
      if (celda === "|" || celda === "v") {
        let largo = 1;
        let filaActual = fila;

        while (filaActual + 1 < SIZE && (lineas[filaActual + 1][columna] === "|" || lineas[filaActual + 1][columna] === "v")) {
          filaActual++;
          largo++;
          visitadas[filaActual][columna] = true;
        }
        visitadas[fila][columna] = true;

        const tipo = largo === 3 ? "camion" : "carro";
        let imagen = null;

        if (images.vertical[tipo][contadores["v" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]]) {
          imagen = images.vertical[tipo][contadores["v" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]++];
        }

        vehiculos.push({
          id: idVehiculo++,
          fila: filaActual - largo + 1,
          columna,
          largo,
          orientacion: "V",
          esObjetivo: false,
          imagen
        });
      }
    }
  }

  return vehiculos;
}
*/




// Funciones aux

// Determina si un vehículo horizontal es el objetivo
function esObjetivoHorizontal(lineas, fila, columna) {
  return lineas[fila][columna] === "-" && columna + 1 < SIZE && lineas[fila][columna + 1] === "B";
}

// Cuenta la longitud de un vehículo horizontal
function contarHorizontal(lineas, fila, columna) {
  let largo = 1;
  let colActual = columna;
  while (colActual + 1 < SIZE && (lineas[fila][colActual + 1] === "-" || lineas[fila][colActual + 1] === ">")) {
    colActual++;
    largo++;
  }
  return largo;
}

// Cuenta la longitud de un vehículo vertical
function contarVertical(lineas, fila, columna) {
  let largo = 1;
  let filaActual = fila;
  while (filaActual + 1 < SIZE && (lineas[filaActual + 1][columna] === "|" || lineas[filaActual + 1][columna] === "v")) {
    filaActual++;
    largo++;
  }
  return largo;
}

// Devuelve el tipo según la longitud
function obtenerTipo(largo) {
  return largo === 3 ? "camion" : "carro";
}

// Analiza el tablero y devuelve los vehículos con su información
function analizarTablero2(tableroTexto) {
  const lineas = tableroTexto.trim().split("\n").map(linea => linea.trim().split(/\s+/));
  const vehiculos = [];
  const visitadas = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  const contadores = { hCarro: 0, hCamion: 0, vCarro: 0, vCamion: 0 };
  let idVehiculo = 1;

  for (let fila = 0; fila < SIZE; fila++) {
    for (let columna = 0; columna < SIZE; columna++) {
      if (visitadas[fila][columna]) continue;
      const celda = lineas[fila][columna];

      // Vehículo horizontal u objetivo
      if (celda === "-" || celda === ">" || celda === "B") {
        let esObjetivo = esObjetivoHorizontal(lineas, fila, columna);
        let largo = esObjetivo ? 2 : contarHorizontal(lineas, fila, columna);

        // marcar como visitadas
        if (esObjetivo) visitadas[fila][columna + 1] = true;
        for (let c = columna; c < columna + largo; c++) visitadas[fila][c] = true;

        const tipo = obtenerTipo(largo);
        let imagen = esObjetivo ? images.objetivo : images.horizontal[tipo][contadores["h" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]];

        if (!esObjetivo) contadores["h" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]++;

        vehiculos.push({
          id: idVehiculo++,
          fila,
          columna,
          largo,
          orientacion: "H",
          esObjetivo,
          imagen
        });
      }

      // Vehículo vertical
      if (celda === "|" || celda === "v") {
        let largo = contarVertical(lineas, fila, columna);

        // marcar como visitadas
        for (let f = fila; f < fila + largo; f++) visitadas[f][columna] = true;

        const tipo = obtenerTipo(largo);
        let imagen = images.vertical[tipo][contadores["v" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]];
        contadores["v" + tipo.charAt(0).toUpperCase() + tipo.slice(1)]++;

        vehiculos.push({
          id: idVehiculo++,
          fila,
          columna,
          largo,
          orientacion: "V",
          esObjetivo: false,
          imagen
        });
      }
    }
  }

  return vehiculos;
}

// Renderizado del tablero
function mostrarTablero(vehiculos) {
  const tablero = document.getElementById("board");
  tablero.innerHTML = "";
  tablero.style.display = "grid";
  tablero.style.gridTemplateColumns = `repeat(${SIZE}, 50px)`;
  tablero.style.gridTemplateRows = `repeat(${SIZE}, 50px)`;
  tablero.style.gap = "4px";

  for (let vehiculo of vehiculos) {
    const divVehiculo = document.createElement("div");
    divVehiculo.className = "car";
    divVehiculo.style.gridRowStart = vehiculo.fila + 1;
    divVehiculo.style.gridColumnStart = vehiculo.columna + 1;
    divVehiculo.style.gridRowEnd = vehiculo.orientacion === "V" ? vehiculo.fila + 1 + vehiculo.largo : vehiculo.fila + 2;
    divVehiculo.style.gridColumnEnd = vehiculo.orientacion === "H" ? vehiculo.columna + 1 + vehiculo.largo : vehiculo.columna + 2;
    divVehiculo.style.backgroundSize = "cover";
    divVehiculo.style.backgroundPosition = "center";

    if (vehiculo.imagen) divVehiculo.style.backgroundImage = `url(${vehiculo.imagen})`;

    if (vehiculo.esObjetivo) {
      const span = document.createElement("span");
      span.textContent = "Objetivo";
      divVehiculo.appendChild(span);
    }

    tablero.appendChild(divVehiculo);
  }

  // Dibujar salida
  const divSalida = document.createElement("div");
  divSalida.style.gridRowStart = EXIT_ROW + 1;
  divSalida.style.gridColumnStart = EXIT_COL + 1;
  divSalida.style.gridRowEnd = EXIT_ROW + 2;
  divSalida.style.gridColumnEnd = EXIT_COL + 2;
  divSalida.style.backgroundColor = "green";
  divSalida.style.opacity = "0.5";
  divSalida.style.borderRadius = "4px";
  tablero.appendChild(divSalida);

  // Mostrar texto de la salida
  let textoSalida = document.getElementById("exit-text");
  if (!textoSalida) {
    textoSalida = document.createElement("p");
    textoSalida.id = "exit-text";
    textoSalida.style.marginTop = "10px";
    textoSalida.style.fontWeight = "bold";
    tablero.parentNode.insertBefore(textoSalida, tablero.nextSibling);
  }
  textoSalida.textContent = `Salida: fila ${EXIT_ROW}, columna ${EXIT_COL}`;
}


function esObjetivo(vehiculos) {
  const objetivo = vehiculos.find(v => v.esObjetivo);
  return objetivo.columna + objetivo.largo - 1 === EXIT_COL && objetivo.fila === EXIT_ROW;
}

// Breadth First Search
function breadthFirstSearch(tableroInicial) {
  if (esObjetivo(tableroInicial)) {
    mostrarResultado("El carro ya puede salir");
    return;
  

  }
  mostrarResultado("El carro todavía no puede salir");
}

function mostrarResultado(texto) {
  document.getElementById("resultado").textContent = texto;
}


function ejecutarBFS() {
  const tablero = analizarTablero2(boardText);
  breadthFirstSearch(tablero);
}


// Ejecutar
const vehiculos = analizarTablero2(boardText);
mostrarTablero(vehiculos);
