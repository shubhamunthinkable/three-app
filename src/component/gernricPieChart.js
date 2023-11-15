import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

function PieChart3D({
  data = [],
  size = { width: window.innerWidth, height: window.innerHeight },
  position = { x: 0, y: 0, z: 30 },
  bgColor = "#ECF0F1",
  enableZoom = true,
  enablePan = false,
  lightColor = 0xffffff,
  lightIntensity = 0.8,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      100,
      size.width / size.height,
      0.1,
      1000
    );

    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;

    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(size.width, size.height);
    mountRef.current.appendChild(renderer.domElement);
    scene.background = new THREE.Color(bgColor);

    let startAngle = 0;
    data.forEach(({ color, value }) => {
      const endAngle = (value / total) * Math.PI * 2 + startAngle;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(10 * Math.cos(startAngle), 10 * Math.sin(startAngle));
      shape.absarc(0, 0, 10, startAngle, endAngle, false);
      shape.lineTo(0, 0);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: 10,
        bevelEnabled: false,
      });

      const material = new THREE.MeshBasicMaterial({ color });
      const pieSlice = new THREE.Mesh(geometry, material);
      scene.add(pieSlice);
      startAngle = endAngle;
    });

    const directionalLight = new THREE.AmbientLight(lightColor, lightIntensity);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, [data, size, position, bgColor, enableZoom, enablePan, lightColor, lightIntensity]);

  return <div ref={mountRef} />;
}

export default PieChart3D


{/* <PieChart3D 
  data={[
    { color: '#ff0000', value: 10 },
    { color: '#00ff00', value: 20 },
    { color: '#0000ff', value: 30 }
  ]}
  size={{ width: 800, height: 600 }}
  position={{ x: 0, y: 0, z: 50 }}
  bgColor="#ffffff"
  enableZoom={false}
  enablePan={true}
  lightColor={0xffffff}
  lightIntensity={1}
/> */}