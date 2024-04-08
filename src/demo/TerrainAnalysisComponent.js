import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { makeNoise2D } from 'open-simplex-noise'; // Import makeNoise2D

const Terrain3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const noise2D = makeNoise2D(Date.now()); // Initialize 2D noise generator

    const terrainSize = 1000;
    const terrainResolution = 64;

    const terrainGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainResolution, terrainResolution);
    terrainGeometry.rotateX(-Math.PI / 2); // Rotate to be horizontal

    for (let i = 0; i <= terrainResolution; i++) {
      for (let j = 0; j <= terrainResolution; j++) {
        const vertex = terrainGeometry.vertices[j + i * (terrainResolution + 1)];
        const x = (i / terrainResolution - 0.5) * terrainSize;
        const y = (j / terrainResolution - 0.5) * terrainSize;
        const noiseValue = noise2D(x * 0.05, y * 0.05);
        const value = Math.abs(noiseValue) * 100; // Adjust amplitude as needed
        vertex.z = value;
      }
    }

    terrainGeometry.computeFaceNormals();
    const terrainMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    scene.add(terrainMesh);

    camera.position.set(0, 200, 400);
    camera.lookAt(scene.position);

    const render = () => {
      renderer.render(scene, camera);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    animate();

    return () => {
      // Cleanup
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Terrain3D;
