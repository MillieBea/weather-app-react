import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  TextureLoader,
  SRGBColorSpace,
  Vector3,
  Quaternion,
  Shape,
  DoubleSide,
} from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsLeftRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./Globe.css";

const GLOBE_SETTINGS = {
  haloScale: 1.02,
  haloStrength: 0.42,
  haloPower: 4.0,

  ambientLight: 1.8,
  sunlight: 2.6,
  blueLight: 0.55,
  coolLight: 0.25,

  cloudOpacity: 0.48,
};

const locationPinShape = new Shape();

locationPinShape.moveTo(0, -0.05);
locationPinShape.bezierCurveTo(-0.012, -0.025, -0.045, 0.005, -0.045, 0.025);
locationPinShape.bezierCurveTo(-0.045, 0.05, -0.025, 0.065, 0, 0.065);
locationPinShape.bezierCurveTo(0.025, 0.065, 0.045, 0.05, 0.045, 0.025);
locationPinShape.bezierCurveTo(0.045, 0.005, 0.012, -0.025, 0, -0.05);
locationPinShape.closePath();

function Earth({
  onLocationSelect,
  selectedLatitude,
  selectedLongitude,
  interactionMode,
}) {
  const earthRef = useRef();
  const earthGroupRef = useRef();
  const cloudsRef = useRef();

  const targetRotationRef = useRef(null);

  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (selectedLatitude == null || selectedLongitude == null) {
      return;
    }

    const latitude = selectedLatitude * (Math.PI / 180);
    const longitude = (selectedLongitude + 180) * (Math.PI / 180);

    const marker = new Vector3(
      -Math.cos(latitude) * Math.cos(longitude),
      Math.sin(latitude),
      Math.cos(latitude) * Math.sin(longitude),
    ).normalize();

    const markerPositionVector = marker.clone().multiplyScalar(1.018);

    setMarkerPosition(markerPositionVector);

    const frontDirection = new Vector3(0, 0, 1);

    targetRotationRef.current = new Quaternion().setFromUnitVectors(
      marker,
      frontDirection,
    );
  }, [selectedLatitude, selectedLongitude]);

  const [earthTexture, cloudTexture] = useLoader(TextureLoader, [
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
  ]);

  earthTexture.colorSpace = SRGBColorSpace;
  cloudTexture.colorSpace = SRGBColorSpace;

  useFrame((state, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.035;
    }

    if (earthGroupRef.current && targetRotationRef.current) {
      earthGroupRef.current.quaternion.rotateTowards(
        targetRotationRef.current,
        delta * 1.5,
      );

      if (
        earthGroupRef.current.quaternion.angleTo(targetRotationRef.current) <
        0.001
      ) {
        earthGroupRef.current.quaternion.copy(targetRotationRef.current);
        targetRotationRef.current = null;
      }
    }
  });

  function handleEarthClick(event) {
    event.stopPropagation();

    if (interactionMode !== "select") return;

    if (event.delta > 5) return;

    if (!earthRef.current) return;

    const localPoint = earthRef.current
      .worldToLocal(event.point.clone())
      .normalize();

    const marker = localPoint.clone().multiplyScalar(1.018);

    setMarkerPosition(marker);

    const latitude = Math.asin(localPoint.y) * (180 / Math.PI);

    const longitude =
      Math.atan2(localPoint.z, -localPoint.x) * (180 / Math.PI) - 180;

    const selectedLocation = {
      latitude: Number(latitude.toFixed(5)),
      longitude: Number(longitude.toFixed(5)),
    };

    console.log("Selected globe location:", selectedLocation);

    if (onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
  }

  return (
    <group ref={earthGroupRef}>
      <mesh ref={earthRef} onClick={handleEarthClick}>
        <sphereGeometry args={[1, 96, 96]} />

        <meshStandardMaterial
          map={earthTexture}
          emissiveMap={earthTexture}
          emissive="#ffffff"
          emissiveIntensity={0.55}
          roughness={1}
          metalness={0}
          color="#ffffff"
        />
      </mesh>

      {markerPosition && (
        <group position={markerPosition}>
          <group
            quaternion={new Quaternion().setFromUnitVectors(
              new Vector3(0, 0, 1),
              markerPosition.clone().normalize(),
            )}
          >
            <mesh position={[0, 0, 0.02]} scale={1.28} renderOrder={2}>
              <shapeGeometry args={[locationPinShape]} />
              <meshBasicMaterial
                color="#9edaff"
                transparent
                opacity={0.42}
                side={DoubleSide}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, 0, 0.023]} scale={1.1} renderOrder={3}>
              <shapeGeometry args={[locationPinShape]} />
              <meshBasicMaterial
                color="#edf7ff"
                side={DoubleSide}
                toneMapped={false}
              />
            </mesh>

            <mesh position={[0, 0, 0.026]} renderOrder={4}>
              <shapeGeometry args={[locationPinShape]} />
              <meshBasicMaterial
                color="#17283f"
                side={DoubleSide}
                toneMapped={false}
              />
            </mesh>

            <mesh position={[0, 0.027, 0.03]} renderOrder={5}>
              <circleGeometry args={[0.012, 32]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>
        </group>
      )}

      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[1, 96, 96]} />

        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={GLOBE_SETTINGS.cloudOpacity}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh scale={GLOBE_SETTINGS.haloScale}>
        <sphereGeometry args={[1, 96, 96]} />

        <shaderMaterial
          transparent
          side={2}
          depthWrite={false}
          uniforms={{
            uHaloStrength: {
              value: GLOBE_SETTINGS.haloStrength,
            },
            uHaloPower: {
              value: GLOBE_SETTINGS.haloPower,
            },
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            void main() {
              vNormal = normalize(normalMatrix * normal);

              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vViewPosition = -mvPosition.xyz;

              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform float uHaloStrength;
            uniform float uHaloPower;

            varying vec3 vNormal;
            varying vec3 vViewPosition;

            void main() {
              float viewAngle = abs(dot(
                normalize(vNormal),
                normalize(vViewPosition)
              ));

              float rim = 1.0 - viewAngle;
              float intensity = pow(rim, uHaloPower);

              gl_FragColor = vec4(
                0.20,
                0.58,
                1.0,
                intensity * uHaloStrength
              );
            }
          `}
        />
      </mesh>
    </group>
  );
}

export default function Globe({
  onLocationSelect,
  selectedLatitude,
  selectedLongitude,
  rotationPaused = false,
}) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionMode, setInteractionMode] = useState("select");

  return (
    <div className={`globe-container ${isInteracting ? "is-dragging" : ""}`}>
      <div className="globe-canvas">
        <Canvas
          camera={{ position: [0, 0, 2.15], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={GLOBE_SETTINGS.ambientLight} />

          <directionalLight
            position={[4, 3, 5]}
            intensity={GLOBE_SETTINGS.sunlight}
            color="#fff4df"
          />

          <pointLight
            position={[-4, -2, -3]}
            intensity={GLOBE_SETTINGS.blueLight}
            color="#438dff"
          />

          <pointLight
            position={[2, -3, 4]}
            intensity={GLOBE_SETTINGS.coolLight}
            color="#8abaff"
          />

          <Suspense fallback={null}>
            <Earth
              onLocationSelect={onLocationSelect}
              selectedLatitude={selectedLatitude}
              selectedLongitude={selectedLongitude}
              interactionMode={interactionMode}
            />
          </Suspense>

          <OrbitControls
            enableZoom
            enablePan={false}
            enableRotate={interactionMode === "explore"}
            enableDamping
            dampingFactor={0.06}
            autoRotate={
              interactionMode === "explore" && !isInteracting && !rotationPaused
            }
            autoRotateSpeed={0.35}
            rotateSpeed={0.65}
            minDistance={1.3}
            maxDistance={4}
            minPolarAngle={0.15}
            maxPolarAngle={Math.PI - 0.15}
            onStart={() => setIsInteracting(true)}
            onEnd={() => setIsInteracting(false)}
          />
        </Canvas>
      </div>

      <div className="globe-controls">
        <button
          type="button"
          className={`globe-mode-button ${
            interactionMode === "select" ? "active" : ""
          }`}
          onClick={() => setInteractionMode("select")}
          aria-pressed={interactionMode === "select"}
        >
          <FontAwesomeIcon icon={faLocationDot} />
          <span>Select a location</span>
        </button>

        <button
          type="button"
          className={`globe-mode-button ${
            interactionMode === "explore" ? "active" : ""
          }`}
          onClick={() => setInteractionMode("explore")}
          aria-pressed={interactionMode === "explore"}
        >
          <FontAwesomeIcon icon={faArrowsLeftRight} />
          <span>Drag to explore</span>
        </button>
      </div>
    </div>
  );
}
