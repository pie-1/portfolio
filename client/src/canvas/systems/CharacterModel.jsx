import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function CharacterModel({ isMoving }) {
  const materialRef = useRef()
  
  const runTexture = useTexture('/images/avatar/run-sheet.jpg')

  const TOTAL_FRAMES = 8
  const COLS = 4
  const ROWS = 2
  
  // To hide the red lines and numbers, we zoom in slightly on each frame
  const paddingX = 0.04 // 4% padding
  const paddingY = 0.04

  const currentFrame = useRef(0)
  const frameTimer = useRef(0)

  useFrame((_, delta) => {
    if (!materialRef.current) return

    // 1. ANIMATION LOGIC
    if (isMoving) {
      const FPS = 12 
      frameTimer.current += delta

      if (frameTimer.current >= 1 / FPS) {
        frameTimer.current = 0
        currentFrame.current = (currentFrame.current + 1) % TOTAL_FRAMES

        const col = currentFrame.current % COLS
        const row = Math.floor(currentFrame.current / COLS)

        // Update Shader Offset to point to the correct frame
        materialRef.current.uniforms.uOffset.value.set(
          (col / COLS) + (paddingX / COLS), 
          1 - ((row + 1) / ROWS) + (paddingY / ROWS)
        )
      }
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow>
        {/* Size of the character on screen */}
        <planeGeometry args={[1.5, 2.5]} /> 
        
        <shaderMaterial
          ref={materialRef}
          transparent={true}
          side={THREE.DoubleSide}
          uniforms={{
            uTexture: { value: runTexture },
            uOffset: { value: new THREE.Vector2(paddingX / COLS, 0.5 + (paddingY / ROWS)) }, 
            uScale: { value: new THREE.Vector2((1 / COLS) - (paddingX * 2 / COLS), (1 / ROWS) - (paddingY * 2 / ROWS)) }
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D uTexture;
            uniform vec2 uOffset;
            uniform vec2 uScale;
            varying vec2 vUv;

            void main() {
              // 1. Slice the specific frame (ignoring red borders)
              vec2 slicedUv = vUv * uScale + uOffset;
              vec4 color = texture2D(uTexture, slicedUv);
              
              // 2. Remove white background
              float brightness = (color.r + color.g + color.b) / 3.0;
              if (brightness > 0.8 && color.r > 0.9 && color.g > 0.9 && color.b > 0.9) {
                discard; 
              } else {
                // 3. Force the color to pure black (#000000)
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
              }
            }
          `}
        />
      </mesh>
    </group>
  )
}

useTexture.preload('/images/avatar/run-sheet.jpg')