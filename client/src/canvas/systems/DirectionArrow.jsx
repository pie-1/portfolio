import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DirectionArrow({ bodyRef }) {
  const arrowRef = useRef()

  useFrame((state) => {
    if (!arrowRef.current || !bodyRef.current) return
    
    // 1. Get the player's current position
    const pos = bodyRef.current.translation()
    
    // 2. Place the arrow 2 units in front of the player
    arrowRef.current.position.set(pos.x, pos.y + 2.5, pos.z - 2)
    
    // 3. Make the arrow bounce up and down gently
    arrowRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.1
    
    // 4. Make the arrow point forward (down the Z axis)
    arrowRef.current.rotation.x = Math.PI / 2
  })

  return (
    <group ref={arrowRef}>
      {/* A simple cone acts as our arrow */}
      <mesh castShadow>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} />
      </mesh>
      {/* A little tail for the arrow */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}