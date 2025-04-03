
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const Chassis250A3D = ({ component }: ComponentProps) => {
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
      {/* Base gray box */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[scale.x, scale.y, scale.z]} />
        <meshStandardMaterial color={"#9F9EA1"} /> {/* Silver-gray color for chassis */}
      </mesh>
      
      {/* Mounting holes - top row */}
      <group position={[0, scale.y * 0.4, scale.z/2 + 0.01]}>
        <mesh castShadow position={[-scale.x * 0.35, 0, 0]}>
          <cylinderGeometry args={[scale.x * 0.05, scale.x * 0.05, 0.1, 16]} />
          <meshStandardMaterial color={"#000000"} />
        </mesh>
        <mesh castShadow position={[scale.x * 0.35, 0, 0]}>
          <cylinderGeometry args={[scale.x * 0.05, scale.x * 0.05, 0.1, 16]} />
          <meshStandardMaterial color={"#000000"} />
        </mesh>
      </group>
      
      {/* Connection points - centered */}
      <group position={[0, 0, scale.z/2 + 0.01]}>
        <mesh castShadow position={[0, scale.y * 0.15, 0]}>
          <boxGeometry args={[scale.x * 0.7, scale.y * 0.08, 0.05]} />
          <meshStandardMaterial color={"#AAADB0"} />
        </mesh>
        <mesh castShadow position={[0, scale.y * -0.15, 0]}>
          <boxGeometry args={[scale.x * 0.7, scale.y * 0.08, 0.05]} />
          <meshStandardMaterial color={"#AAADB0"} />
        </mesh>
      </group>
      
      {/* Bottom mounting holes */}
      <group position={[0, -scale.y * 0.4, scale.z/2 + 0.01]}>
        <mesh castShadow position={[-scale.x * 0.35, 0, 0]}>
          <cylinderGeometry args={[scale.x * 0.05, scale.x * 0.05, 0.1, 16]} />
          <meshStandardMaterial color={"#000000"} />
        </mesh>
        <mesh castShadow position={[scale.x * 0.35, 0, 0]}>
          <cylinderGeometry args={[scale.x * 0.05, scale.x * 0.05, 0.1, 16]} />
          <meshStandardMaterial color={"#000000"} />
        </mesh>
      </group>
      
      {/* 250A Chassis label */}
      <Text
        position={[0, -scale.y/2 - 0.25, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "250A Chassis"}
      </Text>
    </group>
  );
};
