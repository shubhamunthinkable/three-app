import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { RoundedBoxGeometry } from "three-stdlib"; // Import RoundedBoxGeometry

function BarGraph3D(props) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = -20;
    camera.position.y = 30;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      devicePixelRatio: window.devicePixelRatio || 1,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // enable soft shadows
    mountRef.current.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio * 2); // Be cautious with performance

    scene.background = new THREE.Color("#eeeeee");

    // ...other setup code...

    // Calculate the width needed for all bars including the spacing
    const barWidth = 2; // Width of each bar
    const spacing = 0.2; // Spacing between bars
    const totalBarsWidth = props.data.length * (barWidth + spacing) - spacing;

    // Create floor geometry based on the total width of the bars
    const floorWidth = Math.max(totalBarsWidth, 20); // Ensure the floor has a minimum width
    const floorDepth = 5; // Depth of the floor (how far it extends out from the screen)
    const floorGeometry = new THREE.PlaneGeometry(floorWidth, floorDepth);
    // const floorGeometry = new THREE.PlaneGeometry(40, 5); // Size of the floor
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: "#7e8280",
      side: THREE.FrontSide, // So that it's visible from both sides
      shininess: 100,
      //   vertexColors: true, // Enable vertex colors
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
    floor.position.y = 0; // Adjust position based on where you want the floor
    floor.receiveShadow = true; // This floor can receive shadows
    scene.add(floor);

    const startX = -totalBarsWidth / 2 + barWidth / 2;

    // Create the bars
    props.data.forEach((item, index) => {
      const { color, value } = item;
      const baseDepth = 1; // The minimum depth of each slice
      const depthRange = 0.5; // The range of possible depths
      const depth = baseDepth + depthRange; // Calculate the total depth for the bar
      const radius = 0.2; // The radius of the rounded edges
      const smoothness = 5; // The number of segments for the rounded edges
      const barHeight = value;

      //   const barGeometry = new THREE.BoxGeometry(barWidth, value, depth, 10, 10, 10); // Use the depth value here
      const barGeometry = new RoundedBoxGeometry(
        barWidth,
        barHeight,
        depth,
        smoothness,
        radius
      );

      // Create an array to store colors for each vertex
      const vertexColors = [];
      const colorTop = new THREE.Color(color).multiplyScalar(0.8); // Lighter color for top vertices
      const colorBottom = new THREE.Color(color).multiplyScalar(0.9); // Darker color for bottom vertices

      // Assign vertex colors based on their z position
      for (let i = 0; i < barGeometry.attributes.position.count; i++) {
        const z = barGeometry.attributes.position.getZ(i);
        const vertexColor = z > depth * 0.5 ? colorTop : colorBottom;
        vertexColors.push(vertexColor.r, vertexColor.g, vertexColor.b);
      }

      // Add color attribute to geometry
      barGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(vertexColors, 3)
      );
      barGeometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({
          color,
          specular: 0x222222, // Specular color for shininess
          // specular: 0xffffff, // Specular color for shininess
          shininess: 10, // Increased shininess
          flatShading: false,
          vertexColors: true, // Enable vertex colors
          roughness: 3.8, // Higher value for more roughness, less shiny
          metalness: 0.2
        });

    //   const material = new THREE.MeshBasicMaterial({
    //     color,
    //     specular: 0x222222, // Specular color for shininess
    //     // specular: 0xffffff, // Specular color for shininess
    //     shininess: 200, // Increased shininess
    //     flatShading: false,
    //     vertexColors: true, // Enable vertex colors
    //   });
      const bar = new THREE.Mesh(barGeometry, material);
      bar.castShadow = true;
      bar.receiveShadow = true;
      bar.position.x = startX + index * (barWidth + spacing);
      bar.position.y = value / 2;
      scene.add(bar);
    });
    scene.scale.set(2, 2, 2); // Double the size of everything in the scene

    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(5, 8, 8);
    light.castShadow = true;
    light.intensity = 2;
    light.shadow.mapSize.width = 1024; // Higher resolution
    light.shadow.mapSize.height = 1024; // Higher resolution
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    //  // Cleanup on unmount
    //  return () => {
    //     window.removeEventListener('resize', handleResize);
    //     mountRef.current.removeChild(renderer.domElement);
    //     scene.clear();
    //     renderer.dispose();
    //   };
  }, [props.data]);

  return <div ref={mountRef} />;
}

export default BarGraph3D;
