# Tarea 6 IG - Leslie Liu Romero Martín

Para realizar la tarea, partimos del ejemplo de clase para aplicar las luces, sombras, texturas y vistas. Por la parte de las luces, he decidido implementar solo luz ambiente para que se pueda apreciar el color de los planetas aunque la luz no les esté dando directamente, y una luz puntual en el centro de la escena, "dentro" del sol, para imitar el efecto del sol siendo la única fuente de luz en el sistema planetario.

## Luces

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
