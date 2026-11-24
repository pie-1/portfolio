import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

export default function Corridor({ length = 100 }) {
  const corridorWidth = 6
  const corridorHeight = 4

const floorTexture = useTexture('/textures/corridor/floor-wood.webp')
const wallTexture = useTexture('/textures/corridor/wall-texture.webp')
const ceilingTexture = useTexture('/textures/corridor/ceiling-texture.webp')

  useMemo(() => {
    // Setup textures to repeat perfectly down the hallway
    [floorTexture, wallTexture, ceilingTexture].forEach(tex => {
      if(tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.colorSpace = THREE.SRGBColorSpace
      }
    })
    
    if(floorTexture) floorTexture.repeat.set(1, length / 5)
    if(wallTexture) wallTexture.repeat.set(length / 5, 1)
    if(ceilingTexture) ceilingTexture.repeat.set(1, length / 5)
  }, [floorTexture, wallTexture, ceilingTexture, length])

  const zOffset = -length / 2 + 5

  return (
    <group>
      {/* FLOOR */}
      <mesh position={[0, -corridorHeight / 2, zOffset]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[corridorWidth, length]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* CEILING */}
      <mesh position={[0, corridorHeight / 2, zOffset]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[corridorWidth, length]} />
        <meshStandardMaterial map={ceilingTexture} />
      </mesh>

      {/* LEFT WALL */}
      <mesh position={[-corridorWidth / 2, 0, zOffset]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, corridorHeight]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* RIGHT WALL */}
      <mesh position={[corridorWidth / 2, 0, zOffset]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, corridorHeight]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>
    </group>
  )
}