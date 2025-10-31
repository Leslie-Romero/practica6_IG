import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->

const loader = new GLTFLoader();

let spaceship;

let scene;
let camera;
let renderer;
let estrella,
  Planetas = [],
  Lunas = [],
  Asteroides = [];
let planetSpeeds = [];

let t0 = 0;
let timestamp;
let accglobal = 0.001;

let info;
let pauseButton, cameraButton, followButton, speed1, speed2, speed3;
let speedConfig = 1.0;
let modes = [];
let ogSpeeds = [];
let speeds = [];
let flightButton;
let pause = false;
let offset = 0;
let savedTimestamp = 0;
let mode = 0;
let camcontrols;
let flyControls;
let lastTimestamp;

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
const txtSwamp = new THREE.TextureLoader().load("./src/textures/Swamp.png");
const txtMartian = new THREE.TextureLoader().load("src/textures/Martian.png");
const txtGas1 = new THREE.TextureLoader().load("src/textures/Gaseous1.png");
const txtGas2 = new THREE.TextureLoader().load("src/textures/Gaseous2.png");
const txtGas4 = new THREE.TextureLoader().load("src/textures/Gaseous4.png");

init();
animate();

function createButton(name, isActive, top = "", right = "", bottom = "", left = "", type = "") {
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
  if (type == "mode"){
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

function init() {
  // Texto informacion
  info = document.createElement("div");
  info.classList.add("info");
  info.innerHTML = "Práctica 6 - Leslie Romero";
  document.body.appendChild(info);

  loader.load('public/mevak_shuttle.glb',
    function (gltf) {
      spaceship = gltf.scene;
      spaceship.scale.set(0.001, 0.001, 0.001);
      spaceship.position.set(0, -6, 0);
      scene.add(spaceship);
    }
  )
  

  let textures = [
    txtSun,
    txtMoon,
    txtSpace,
    txtVolcanic,
    txtVenusian,
    txtEarthDay,
    txtEarthSpec,
    txtEarthClouds,
    txtSwamp,
    txtMartian,
    txtGas1,
    txtGas2,
    txtGas4,
  ];

  for (let texture of textures) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, -18);

  scene.background = txtSpace;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  camcontrols = new OrbitControls(camera, renderer.domElement);
  camcontrols.enabled = true;
  flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.enabled = false;
  flyControls.dragToLook = true;
  flyControls.movementSpeed = 2;
  flyControls.rollSpeed = 0.5;

  Estrella(2, 0xffff00, txtSun);
  // Volcánico
  Planeta(scene, 0.2, 3, 0.4, 0xffffff, 1.0, 1.0, txtVolcanic);
  // Venusiano
  Planeta(scene, 0.3, 4, 0.3, 0xffffff, 1.0, 1.0, txtVenusian);
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
  // Luna
  Luna(Planetas[2], 0.1, 0.6, 0.4, 0xffffff, Math.PI / 2, txtMoon);
  // Swamp
  Planeta(scene, 0.45, 7, 0.35, 0xffffff, 1.1, 1.0, txtSwamp);
  // Martian
  Planeta(scene, 0.3, 9, 0.25, 0xffffff, 1.0, 1.0, txtMartian);
  // Gaseoso 1
  Planeta(scene, 0.7, 10.5, 0.2, 0xffffff, 1.0, 1.0, txtGas1);
  // Gaseoso 2
  Planeta(scene, 0.6, 12, 0.22, 0xffffff, 1.0, 1.0, txtGas2);
  // Gaseoso 4
  Planeta(scene, 0.8, 13.5, 0.15, 0xffffff, 1.0, 1.1, txtGas4);

  for (let planeta of Planetas) {
    ogSpeeds.push(planeta.userData.speed);
  }

  // Botón de pausa
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
  document.body.appendChild(pauseButton);

  // Botón modo camera
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
  document.body.appendChild(cameraButton);

  // Botón modo vuelo
  flightButton = createButton("Flight Mode", false, "", "", "30px", "150px", "mode");
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
  document.body.appendChild(flightButton);

  // Follow mode
  followButton = createButton("Follow Mode", false, "", "", "30px", "250px", "mode");
  followButton.onclick = function() {
    selectButton(followButton, modes);
    camera.position.set(Planetas[2].position.x, Planetas[2].position.y-4, Planetas[2].position.z+2);
    mode = 2;
  }
  document.body.appendChild(followButton);

  // Speed buttons
  speed1 = createButton("x0.5", false, "30px", "", "", "30px", "speed");
  speed1.onclick = function() {
    selectButton(speed1, speeds);
    speedConfig = 0.5;
    t0 = Date.now();
  }
  document.body.appendChild(speed1);
  speed2 = createButton("x1.0", true, "30px", "", "", "80px", "speed");
  speed2.onclick = function() { 
    selectButton(speed2, speeds);
    speedConfig = 1.0;
    t0 = Date.now();
  }
  document.body.appendChild(speed2);
  speed3 = createButton("x1.5", false, "30px", "", "", "130px", "speed");
  speed3.onclick = function() { 
    selectButton(speed3, speeds);
    speedConfig = 1.5;
    t0 = Date.now();
  }
  document.body.appendChild(speed3);

  // Luz ambiente
  const Lamb = new THREE.AmbientLight(0xffe4b5, 0.3);
  scene.add(Lamb);

  // Luz puntual
  const Lpunt = new THREE.PointLight(0xffe4b5, 2.5, 0, 2);
  Lpunt.position.set(0, 0, 0);
  Lpunt.castShadow = true;
  scene.add(Lpunt);

  //Inicio tiempo
  t0 = Date.now();
}

function Estrella(rad, col, texture = undefined) {
  let geometry = new THREE.SphereGeometry(rad, 30, 30);
  let material = new THREE.MeshBasicMaterial({ color: col });
  if (texture != undefined) {
    material.map = texture;
  }
  estrella = new THREE.Mesh(geometry, material);
  scene.add(estrella);
}

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
  let planeta = new THREE.Mesh(geom, mat);
  planeta.castShadow = true;
  planeta.receiveShadow = true;
  planeta.userData.dist = dist;
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;
  planeta.userData.angle = 0;

  Planetas.push(planeta);
  scene.add(planeta);

  planeta.userData.angle = Math.atan2(
    planeta.position.z / (f2 * planeta.userData.dist),
    planeta.position.x / (f1 * planeta.userData.dist)
  );

  //Dibuja trayectoria, con
  let curve = new THREE.EllipseCurve(
    0,
    0, // centro
    dist * f1,
    dist * f2 // radios elipse
  );
  //Crea geometría
  let points = curve.getPoints(1000);
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0xa9a9a9 });
  // Objeto
  let orbita = new THREE.Line(geome, mate);
  orbita.rotation.x = Math.PI/2;
  scene.add(orbita);
}

