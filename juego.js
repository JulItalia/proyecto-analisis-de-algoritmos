// Tablero por defecto
let SIZE = 7; // tamaño del tablero
let EXIT_ROW = 4; // fila de la salida
let EXIT_COL = 6; // columna de la salida
let boardTextDefault = `
. . - > . . . 
. . . . . . . 
. . . . - - > 
| . . . . . . 
v - B . | . | 
. . . . v . | 
. . - - > . v 
`;

/*
. . - > . . . 
. . . . . . . 
. . . . - - > 
| . . . . . . 
v - B . | . | 
. . . . v . | 
. . - - > . v 
`;
*/

/*
- > . . - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - B .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
- > - > - > - > - > - > .
`;
*/

/*
. . - > . . .
. . . . . . .
. . . . - - >
| . . . . . .
v - B . | . |
. . . . v . |
. . - - > . v
`;
*/

/*
. . - > . . .
. . . . . . .
. . . . - - >
| . . . . . .
v . . . . - B
. . . . . . |
. . - - > . v
`;
*/

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
let ultimoEstado = null;

// Imágenes disponibles según tipo y orientación
const images = {
  horizontal: {
    carro: ["recursos/naranjahor.png", "recursos/amarillohor.png", "recursos/verdehor.png", "recursos/amarverhor.png", "recursos/celestehor.png", "recursos/verdeaguahor.png", "recursos/azulhor.png", "recursos/moradohor.png", "recursos/purpurahor.png", "recursos/barneyhor.png", "recursos/rosahor.png", "recursos/rojohor.png"],
    camion: ["recursos/naranjahor2.png", "recursos/amarillohor2.png", "recursos/verdehor2.png", "recursos/amarverhor2.png", "recursos/celestehor2.png", "recursos/verdeaguahor2.png", "recursos/azulhor2.png", "recursos/moradohor2.png", "recursos/purpurahor2.png", "recursos/barneyhor2.png", "recursos/rosahor2.png", "recursos/rojohor2.png"]
  },
  vertical: {
    carro: ["recursos/naranjaver.png", "recursos/amarillover.png", "recursos/verdever.png", "recursos/verdeverdever.png", "recursos/celestever.png", "recursos/verdeaguaver.png", "recursos/azulver.png", "recursos/moradover.png", "recursos/purpuraver.png", "recursos/barneyver.png", "recursos/rosaver.png", "recursos/rojover.png"],
    camion: ["recursos/naranjaver2.png", "recursos/amarillover2.png", "recursos/verdever2.png", "recursos/verdeverdever2.png", "recursos/celestever2.png", "recursos/verdeaguaver2.png", "recursos/azulver2.png", "recursos/moradover2.png", "recursos/purpuraver2.png", "recursos/barneyver2.png", "recursos/rosaver2.png", "recursos/rojover2.png"]
  },
  objetivo: "recursos/deloreanhor.png"
};


// funciones auxiliares 

// Determina si un vehículo horizontal es el objetivo
function esObjetivoHorizontal(lineas, fila, columna) {
  return lineas[fila][columna] === "-" && columna + 1 < SIZE && lineas[fila][columna + 1] === "B";
}

// Cuenta la longitud de un vehículo horizontal
function contarHorizontal(lineas, fila, columna) {
  let largo = 1;
  let col = columna;
  while (col + 1 < SIZE && lineas[fila][col + 1] === "-") {
    largo++;
    col++;
  }
  if (col + 1 < SIZE && lineas[fila][col + 1] === ">") {
    largo++;
  }
  return Math.min(largo, 3);
}

// Cuenta la longitud de un vehículo vertical
function contarVertical(lineas, fila, columna) {
  let largo = 1;
  let f = fila;
  while (f + 1 < SIZE && lineas[f + 1][columna] === "|") {
    largo++;
    f++;
  }
  if (f + 1 < SIZE && lineas[f + 1][columna] === "v") {
    largo++;
  }
  return Math.min(largo, 3);
}

