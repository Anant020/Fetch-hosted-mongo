import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { generatePerlinNoise } from 'perlin-noise';

const Terrain3D = ({ slope, intensity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const terrainSize = 1000;
    const terrainResolution = 64;

    // Create grid of terrain patches
    for (let i = 0; i < terrainResolution; i++) {
      for (let j = 0; j < terrainResolution; j++) {
        const patchGeometry = new THREE.PlaneGeometry(terrainSize / terrainResolution, terrainSize / terrainResolution, 1, 1);

        // Check if Perlin noise generator returns a valid array
        const noiseValues = generatePerlinNoise(1, 1); // Generate a single noise value to check array length
        if (!noiseValues || noiseValues.length === undefined) {
          console.error("Error generating Perlin noise. Please make sure the Perlin noise generator is functioning correctly.");
          return;
        }

        // Modify patch vertices based on Perlin noise with slope and intensity parameters
        for (let k = 0; k < patchGeometry.vertices.length; k++) {
          const vertex = patchGeometry.vertices[k];
          const x = (i - terrainResolution / 2 + vertex.x) * 0.02;
          const y = (j - terrainResolution / 2 + vertex.y) * 0.02;
          const noiseValue = generatePerlinNoise(x, y);
          const value = Math.abs(noiseValue) * intensity; // Adjust amplitude by intensity
          vertex.z = value + slope * (x + y); // Add slope component
        }

        patchGeometry.computeFaceNormals(); // Recalculate normals for shading

        const patchMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const patchMesh = new THREE.Mesh(patchGeometry, patchMaterial);
        patchMesh.position.set((i - terrainResolution / 2) * (terrainSize / terrainResolution), (j - terrainResolution / 2) * (terrainSize / terrainResolution), 0);
        scene.add(patchMesh);
      }
    }

    // Set camera position
    camera.position.set(0, 200, 400);
    camera.lookAt(scene.position);

    // Render function
    const render = () => {
      renderer.render(scene, camera);
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    animate();

    return () => {
      // Cleanup
    };
  }, [slope, intensity]);

  return <canvas ref={canvasRef} />;
};

export default Terrain3D;
