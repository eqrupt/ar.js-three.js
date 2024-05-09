import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import { MathUtils } from "three";
import { ARCanvas, ARMarker } from "./ar"
import React from "react"
import { createRoot } from "react-dom/client"


///使用了webpack后的资源要用import引用
//如果额外添加文件又加载不出来、就在控制台输入 npx webpack --mode development 重新部署webpack
import pic_earth_map from './planets/earth_atmos_2048.jpg'
import pic_earth_specular from './planets/earth_specular_2048.jpg'
import pic_earth_normal from './planets/earth_normal_2048.jpg'
import pic_moon_map from './planets/moon_1024.jpg'
import pic_earth_light_map from './planets/earth_lights_2048.png'
import pic_earth_clouds_map from './planets/earth_clouds_2048.png'
function App() {
  //react框架，看不懂不要碰
  const ref = React.useRef();
  const [scene, setScene] = React.useState();
  const [camera, setCamera] = React.useState();
  //直接修改下面的方法，要添加3d内容在下面添加即可
  //
  //
  //
  //
  //
  //
  //
  //直接修改下面的方法，要添加3d内容在下面添加即可
  React.useEffect(() => {
    const localScene = new THREE.Scene();
    const localCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    localCamera.position.set(0, 0, 5);
    localScene.add(new THREE.AxesHelper(5));
    let gui;


    function initGui() {

      gui = new GUI();

      gui.title( '修改纹理' );

      gui.add( layers, '转变地球' );
      gui.add( layers, '晴天' );
      gui.add( layers, '夜晚' );

      gui.open();

    }



    ///////////
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current.appendChild(renderer.domElement);
    ///////2Dcss

    const textureLoader = new THREE.TextureLoader();
    const earthGeometry = new THREE.SphereGeometry( 1, 16, 16 );
    const earthMaterial = new THREE.MeshPhongMaterial( {
      specular: 0xbbb333,
      shininess: 40,
      map: textureLoader.load(pic_earth_map),
      specularMap: textureLoader.load( pic_earth_specular ),
      normalMap: textureLoader.load( pic_earth_normal),
      normalScale: new THREE.Vector2( 0.85, 0.85 )
    } );
    earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh( earthGeometry, earthMaterial );
    localScene.add( earth );

    const moonGeometry = new THREE.SphereGeometry( 0.3, 16, 16 );
    const moonMaterial = new THREE.MeshPhongMaterial( {
      shininess: 5,
      map: textureLoader.load( pic_moon_map)
    } );
    moonMaterial.map.colorSpace = THREE.SRGBColorSpace;
    const moon = new THREE.Mesh( moonGeometry, moonMaterial );
    localScene.add( moon );
    ///////////
    const layers = {

      '转变地球': function () {
        earth.material.map = textureLoader.load( pic_moon_map );
        earth.needsUpdate = true;

      },
      '夜晚': function () {
        earth.material.map = textureLoader.load( pic_earth_light_map );
        earth.needsUpdate = true;


      },
      '风暴': function () {
        earth.material.map = textureLoader.load(pic_earth_clouds_map);
        earth.needsUpdate = true;

      },

      '晴天': function () {

        earth.material.map = textureLoader.load(pic_earth_map);
        earth.needsUpdate = true;

      }

    };

    ///////////
    const light = new THREE.DirectionalLight(0xffffff, 8);
    light.position.set(1, 1, 0);
    localScene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    localScene.add(ambientLight);
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.x += MathUtils.degToRad(1);
      earth.rotation.z += MathUtils.degToRad(1);
      earth.rotation.y += MathUtils.degToRad(1);
      const elapsed = clock.getElapsedTime();
      moon.position.set( Math.sin( elapsed ) * 2, Math.sin( elapsed ) * 2, Math.cos( elapsed ) * 2 );
      renderer.render(localScene, localCamera);
    }
    animate();
    initGui();
    setScene(localScene);
    setCamera(localCamera);
  }, []);

  //要修改AR打开AR文件夹进行修改，不要在这里修改
  return (
    <div ref={ref}>
      <ARCanvas
        //这里将3D引擎相机与AR坐标做了绑定，不修改引擎不要动。
        camera={camera}
        onCreated={({ gl }) => {
          gl.setSize(window.innerWidth, window.innerHeight);
        }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} intensity={10.0} />
        <ARMarker
          params={{ smooth: true }}
          type={"pattern"}
          //标识码在这里换
          //使用ARToolKit5将图片转换为标识码
          patternUrl={"data/patt.hiro"}
          onMarkerFound={() => console.log("Marker Found")}
        >
          {scene && <primitive object={scene} />}
        </ARMarker>
      </ARCanvas>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);