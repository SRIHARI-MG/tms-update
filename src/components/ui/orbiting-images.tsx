import React, { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Plane, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface FixedImageProps {
  texture: THREE.Texture;
  initialPosition: [number, number, number];
}

const FixedImage = React.memo(
  ({ texture, initialPosition }: FixedImageProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3(...initialPosition));
    const currentPosition = useRef(new THREE.Vector3(...initialPosition));

    useFrame((state, delta) => {
      if (meshRef.current) {
        // Update position
        currentPosition.current.lerp(targetPosition.current, 0.05);
        meshRef.current.position.copy(currentPosition.current);

        // Billboard effect: always face the camera
        meshRef.current.lookAt(camera.position);

        // Calculate distance from camera to image for opacity
        const distanceToCamera = camera.position.distanceTo(
          currentPosition.current
        );

        // Adjusted maximum distance for more gradual opacity changes
        const maxDistance = 20;
        const opacity = THREE.MathUtils.clamp(
          THREE.MathUtils.mapLinear(distanceToCamera, 0, maxDistance, 1, 1),
          1,
          1
        );

        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.opacity = hovered ? 1 : opacity;
        }

        // Update target position when hovered
        if (hovered) {
          const awayVector = new THREE.Vector3(...initialPosition)
            .sub(currentPosition.current)
            .normalize()
            .multiplyScalar(0.5);
          targetPosition.current.add(awayVector);
        } else {
          targetPosition.current.set(...initialPosition);
        }
      }
    });

    const handlePointerOver = useCallback(() => setHovered(true), []);
    const handlePointerOut = useCallback(() => setHovered(false), []);

    return (
      <Plane
        ref={meshRef}
        args={[2, 2]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          attach="material"
          map={texture}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Plane>
    );
  }
);

const RotatingGlobe = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.05 * delta;
      }
    });

    return <group ref={groupRef}>{children}</group>;
  }
);

interface InteractiveGlobeProps {
  images: string[];
}

export default function InteractiveGlobe({ images }: InteractiveGlobeProps) {
  const textures = useMemo(
    () => images.map((img) => new THREE.TextureLoader().load(img)),
    [images]
  );

  const imagePositions = useMemo(() => {
    const radius = 10;
    return images.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / images.length);
      const theta = Math.sqrt(images.length * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      return [x, y, z] as [number, number, number];
    });
  }, [images]);

  const memoizedImages = useMemo(
    () =>
      textures.map((texture, index) => (
        <FixedImage
          key={index}
          texture={texture}
          initialPosition={imagePositions[index]}
        />
      )),
    [textures, imagePositions]
  );

  return (
    <div className="w-full h-[500px] bg-transparent">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <RotatingGlobe>{memoizedImages}</RotatingGlobe>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
