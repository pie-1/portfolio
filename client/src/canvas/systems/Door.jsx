import { useState } from 'react'
import { useTexture, Html } from '@react-three/drei'

export default function Door({ position, rotation, image, label, onClick }) {
  const [hovered, setHovered] = useState(false)
  
  // The image path is now passed as a prop, so it's reusable
  const texture = useTexture(image)

  return (
    <group position={position} rotation={rotation}>
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); if(onClick) onClick() }}
        castShadow
      >
        <planeGeometry args={[2, 3]} /> 
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          side={2} 
          color={hovered ? '#dddddd' : '#ffffff'} 
        />
      </mesh>

      {/* Floating HTML Label */}
      <Html position={[0, 1.8, 0]} center transform occlude>
        <div style={{
          background: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '2px solid black',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '16px',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.2s',
          pointerEvents: 'none' // Prevents the label from blocking mouse clicks
        }}>
          {label}
        </div>
      </Html>
    </group>
  )
}