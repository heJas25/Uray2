import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSnapshot } from "valtio";
import state from "../canvas/state";

// 👉 Patterns disponibles
const patterns = {
  floral: "floral.jpg",
  jean: "jean.jpg",
  flower: "Violet watercolour texture floral pattern Stock Illustration _ Adobe Stock.jpg",
  purple: "Purple Watercolor Floral Pattern Art Design for Creativity.jpg",
  pinky: "Pink Wallpaper Backgrounds_ Simple and Cute Flower Designs.jpg",
  node: "téléchargement (25).jpg",
  heart: "5fdfc66f-c576-43d6-96f3-779ba58a6a01.jpg",
  cherry: "146be6a8-77d3-4ed7-87a4-f496fc414631.jpg",
  noir: "noir.png",
  rouge: "rouge.jpg",
  cute: "374cd3ce-3327-4835-bc5c-4b2682203475.jpg",
  vert: "vert.jpg",
  bleu: "bleu.jpg",
  jaune: "jaune.jpg",
  namouri: "namouri.jpg",
  tree: "tree.jpg",
  rose: "rose.jpg",
  rosee: "rosee.jpg",
  zibra: "zibra.jpg",
  coeur: "coeur.jpg"
};

function Model({ rotation, setRotation, selectedPattern }) {
  const { scene } = useGLTF("/dress.glb");
  const modelRef = useRef();
  const isDragging = useRef(false);
  const previousX = useRef(0);
  const targetRotation = useRef(rotation);
  const snap = useSnapshot(state);
  const [texture, setTexture] = useState(null);

  // 🎨 Charger la texture selon le motif
  useEffect(() => {
    if (selectedPattern && patterns[selectedPattern]) {
      new THREE.TextureLoader().load(patterns[selectedPattern], (loadedTexture) => {
        loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.repeat.set(2, 2); // Zoom du motif
        setTexture(loadedTexture);
      });
    }
  }, [selectedPattern]);

  // ✨ Appliquer la texture et couleur
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = rotation;
      modelRef.current.position.set(1, 2, 0);

      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: snap.color,
            metalness: 0.3,
            roughness: 0.5,
            map: texture || null, // Applique la texture si elle existe
          });
          child.material.needsUpdate = true;
        }
      });
    }
  }, [snap.color, texture, rotation]);

  // Animation pour la rotation du modèle
  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotation.current,
        0.09
      );
      modelRef.current.position.y = -0.8 + Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });

  // Gestion des événements de la souris pour faire pivoter le modèle
  const handleMouseDown = (e) => {
    isDragging.current = true;
    previousX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.clientX - previousX.current;
      targetRotation.current += deltaX * 0.05;
      previousX.current = e.clientX;
    }
  };

  return (
    <primitive
      ref={modelRef}
      object={scene}
      dispose={null}
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      onPointerMove={handleMouseMove}
    />
  );
}

export default function Dress() {
  const [rotation, setRotation] = useState(6.77);
  const snap = useSnapshot(state); 

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [5, 6, 10], fov: 9 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 2]} intensity={1.5} />
        <spotLight position={[5, 5, 5]} angle={0.3} intensity={2} castShadow />
        <Model
          rotation={rotation}
          setRotation={setRotation}
          selectedPattern={snap.selectedPattern} // Lier la texture sélectionnée au modèle
        />
      </Canvas>
    </div>
  );
}