// Devuelve el tipo de vehivulo según la longitud del mismo
function obtenerTipo(largo) {
  if (largo === 3) {
    return "camion";
  } else {
    return "carro";
  }
}

// Analiza el tablero y devuelve los vehículos con su información
function analizarTablero2(tableroTexto) {
  const lineas = tableroTexto.trim().split("\n").map(linea => linea.trim().split(/\s+/));
  const vehiculos = [];
  const visitadas = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  let idVehiculo = 1;
  for (let fila = 0; fila < SIZE; fila++) {
    for (let columna = 0; columna < SIZE; columna++) {
      if (visitadas[fila][columna]) continue;
      const celda = lineas[fila][columna];

      // Vehículo horizontal u objetivo
      if (celda === "-" || celda === ">" || celda === "B") {
        let esObjetivo = esObjetivoHorizontal(lineas, fila, columna);
        let largo;
        if (esObjetivo) largo = 2; else largo = contarHorizontal(lineas, fila, columna);

        // marcar como visitadas
        if (esObjetivo) visitadas[fila][columna + 1] = true;
        for (let c = columna; c < columna + largo; c++) visitadas[fila][c] = true;

        const tipo = obtenerTipo(largo);
        let imagen;
        if (esObjetivo) {
          imagen = images.objetivo;
        } else {
          const imgArray = images.horizontal[tipo];
          imagen = imgArray[Math.floor(Math.random() * imgArray.length)];
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
        let largo = contarVertical(lineas, fila, columna);
        // marcar como visitadas
        for (let f = fila; f < fila + largo; f++) visitadas[f][columna] = true;
        const tipo = obtenerTipo(largo);
        const imgArray = images.vertical[tipo];
        const imagen = imgArray[Math.floor(Math.random() * imgArray.length)];
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

  const gap = 2;
  const cellSize = Math.max(30, 50 - (SIZE - 7) * 2);
  tablero.style.position = "relative";
  tablero.style.width = `${SIZE * (cellSize + gap)}px`;
  tablero.style.height = `${SIZE * (cellSize + gap)}px`;
  tablero.style.margin = "20px auto";
  tablero.style.border = "2px solid #444";
  tablero.style.backgroundColor = "#fff";
  tablero.style.boxSizing = "border-box";

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.position = "absolute";
      cell.style.left = `${c * (cellSize + gap)}px`;
      cell.style.top = `${r * (cellSize + gap)}px`;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.border = "1px solid #ccc";
      cell.style.backgroundColor = "#f9f9f9";
      tablero.appendChild(cell);
    }
  }

  vehiculos.forEach(v => {
    const div = document.createElement("div");
    div.className = "car";
    div.style.position = "absolute";
    div.style.left = `${v.columna * (cellSize + gap)}px`;
    div.style.top = `${v.fila * (cellSize + gap)}px`;
    div.style.backgroundImage = `url(${v.imagen})`;
    div.style.backgroundSize = "100% 100%";
    div.style.backgroundRepeat = "no-repeat";
    div.style.borderRadius = "5px";
    div.style.zIndex = "10";

    if (v.orientacion === "H") {
      div.style.width = `${v.largo * cellSize + (v.largo - 1) * gap}px`;
      div.style.height = `${cellSize}px`;
    } else {
      div.style.width = `${cellSize}px`;
      div.style.height = `${v.largo * cellSize + (v.largo - 1) * gap}px`;
    }

    if (v.esObjetivo) {
      const label = document.createElement("div");
      label.textContent = "OBJ";
      label.style.position = "absolute";
      label.style.bottom = "2px";
      label.style.right = "2px";
      label.style.fontSize = "10px";
      label.style.background = "rgba(0,0,0,0.6)";
      label.style.color = "white";
      label.style.padding = "1px 3px";
      label.style.borderRadius = "3px";
      div.appendChild(label);
    }

    tablero.appendChild(div);
  });

  const salida = document.createElement("div");
  salida.style.position = "absolute";
  salida.style.left = `${EXIT_COL * (cellSize + gap)}px`;
  salida.style.top = `${EXIT_ROW * (cellSize + gap)}px`;
  salida.style.width = `${cellSize}px`;
  salida.style.height = `${cellSize}px`;
  salida.style.backgroundColor = "green";
  salida.style.opacity = "0.5";
  salida.style.borderRadius = "4px";
  tablero.appendChild(salida);

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


// funciones para BFS y movimientos

// Verifica que el carro sea el objetivo
function esObjetivo(vehiculos) {
  const objetivo = vehiculos.find(v => v.esObjetivo);
  if (!objetivo) return false;

  // salida derecha
  if (objetivo.columna + objetivo.largo - 1 === EXIT_COL && objetivo.fila === EXIT_ROW) {
      return true;
  }

  // salida izquierda
  if (objetivo.columna === EXIT_COL && objetivo.fila === EXIT_ROW) {
      return true;
  }

  return false;
}

//Verifica si el objetivo está en la salida
function verifSalida(tableroTexto, salidaFila) {
  const vehiculos = analizarTablero2(tableroTexto);
  const objetivo = vehiculos.find(v => v.esObjetivo);
  if (!objetivo) return false;
  return objetivo.fila === salidaFila;
}

// Crea una copia de los vehículos
function crearEstado(vehiculos) {
  return vehiculos.map(v => ({ ...v }));
}

// Serializa el estado para evitar repetidos
function serializarEstado(vehiculos) {
  return vehiculos.map(v => `${v.id},${v.fila},${v.columna}`).join("|");
}

// Determina los movimientos posibles de un vehículo
function movimientosPosibles(v, vehiculos) { 
  const movimientos = [];

  const ocupado = (f, c) => {
    return vehiculos.some(o => {
      if (o.id === v.id) return false;

      let largoFila;
      if (o.orientacion === "V") {
        largoFila = o.largo;
      } else {
        largoFila = 1;
      }

      let largoCol;
      if (o.orientacion === "H") {
        largoCol = o.largo;
      } else {
        largoCol = 1;
      }

      return f >= o.fila &&
             f < o.fila + largoFila &&
             c >= o.columna &&
             c < o.columna + largoCol;
    });
  };

  if (v.orientacion === "H") {
    // izquierda
    let pasos = 0;
    while (v.columna - pasos - 1 >= 0 && !ocupado(v.fila, v.columna - pasos - 1)) {
      pasos++;
      movimientos.push({ nuevaFila: v.fila, nuevaColumna: v.columna - pasos, pasos, direccion: "izquierda" });
    }
    // derecha
    pasos = 0;
    while (v.columna + v.largo + pasos < SIZE && !ocupado(v.fila, v.columna + v.largo + pasos)) {
      pasos++;
      movimientos.push({ nuevaFila: v.fila, nuevaColumna: v.columna + pasos, pasos, direccion: "derecha" });
    }
  } else {
    // arriba
    let pasos = 0;
    while (v.fila - pasos - 1 >= 0 && !ocupado(v.fila - pasos - 1, v.columna)) {
      pasos++;
      movimientos.push({ nuevaFila: v.fila - pasos, nuevaColumna: v.columna, pasos, direccion: "arriba" });
    }
    // abajo
    pasos = 0;
    while (v.fila + v.largo + pasos < SIZE && !ocupado(v.fila + v.largo + pasos, v.columna)) {
      pasos++;
      movimientos.push({ nuevaFila: v.fila + pasos, nuevaColumna: v.columna, pasos, direccion: "abajo" });
    }
  }

  return movimientos;
}


// genera todos los movimientos posibles
function genMovSiguientes(vehiculos) {
  const movSiguientes = [];

  // recorre cada vehículo
  for (let i = 0; i < vehiculos.length; i++) {
    const v = vehiculos[i];
    // calcula todos los movimientos posibles para el vehículo
    const movimientos = movimientosPosibles(v, vehiculos);

    // genera un nuevo estado para cada movimiento posible
    for (const mov of movimientos) {
      //copia el estado actual
      const nuevoEstado = crearEstado(vehiculos);
      //se aplica el movimiento
      nuevoEstado[i].fila = mov.nuevaFila;
      nuevoEstado[i].columna = mov.nuevaColumna;

      // se crea una descripción del movimiento
      let pasosTexto;
      if (mov.pasos > 1) {
        pasosTexto = "s";
      } else {
        pasosTexto = "";
      }
      const descripcion = `Mover vehículo ${v.id} ${mov.direccion} (${mov.pasos} paso${pasosTexto})`;
      // se agrega el nuevo estado y movimiento al arreglo de sucesores 
      movSiguientes.push([nuevoEstado, descripcion]);
    }
  }

  return movSiguientes;
}

// Funcion del algoritmo BFS

function breadthFirstSearch(tableroInicial) {
  // se guardan los estados visitados para evitar repeticiones
  const visitados = new Set();
  // cola de estados por visitar
  const cola = [];

  const estadoInicial = crearEstado(tableroInicial);
  cola.push({ estado: estadoInicial, camino: [] });
  visitados.add(serializarEstado(estadoInicial));

  // ciclo para visitar todos los nodos
  let explorados = 0;
  while (cola.length > 0) {
    explorados++;
    const nodo = cola.shift();
    const { estado, camino } = nodo;

    if (esObjetivo(estado)) {
      let texto = "Solución encontrada en " + camino.length + " movimiento";
      if (camino.length !== 1) {
        texto = texto + "s";
    }
    mostrarResultado(texto, camino);

    ultimoEstado = estado;
    const btnActualizar = document.getElementById("btnActualizar");
    if (btnActualizar) {
      btnActualizar.disabled = false;
    }

    return camino;
  }

    // Genera los estados sucesores para poder visitarlos
    const sucesores = genMovSiguientes(estado);
    for (const [nuevoEstado, movimiento] of sucesores) {
      const clave = serializarEstado(nuevoEstado);
      if (!visitados.has(clave)) {
        visitados.add(clave);
        cola.push({ estado: nuevoEstado, camino: [...camino, movimiento] });
      }
    }
  }

  // Si no se encontró ninguna solución
  mostrarResultado(`No se encontró solución. Se exploraron: ${explorados} estados`, []);
  return null;
}

//Funcion del algoritmo DFS
function depthFirstSearch(tableroInicial) {
  // Se almacenan los estados visitados para evitar repeticiones
  const visitados = new Set();
  // Pila de estados por visitar
  const pila = [];

  // Copia el tablero inicial
  const estadoInicial = crearEstado(tableroInicial);
  pila.push({ estado: estadoInicial, camino: [] });
  visitados.add(serializarEstado(estadoInicial));

  // Ciclo para visitar el camino elegido hasta el fondo
  let explorados = 0;
  while (pila.length > 0) {
    explorados++;
    // Saca el último elemento
    const nodo = pila.pop();
    const { estado, camino } = nodo;

    // Verifica si el carro objetivo puede salir
    if (esObjetivo(estado)) {
      ultimoEstado = estado;
      const btnActualizar = document.getElementById("btnActualizar");
      if (btnActualizar) btnActualizar.disabled = false;

      let texto = "Solución encontrada en " + camino.length + " movimiento";
      if (camino.length !== 1) { 
          texto = texto + "s";
      }

      mostrarResultado(texto, camino);
      return camino;
    }

    // Genera estados sucesores
    const sucesores = genMovSiguientes(estado);

    // Agregar al final de la pila
    for (const [nuevoEstado, movimiento] of sucesores) {
      const clave = serializarEstado(nuevoEstado);
      if (!visitados.has(clave)) {
        visitados.add(clave);
        pila.push({ estado: nuevoEstado, camino: [...camino, movimiento] });
      }
    }
  }

  // Si no se encontró ninguna solución
  mostrarResultado(`No se encontró solución. Se exploraron: ${explorados} estados`, []);
  return null;
}

//Funcion para ejecutar el DFS con el tablero. Si hay solucion muestra la secuencia de movimientos
function ejecutarDFS() {
  const tablero = analizarTablero2(boardTextDefault);
  const solucion = depthFirstSearch(tablero);

  if (solucion && solucion.length > 0) {
    console.log("Secuencia de movimientos (DFS):");
    solucion.forEach((m, i) => console.log(`${i + 1}. ${m}`));
  }
}

//Funcion del algoritmo A*
function aStarSearch(tableroInicial) {
  // Se almacenan los estados visitados para evitar repeticiones
  const visitados = new Set();
  // Cola de estados por visitar
  const cola = [];
  
  // función heurística para saber cuantos autos hay que mover tomando en cuenta la ubicacion 
  // del auto rojo y cuantos vehiculos hay en la misma fila entre el y la salida
  function heuristica(estado) {
    const rojo = estado.find(v => v.esObjetivo);
    if (!rojo) return Infinity;
    
    const salida = EXIT_COL;
    const distancia = (salida - (rojo.columna + rojo.largo - 1));
    
    let bloqueadores = 0;
    for (const v of estado) {
      if (v.id === rojo.id) continue;
      if (v.orientacion === "V" &&
          v.columna > rojo.columna + rojo.largo - 1 &&
          v.columna <= salida &&
          rojo.fila >= v.fila &&
          rojo.fila < v.fila + v.largo) {
        bloqueadores++;
      }
    }
    return distancia + bloqueadores * 2;
  }

  // estado inicial
  const inicial = crearEstado(tableroInicial);
  const claveInicial = serializarEstado(inicial);
  cola.push({
    estado: inicial,
    camino: [],
    g: 0,
    f: heuristica(inicial)
  });
  visitados.add(claveInicial);

  //Ciclo del A* para visitar los mejores nodos
  let explorados = 0;
  while (cola.length > 0) {
    explorados++;
    // ordenar la cola utilizando el menor primero
    cola.sort((a, b) => a.f - b.f);
    const nodo = cola.shift();
    const { estado, camino, g } = nodo;

    // si llegamos al objetivo
    if (esObjetivo(estado)) {
      ultimoEstado = estado;
      const btnActualizar = document.getElementById("btnActualizar");
      if (btnActualizar) btnActualizar.disabled = false;

      let texto = "Solución encontrada en " + camino.length + " movimiento";
      if (camino.length !== 1) { 
        texto = texto + "s";
      }

      mostrarResultado(texto, camino);
      return camino;
    }

    // generar sucesores
    const sucesores = genMovSiguientes(estado);
    for (const [nuevoEstado, movimiento] of sucesores) {
      const clave = serializarEstado(nuevoEstado);
      if (visitados.has(clave)) continue;

      const nuevoG = g + 1;
      const nuevoH = heuristica(nuevoEstado);
      const nuevoF = nuevoG + nuevoH;

      visitados.add(clave);
      cola.push({
        estado: nuevoEstado,
        camino: [...camino, movimiento],
        g: nuevoG,
        f: nuevoF
      });
    }
    console.log(`g=${g}, h=${heuristica(estado)}, f=${g + heuristica(estado)}`);
  }

  //Si no se encontró solución
  mostrarResultado(`No se encontró solución. Se exploraron: ${explorados} estados`, []);
  return null;
}

//Funcion para ejecutar el A* con el tablero. Si hay solucion muestra la secuencia de movimientos
function ejecutarAEstrella() {
  const tablero = analizarTablero2(boardTextDefault);
  const solucion = aStarSearch(tablero);

  if (solucion && solucion.length > 0) {
    console.log("Secuencia de movimientos (A*):");
    solucion.forEach((m, i) => console.log(`${i + 1}. ${m}`));
  }
}


//interfaz

// Muestra resultado en pantalla
function mostrarResultado(texto, pasos = []) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";

  const mensaje = document.createElement("p");
  mensaje.textContent = texto;
  mensaje.style.fontWeight = "bold";
  resultadoDiv.appendChild(mensaje);

  if (pasos.length > 0) {
    const lista = document.createElement("ol");
    lista.style.textAlign = "left";
    lista.style.margin = "0 auto";
    lista.style.width = "fit-content";

    pasos.forEach(paso => {
      const li = document.createElement("li");
      li.textContent = paso;
      lista.appendChild(li);
    });

    resultadoDiv.appendChild(lista);
  }
}

// ejecuta BFS
function ejecutarBFS() {
  const tablero = analizarTablero2(boardTextDefault);
  const solucion = breadthFirstSearch(tablero);

  if (solucion && solucion.length > 0) {
    console.log("Secuencia de movimientos:");
    solucion.forEach((m, i) => console.log(`${i + 1}. ${m}`));
  }
}

function actualizarTablero() {
  if (ultimoEstado !== null) {
    mostrarTablero(ultimoEstado);
    alert("Tablero actualizado");
    const btnActualizar = document.getElementById("btnActualizar");
    if (btnActualizar) {
      btnActualizar.disabled = true;
    }
  } else {
    alert("Todavía no hay cambios");
  }
}


// personalizador

function personalizador() {
  document.getElementById("panelPersonalizado").style.display = "block";
}

function cancelarPersonalizado() {
  document.getElementById("panelPersonalizado").style.display = "none";
}

function guardarPersonalizado() {
  const tamano = parseInt(document.getElementById("tamanoTablero").value);
  const texto = document.getElementById("textoTablero").value.trim();
  const salidaFila = parseInt(document.getElementById("salidaFila").value);
  const salidaColumna = parseInt(document.getElementById("salidaColumna").value);

  if (tamano < 3 || tamano > 12) {
    alert("El tamaño del tablero debe estar entre 3 y 12");
    return;
  }

  if (isNaN(salidaFila) || isNaN(salidaColumna)) {
    alert("La salida no tiene una coordenada válida");
    return;
  }

  if (!verifSalida(texto, salidaFila, tamano)) {
    alert("El objetivo debe estar en la misma fila que la salida");
    return;
  }


  SIZE = tamano;
  boardTextDefault = texto;
  EXIT_ROW = salidaFila;
  EXIT_COL = salidaColumna;

  alert(
    `Nuevo tablero guardado:\n\nTamaño: ${tamano}x${tamano}\nSalida: (${salidaFila}, ${salidaColumna})\n\nTexto del tablero:\n${texto}`
  );

  document.getElementById("panelPersonalizado").style.display = "none";
  const vehiculosActualizados = analizarTablero2(boardTextDefault);
  mostrarTablero(vehiculosActualizados);
}

function probarValidacion() {
  const texto = document.getElementById("textoTablero").value.trim();
  const salidaFila = parseInt(document.getElementById("salidaFila").value);
  if (verifSalida(texto, salidaFila)) {
    alert("La sálida y el objetivo son válidos");
  } else {
    alert("El objetivo y la salida deben estar en la misma fila");
  }
}

function locObj(tableroTexto, tamanoOpt = null) {
  const filasRaw = tableroTexto.trim().split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (filasRaw.length === 0) return null;
  let filas;
  if (tamanoOpt) {
    filas = filasRaw.slice(0, tamanoOpt);
  } else {
    filas = filasRaw;
  }
  const tamañoInferido = tamanoOpt || filas.length;

  for (let r = 0; r < Math.min(tamañoInferido, filas.length); r++) {
    const cols = filas[r].split(/\s+/).filter(x => x !== "");
    for (let c = 0; c < Math.min(tamañoInferido, cols.length); c++) {
      if (cols[c] === "B") {
        return { fila: r, columna: c };
      }
    }
  }
  return null;
}

function verifSalida(tableroTexto, salidaFila, tamanoOpt = null) {
  const obj = locObj(tableroTexto, tamanoOpt);
  if (!obj) return false;
  return obj.fila === salidaFila;
}


// inicialización

window.onload = function() {
  const vehiculos = analizarTablero2(boardTextDefault);
  mostrarTablero(vehiculos);
};