function Luna(planeta, radio, dist, vel, col, angle, texture = undefined) {
  var pivote = new THREE.Object3D();
  pivote.rotation.y = angle;
  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 30, 30);
  var mat = new THREE.MeshPhongMaterial({ color: col });
  if (texture != undefined) {
    mat.map = texture;
  }
  var luna = new THREE.Mesh(geom, mat);
  luna.receiveShadow = true;
  luna.castShadow = true;
  luna.userData.dist = dist;
  luna.userData.speed = vel;

  Lunas.push(luna);
  pivote.add(luna);
}

//Bucle de animación
function animate() {

  requestAnimationFrame(animate);

  let timePassed;

  if (!pause) {
    lastTimestamp = timestamp;
    timestamp = (Date.now() - offset - t0) * accglobal;
    timePassed = timestamp - lastTimestamp;
  }

  switch(mode) {
    case 1:
      let t1 = new Date();
      flyControls.update(1 * timePassed);
      spaceship.position.set(camera.position.x-0.35, camera.position.y-0.5, camera.position.z+1.5);
      break;
    case 2:
      camera.position.set(Planetas[2].position.x, Planetas[2].position.y+2, Planetas[2].position.z-4);
      camera.lookAt(Planetas[2].position.x, Planetas[2].position.y, Planetas[2].position.z);
      camcontrols.enabled = false;
      flyControls.enabled = false;
  }

  // Modifica rotación de todos los objetos
  for (let object of Planetas) {
    object.position.x =
      Math.cos(object.userData.speed * speedConfig * timestamp) *
      object.userData.f1 *
      object.userData.dist;
    object.position.z =
      Math.sin(object.userData.speed * speedConfig * timestamp) *
      object.userData.f2 *
      object.userData.dist;
  }

  // Permite rotar las lunas sobre ejes que no sean el del plano de la rejilla
  for (let object of Lunas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) * object.userData.dist;
    object.position.z =
      Math.sin(timestamp * object.userData.speed) * object.userData.dist;
  }

  let earth = Planetas[2]

  if (mode != 1 && spaceship != undefined) {
    spaceship.position.x = Math.cos(earth.userData.speed * speedConfig * timestamp * (-1.5)) *
    earth.userData.f1 * earth.userData.dist; 
    spaceship.position.z = Math.sin(earth.userData.speed * speedConfig * timestamp * (-1.5)) *
    earth.userData.f1 * earth.userData.dist;
    spaceship.position.y = 3;
  }

  renderer.render(scene, camera);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
