# Tarea 6 IG - Leslie Liu Romero Martín

Para realizar la tarea, partimos del ejemplo de clase para aplicar las luces, sombras, texturas y vistas. Tras ello, se han implementado diversas funcionalidades adicionales que se explicarán más adelante.

## Luces

Por la parte de las luces, he decidido implementar solo luz ambiente para que se pueda apreciar el color de los planetas aunque la luz no les esté dando directamente, y una luz puntual en el centro de la escena, "dentro" del sol, para imitar el efecto del sol siendo la única fuente de luz en el sistema planetario.

A continación, podemos ver la implementación de las luces:

```js
// Luz ambiente
const Lamb = new THREE.AmbientLight(0xffe4b5, 0.3);
scene.add(Lamb);

// Luz puntual
const Lpunt = new THREE.PointLight(0xffe4b5, 2.5, 0, 2);
Lpunt.position.set(0, 0, 0);
Lpunt.castShadow = true;
scene.add(Lpunt);
```

Como se puede apreciar, se han retirado todos los controles y asistentes ya que no eran necesarios para la elaboración de esta práctica.

## Sombras

Con respecto a las sombras, también he optado por mantenerme fiel a los ejercicios de ejemplo ya que no se necesitaba de demasiada complejidad. Me he asegurado de que luz puntual genere sombra en los objectos con la tercera línea (castShadow):

```js
const Lpunt = new THREE.PointLight(0xffe4b5, 2.5, 0, 2);
Lpunt.position.set(0, 0, 0);
Lpunt.castShadow = true; // <--
scene.add(Lpunt);
```

Y a su vez, en los respectivos planetas y en la luna, les añadí las configuraciones necesarias para que puedan generar y recibir sombra:

```js
function Planeta(args) {
  // [...]
  planeta.castShadow = true;
  planeta.receiveShadow = true;
  // [...]
}

function Luna(args) {
  // [...]
  luna.receiveShadow = true;
  luna.castShadow = true;
  // [...]
}
```

## Texturas

Para las texturas, nos basamos en el ejemplo de clase para la implementación, sin embargo, en cuanto a variedad de texturas he querido experimentar y añadir bastante variedad de colores y formas a los distintos planetas. De hecho, como se puede apreciar a simple vista, aunque la Tierra, la Luna y el Sol están presentes, mi trabajo no representa de manera exacta el Sistema Solar, sino una versión más colorida y con más variedad de planetas.

Estas son las texturas que he decidido utilizar:
```js
// Texturas
const txtSun = new THREE.TextureLoader().load("src/textures/2k_sun.jpg");
const txtMoon = new THREE.TextureLoader().load("src/textures/2k_moon.jpg");
const txtSpace = new THREE.TextureLoader().load(
  "src/textures/galaxy-night-landscape.jpg"
);
const txtVolcanic = new THREE.TextureLoader().load(
  "src/textures/Volcanic.png"
);
const txtVenusian = new THREE.TextureLoader().load(
  "src/textures/Venusian.png"
);
const txtEarthDay = new THREE.TextureLoader().load(
  "src/textures/earthmap1k.jpg"
);
const txtEarthSpec = new THREE.TextureLoader().load(
  "src/textures/2k_earth_specular_map.tif"
);
const txtEarthClouds = new THREE.TextureLoader().load(
  "src/textures/2k_earth_clouds.jpg"
);
const txtEarthBump = new THREE.TextureLoader().load(
  "src/textures/earthbump1k.jpg"
);
const txtEarthAlpha = new THREE.TextureLoader().load(
  "src/textures/earthcloudmaptrans_invert.jpg"
);
const txtSwamp = new THREE.TextureLoader().load("src/textures/Swamp.png");
const txtMartian = new THREE.TextureLoader().load("src/textures/Martian.png");
const txtGas1 = new THREE.TextureLoader().load("src/textures/Gaseous1.png");
const txtGas2 = new THREE.TextureLoader().load("src/textures/Gaseous2.png");
const txtGas4 = new THREE.TextureLoader().load("src/textures/Gaseous4.png");

```

Además, no solo se han creado planetas con simples texturas, sino que para el caso especial de la Tierra, se le ha añadido cierto relieve tal y como se indicó en el ejemplo de clase, para darle cierta distinción con respecto al resto, aunque sea sutil.

Esta es la creación de la Tierra, que como se puede observar, contiene más de una textura:
```js
// Tierra
Planeta(
    scene,
    0.4,
    5,
    0.5,
    0xffffff,
    1.0,
    1.2,
    txtEarthDay,
    txtEarthBump,
    txtEarthSpec
);
```

