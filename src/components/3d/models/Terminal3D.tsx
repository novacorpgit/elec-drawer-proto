
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const Terminal3D = ({ component }: ComponentProps) => {
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
      {/* First row of terminals */}
      <mesh castShadow position={[-scale.x/4, scale.y/4, 0]}>
        <boxGeometry args={[scale.x * 0.4, scale.y * 0.4, scale.z]} />
        <meshStandardMaterial color={"#DBEAFE"} /> {/* Light blue */}
      </mesh>
      <mesh castShadow position={[scale.x/4, scale.y/4, 0]}>
        <boxGeometry args={[scale.x * 0.4, scale.y * 0.4, scale.z]} />
        <meshStandardMaterial color={"#DBEAFE"} />
      </mesh>
      
      {/* Second row of terminals */}
      <mesh castShadow position={[-scale.x/4, -scale.y/4, 0]}>
        <boxGeometry args={[scale.x * 0.4, scale.y * 0.4, scale.z]} />
        <meshStandardMaterial color={"#DBEAFE"} />
      </mesh>
      <mesh castShadow position={[scale.x/4, -scale.y/4, 0]}>
        <boxGeometry args={[scale.x * 0.4, scale.y * 0.4, scale.z]} />
        <meshStandardMaterial color={"#DBEAFE"} />
      </mesh>
      
      {/* Terminal screws */}
      <mesh castShadow position={[-scale.x/4, scale.y/4, scale.z/2 + 0.03]}>
        <cylinderGeometry args={[scale.x * 0.1, scale.x * 0.1, 0.06, 16]} />
        <meshStandardMaterial color={"#333333"} />
      </mesh>
      <mesh castShadow position={[scale.x/4, scale.y/4, scale.z/2 + 0.03]}>
        <cylinderGeometry args={[scale.x * 0.1, scale.x * 0.1, 0.06, 16]} />
        <meshStandardMaterial color={"#333333"} />
      </mesh>
      <mesh castShadow position={[-scale.x/4, -scale.y/4, scale.z/2 + 0.03]}>
        <cylinderGeometry args={[scale.x * 0.1, scale.x * 0.1, 0.06, 16]} />
        <meshStandardMaterial color={"#333333"} />
      </mesh>
      <mesh castShadow position={[scale.x/4, -scale.y/4, scale.z/2 + 0.03]}>
        <cylinderGeometry args={[scale.x * 0.1, scale.x * 0.1, 0.06, 16]} />
        <meshStandardMaterial color={"#333333"} />
      </mesh>
      
      {/* Terminal label */}
      <Text
        position={[0, -scale.y - 0.15, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "Terminal"}
      </Text>
    </group>
  );
};
