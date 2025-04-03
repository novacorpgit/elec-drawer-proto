
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const Contactor3D = ({ component }: ComponentProps) => {
  const groupRef = useRef<Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.componentId = component.id;
    }
  }, [component.id]);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(component.position);
      if (component.rotation) {
        groupRef.current.rotation.set(
          component.rotation.x,
          component.rotation.y,
          component.rotation.z
        );
      }
    }
  });

  const { scale } = component;

  return (
    <group ref={groupRef}>
      {/* Main contactor body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[scale.x, scale.y, scale.z]} />
        <meshStandardMaterial color={"#E6E6FA"} /> {/* Lavender color */}
      </mesh>
      
      {/* Terminal connections - top row */}
      <group position={[0, scale.y/2 + 0.05, 0]}>
        <mesh castShadow position={[-scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
        <mesh castShadow position={[scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
      </group>
      
      {/* Middle section with model number */}
      <mesh castShadow position={[0, 0, scale.z/2 + 0.01]}>
        <boxGeometry args={[scale.x * 0.8, scale.y * 0.4, 0.05]} />
        <meshStandardMaterial color={"#F3E8FF"} /> {/* Lighter purple */}
      </mesh>
      <Text
        position={[0, 0, scale.z/2 + 0.06]}
        fontSize={0.15}
        color="black"
      >
        LC1D
      </Text>
      
      {/* Bottom terminals */}
      <group position={[0, -scale.y/2 - 0.05, 0]}>
        <mesh castShadow position={[-scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
        <mesh castShadow position={[scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
      </group>
      
      {/* Contactor label */}
      <Text
        position={[0, -scale.y/2 - 0.25, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "Contactor"}
      </Text>
    </group>
  );
};