Y esta sería la función Planeta, con todas las opciones para los distintos tipos de texturas siguiendo el ejemplo de clase:
```js
function Planeta(
  parent,
  radio,
  dist,
  vel,
  col,
  f1,
  f2,
  texture = undefined,
  texbump = undefined,
  texspec = undefined,
  texalpha = undefined,
) {
  let geom = new THREE.SphereGeometry(radio, 30, 30);
  let mat = new THREE.MeshPhongMaterial({ color: col });
  if (texture != undefined) {
    mat.map = texture;
  }
  // Textura
  if (texture != undefined) {
    mat.map = texture;
  }
  // Rugosidad
  if (texbump != undefined) {
    mat.bumpMap = texbump;
    mat.bumpScale = 1;
  }
  // Especular
  if (texspec != undefined) {
    mat.specularMap = texspec;
    mat.specular = new THREE.Color("orange");
  }
  if (texalpha != undefined) {
    //Con mapa de transparencia
    mat.alphaMap = texalpha;
    mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 1.0;
  }

  // Más cálculos
  // [...]
}
```

## Planetas

## Botones

Acerca de los botones, he declarado algunas funciones para automatizar la creación de los botones y su cambio de aspecto:

```js
function createButton(
  name,
  isActive,
  top = "",
  right = "",
  bottom = "",
  left = "",
  type = ""
) {
  let btn = document.createElement("button");
  btn.innerHTML = name;
  btn.classList.add("btn");
  if (isActive) {
    btn.classList.add("active-btn");
  }
  btn.style.top = top;
  btn.style.bottom = bottom;
  btn.style.left = left;
  btn.style.right = right;
  if (type == "mode") {
    modes.push(btn);
  } else if (type == "speed") {
    speeds.push(btn);
  }
  return btn;
}

function selectButton(button, list) {
  for (let b of list) {
    if (b == button) {
      b.classList.add("active-btn");
    } else {
      b.classList.remove("active-btn");
    }
  }
}
```

Estas funciones luego se llaman en el init() para poder crear los distintos botones para los cambios de modo (camera, flight, follow), los cambios de velocidad (x0.5, x0.1, x1.5) o el botón de pausa. Para cada botón, se le asigna una función de "onclick" que ejecutará una serie de instrucciones al pulsar el botón:

```js
pauseButton = createButton("Pause", false, "30px", "20px");
pauseButton.onclick = function () {
  if (pauseButton.innerHTML == "Pause") {
    pauseButton.classList.add("active-btn");
    pauseButton.innerHTML = "Paused";
    savedTimestamp = Date.now();
    pause = true;
  } else if (pauseButton.innerHTML == "Paused") {
    pauseButton.classList.remove("active-btn");
    pauseButton.innerHTML = "Pause";
    pause = false;
    offset += Date.now() - savedTimestamp;
  }
};

cameraButton = createButton("Camera Mode", true, "", "", "30px", "30px", "mode");
cameraButton.onclick = function() {
    selectButton(cameraButton, modes)
    camera.position.set(0, 2, -18);
    camcontrols.target.set(0, 0, 0);
    camcontrols.update();
    camcontrols.enabled = true;
    flyControls.enabled = false;
    mode = 0;
}


flightButton = createButton("Fight Mode", false, "", "", "30px", "150px", "mode");
flightButton.onclick = function() {
    selectButton(flightButton, modes)
    camera.position.set(estrella.position.x, estrella.position.y+1, estrella.position.z-8);
    camcontrols.target.set(0, 0, 0);
    camcontrols.update();
    spaceship.position.set(camera.position.x, camera.position.y, camera.position.z);
    camcontrols.enabled = false;
    flyControls.enabled = true;
    mode = 1;
}
```

## Funcionalidades: Pausa

Para la pausa, tras ciertas complicaciones, decidí implementarlo de manera que se calcule un "offset" cuando se pulsa el botón de pausa, este offset servirá como un valor auxiliar que se encarga de eliminar la diferencia desde que se pulsó el botón y los planetas pararon su movimiento, hasta que se vuelve a pulsar y se reanudan las rotaciones. De esta manera a la vista no es perceptible que haya pasado el tiempo. Todos estos cálculos se han tenido que realizar debido a que el movimiento de los planetas es dependiente del tiempo transcurrido desde que se inicializa la variable "t0".

El offset se encuentra en la función para el botón de pausa:

```js
pauseButton.onclick = function () {
  if (pauseButton.innerHTML == "Pause") {
    pauseButton.classList.add("active-btn");
    pauseButton.innerHTML = "Paused";
    savedTimestamp = Date.now();
    pause = true;
  } else if (pauseButton.innerHTML == "Paused") {
    pauseButton.classList.remove("active-btn");
    pauseButton.innerHTML = "Pause";
    pause = false;
    offset += Date.now() - savedTimestamp;
  }
};
```

Posteriormente, en el animate, el timestamp que interviene en la rotación de los planetas, se calcula con el offset:

```js
timestamp = (Date.now() - offset - t0) * accglobal;
```

## Funcionalidades: Modos

## Funcionalidades: Velocidades
