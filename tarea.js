import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->
let scene;
let camera;
let renderer;
let estrella, Planetas = [], Lunas = [];
let planetColors = [0x205069, 0x008080, 0xe29870, 0x86895d, 0x382c1e, 0xfffacd, 0x565656]

let t0 = 0;
let timestamp;
let accglobal = 0.001;

let grid, perfil, plano;
const MAX_POINTS = 500;
let raycaster;
let npuntos;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, -20, 5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let camcontrols = new OrbitControls(camera, renderer.domElement);

  //Asistente GridHelper
  grid = new THREE.GridHelper(40, 40);
  grid.position.set(0, 0, 0);
  grid.geometry.rotateX(Math.PI / 2);
  //Desplaza levemente hacia la cámara
  grid.position.set(0, 0, 0.05);

  scene.add(grid);

  //Creo un plano en z=0 que no muestro para la intersección
  let geometryp = new THREE.PlaneGeometry(40, 40);
  let materialp = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  plano = new THREE.Mesh(geometryp, materialp);
  plano.visible = false;
  scene.add(plano);

  //Rayo para intersección
  raycaster = new THREE.Raycaster();

  Estrella(3, 0xffff00);

  //Manejador de eventos
  document.addEventListener("mousedown", onDocumentMouseDown);

  //Inicio tiempo
  t0 = Date.now();
}

function onDocumentMouseDown(event) {
  //Conversión coordenadas del puntero
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };

  //Intersección, define rayo
  raycaster.setFromCamera(mouse, camera);

  // Intersecta
  const intersects = raycaster.intersectObject(plano);

  if (intersects.length > 0) {
    console.log("X: " + intersects[0].point.x + "; Y: " + intersects[0].point.y + "; Z: " + intersects[0].point.z)
    let color = Math.floor(Math.random() * (planetColors.length))
    let nLunas = Math.floor(Math.random() * 4)
    Planeta(
      intersects[0].point.x,
      intersects[0].point.y,
      intersects[0].point.z,
      0.7,                  // Radio
      planetColors[color],  // Color
      Math.random(),        // Velocidad
      1.0,                  // f1
      1.0                   // f2
    );

    for (let i = 0; i<nLunas; i++){
      Luna(Planetas[Planetas.length-1], 0.15, 0.9, (i+1)*2, 0xffffff, 0.5*i)
    }

  }
}

function Estrella(rad, col) {
    let geometry = new THREE.SphereGeometry(rad, 30, 30);
    let material = new THREE.MeshBasicMaterial({ color: col });
    estrella = new THREE.Mesh(geometry, material);
    scene.add(estrella);
}


function Planeta(px, py, pz, radio, col, vel, f1, f2) {
  let geometry = new THREE.SphereGeometry(radio, 30, 30);
  //Material con o sin relleno
  let material = new THREE.MeshBasicMaterial({
    color: col,
  });

  let planeta = new THREE.Mesh(geometry, material);
  planeta.userData.dist = Math.sqrt(Math.pow(px, 2) + Math.pow(py, 2));
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;
  // Calcular el ángulo inicial del planeta para poder ponerlo exactamente donde
  // hemos hecho click
  planeta.userData.angle = Math.atan2(
    py / (f2 * planeta.userData.dist),
    px / (f1 * planeta.userData.dist)
  );
  planeta.position.set(px, py, pz);
  scene.add(planeta);
  Planetas.push(planeta);
  // Dibujar órbitas
  let curve = new THREE.EllipseCurve(0, 0, planeta.userData.dist * f1, planeta.userData.dist * f2);
  let points = curve.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  let orbita = new THREE.Line(geome, mate);
  scene.add(orbita);
}

function Luna(planeta, radio, dist, vel, col, angle) {
  var pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 10, 10);
  var mat = new THREE.MeshBasicMaterial({ color: col });
  var luna = new THREE.Mesh(geom, mat);
  luna.userData.dist = dist;
  luna.userData.speed = vel;

  Lunas.push(luna);
  pivote.add(luna);
}

//Bucle de animación
function animate() {
  let last_timestamp = timestamp
  timestamp = (Date.now() - t0) * accglobal;
  // El tiempo que ha pasado desde el último frame
  let time_passed = timestamp - last_timestamp;

  requestAnimationFrame(animate);

  // Modifica rotación de todos los objetos
  for (let object of Planetas) {
    object.userData.angle += object.userData.speed * time_passed;
    object.position.x =
      Math.cos(object.userData.angle) *
      object.userData.f1 *
      object.userData.dist;
    object.position.y =
      Math.sin(object.userData.angle) *
      object.userData.f2 *
      object.userData.dist;
  }

  // Permite rotar las lunas sobre ejes que no sean el del plano de la rejilla
  for (let object of Lunas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) * object.userData.dist;
    object.position.y =
      Math.sin(timestamp * object.userData.speed) * object.userData.dist;
  }

  renderer.render(scene, camera);
}
