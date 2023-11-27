import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

function PieChart3D(props) {
  const mountRef = useRef(null);

  useEffect(() => {
    const total = props.data.reduce((sum, item) => sum + item.value, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      83,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    camera.position.x = 0.4486640824820101;
    camera.position.y = -16.8748963203283;
    camera.position.z = 4.500750643166207;

    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // enable soft shadows
    mountRef.current.appendChild(renderer.domElement); 
    let startAngle = 4; //for change angle of pie chart
    scene.background = new THREE.Color("#eeeeee");

    const gapAngle = 0.08; // Angle in radians for the gap between slices

    props.data.forEach(({ color, value }) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle - gapAngle; // Subtract the gapAngle to create a space
      const midAngle = (startAngle + endAngle) / 2;
      const baseDepth = 1; // The minimum depth of each slice
      const depthRange = 15; // The range of possible depths

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(10 * Math.cos(startAngle), 10 * Math.sin(startAngle));
      shape.absarc(0, 0, 10, startAngle, endAngle, false);
      shape.lineTo(0, 0);

      const percentage = value / total;
      const depth = baseDepth + depthRange * percentage;
      const geometry = new THREE.ExtrudeGeometry(shape, {
        steps: 2,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.25, // Adjust this value to control the thickness of the bevel
        bevelSize: Math.max(0.3, gapAngle / 2), // Ensure the bevel size is smaller than half the gap
        bevelOffset: 0,
        bevelSegments: 300, // Adjust this value to control the smoothness of the bevel
      });

      // Create an array to store colors for each vertex
      const vertexColors = [];
      const colorTop = new THREE.Color(color).multiplyScalar(0.7); // Lighter color for top vertices
      const colorBottom = new THREE.Color(color).multiplyScalar(0.9); // Darker color for bottom vertices

      // Assign vertex colors based on their z position
      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const z = geometry.attributes.position.getZ(i);
        const vertexColor = z > depth * 0.5 ? colorTop : colorBottom;
        vertexColors.push(vertexColor.r, vertexColor.g, vertexColor.b);
      }

      // Add color attribute to geometry
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(vertexColors, 3)
      );
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({
        color,
        specular: '#ffffff',
        shininess: 200,
        vertexColors: true, // Enable vertex colors
      });

      const distance = 0.4;

      const pieSlice = new THREE.Mesh(geometry, material);
      pieSlice.position.x = distance * Math.cos(midAngle);
      pieSlice.position.y = distance * Math.sin(midAngle);
      pieSlice.castShadow = true; // This slice will cast shadows
      pieSlice.receiveShadow = true; // This slice will receive shadows

      scene.add(pieSlice);
      //   startAngle = endAngle;
      startAngle += sliceAngle; // Increment startAngle by the full slice angle for the next slice
    });

    // const light = new THREE.PointLight(0xffffff, 1, 1000);
        const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1,0.7, 0.5);
    // light.castShadow = true;
    light.shadow.mapSize.width = 1; // increase the resolution of the shadow map
    light.intensity = 8;
    light.shadow.mapSize.height = 1; // increase the resolution of the shadow map
    scene.add(light);

    const directionalLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(directionalLight);
    camera.position.z = 15;


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableRotate = true; // disable rotation

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, [props.data]);

  return <div ref={mountRef} />;
}

export default PieChart3D;
