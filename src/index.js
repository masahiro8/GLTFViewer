import "./styles.css";
import * as THREE from "three/build/three.module";
// GLTFLoader を使う
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Orbit
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let camera, scene, renderer;
let axis, light;
let gltfModel;

// ここから設定
// gltfモデル
const modelDataUrl = "/assets/desk_v2.glb";
// ヘルパー表示/非表示
const isAxisHelper = true;
// Orbit設定
const orbitConfig = {
  enableDamping: true,
  dampingFactor: 0.25,
  enableZoom: true
};

const init = () => {
  const inputElement = document.getElementById("upload");
  inputElement.addEventListener(
    "change",
    async (evt) => {
      if (evt.target.files.length) {
        const url = URL.createObjectURL(evt.target.files[0]);
        gltfModel = await loadGLTF(url);
        if (gltfModel) {
          scene.add(gltfModel);
        }
      }
    },
    false
  );
};

function loadGLTF(url) {
  return new Promise((resolve) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        // console.log("loadGLTF", model, gltf);
        resolve(model);
      },
      (error) => {
        console.log("An error happened", error);
      }
    );
  });
}

const init3D = async () => {
  // カメラ
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 1);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // シーン
  scene = new THREE.Scene();
  light = new THREE.AmbientLight(0xffffff, 1.0);
  scene.background = new THREE.Color(0x404040);
  scene.add(light);

  // ヘルパー
  if (isAxisHelper) {
    axis = THREE.AxisHelper(2000);
    axis.position.set(0, 0, 0);
    scene.add(axis);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Orbit
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = orbitConfig.enableDamping;
  controls.dampingFactor = orbitConfig.dampingFactor;
  controls.enableZoom = orbitConfig.enableZoom;

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
};

init3D();
init();
