import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/types";

function getCSSVar(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

const CARD_W = 1.6;
const CARD_H = 2.2;
const CARD_D = 0.1;
const IMG_W = CARD_W - 0.4;
const IMG_H = 0.65;
const IMG_RADIUS = 0.08;

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

const roundedImgGeometry = new THREE.ShapeGeometry(createRoundedRectShape(IMG_W, IMG_H, IMG_RADIUS));
// Fix UVs to map texture correctly
const uvAttr = roundedImgGeometry.attributes.uv;
const posAttr = roundedImgGeometry.attributes.position;
for (let i = 0; i < uvAttr.count; i++) {
  uvAttr.setXY(i, (posAttr.getX(i) + IMG_W / 2) / IMG_W, (posAttr.getY(i) + IMG_H / 2) / IMG_H);
}

const LANG_ICON_MAP: Record<string, string> = {
  typescript: "/icons/typescript.png",
  javascript: "/icons/javascript.png",
  java: "/icons/java.png",
  python: "/icons/python.png",
};

function CardImage({ repoName, language }: { repoName: string; language?: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const url = `/projects/${repoName}.png`;
    const applyTexture = (tex: THREE.Texture) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      const img = tex.image as HTMLImageElement;
      const imgAspect = img.width / img.height;
      const frameAspect = IMG_W / IMG_H;
      if (imgAspect > frameAspect) {
        const scale = frameAspect / imgAspect;
        tex.offset.set((1 - scale) / 2, 0);
        tex.repeat.set(scale, 1);
      } else {
        const scale = imgAspect / frameAspect;
        tex.offset.set(0, (1 - scale) / 2);
        tex.repeat.set(1, scale);
      }
      setTexture(tex);
      setIsFallback(false);
    };

    const loadFallback = () => {
      const iconUrl = LANG_ICON_MAP[(language || "").toLowerCase()];
      if (iconUrl) {
        loader.load(iconUrl, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          setTexture(tex);
          setIsFallback(true);
        }, undefined, () => setTexture(null));
      } else {
        setTexture(null);
      }
    };

    loader.load(url, applyTexture, undefined, () => {
      loader.load(`/projects/${repoName}.jpg`, applyTexture, undefined, loadFallback);
    });
  }, [repoName, language]);

  if (!texture) return null;

  if (isFallback) {
    return (
      <mesh position={[0, 0.4, 0.07]}>
        <planeGeometry args={[0.45, 0.45]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>
    );
  }

  return (
    <>
      {/* Front image */}
      <mesh position={[0, 0.35, 0.07]} geometry={roundedImgGeometry}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Back mirror reflection — flipped and faded */}
      <mesh position={[0, 0.35, -0.08]} rotation={[0, Math.PI, 0]} geometry={roundedImgGeometry}>
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.15} />
      </mesh>
    </>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  rotation: number;
  onSelect: (project: Project) => void;
  hoveredId: number | null;
  onHover: (id: number | null) => void;
  isFront: boolean;
  isSelected: boolean;
  cardColor: string;
  textColor: string;
  textMutedColor: string;
}

function ProjectCard({ project, index, total, rotation, onSelect, hoveredId, onHover, isFront, isSelected, cardColor, textColor, textMutedColor }: ProjectCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const isHovered = hoveredId === project.id;
  const angle = (index / total) * Math.PI * 2 + rotation;
  const radius = Math.max(3, total * 0.45);

  const targetPos = useMemo(() => new THREE.Vector3(), []);

  // Front card is bigger
  const baseScale = isFront ? 1.25 : 1;
  const targetScale = isHovered ? baseScale * 1.06 : baseScale;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const liftY = isSelected && isFront ? 1.5 : 0;
    targetPos.set(Math.sin(angle) * radius, liftY, Math.cos(angle) * radius);
    meshRef.current.position.lerp(targetPos, 1 - Math.pow(0.001, delta));
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, -angle, 1 - Math.pow(0.001, delta));
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 1 - Math.pow(0.001, delta));
    meshRef.current.scale.setScalar(s);
  });

  const color = useMemo(() => new THREE.Color(project.color), [project.color]);
  const displayTitle = project.title.length > 18 ? project.title.slice(0, 16) + "…" : project.title;

  const cardContent = (
    <group
      onClick={(e) => { e.stopPropagation(); onSelect(project); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(project.id); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = "default"; }}
    >
      {/* Glass card */}
      <RoundedBox args={[CARD_W, CARD_H, CARD_D]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color={isHovered || isFront ? color : new THREE.Color(cardColor)}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Edge glow */}
      <RoundedBox args={[CARD_W + 0.03, CARD_H + 0.03, 0.02]} radius={0.1} smoothness={4} position={[0, 0, -0.06]}>
        <meshBasicMaterial color={color} transparent opacity={isHovered || isFront ? 0.5 : 0.15} />
      </RoundedBox>

      {/* Project number */}
      <Text
        position={[-CARD_W / 2 + 0.15, CARD_H / 2 - 0.12, 0.07]}
        fontSize={0.12}
        color={project.color}
        anchorX="left"
        anchorY="top"
      >
        {String(index + 1).padStart(2, "0")}
      </Text>

      {/* Screenshot image */}
      <CardImage repoName={project.title} language={project.tech[0]} />

      {/* Title */}
      <Text
        position={[0, -0.15, 0.07]}
        fontSize={0.14}
        maxWidth={CARD_W - 0.3}
        textAlign="center"
        color={textColor}
        anchorY="top"
      >
        {displayTitle}
      </Text>

      {/* Language / tech */}
      <Text
        position={[0, -0.55, 0.07]}
        fontSize={0.09}
        maxWidth={CARD_W - 0.3}
        textAlign="center"
        color={textMutedColor}
        anchorY="top"
      >
        {project.tech.slice(0, 3).join(" · ")}
      </Text>

      {/* Bottom accent line */}
      <mesh position={[0, -CARD_H / 2 + 0.15, 0.06]}>
        <planeGeometry args={[(isHovered || isFront) ? CARD_W * 0.7 : CARD_W * 0.35, 0.015]} />
        <meshBasicMaterial color={color} transparent opacity={(isHovered || isFront) ? 0.9 : 0.4} />
      </mesh>
    </group>
  );

  return (
    <group ref={meshRef}>
      {isFront ? (
        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2}>
          {cardContent}
        </Float>
      ) : (
        cardContent
      )}
    </group>
  );
}

function CameraRig({ entranceComplete, projectCount }: { entranceComplete: boolean; projectCount: number }) {
  const { camera } = useThree();
  const initialPos = useRef(new THREE.Vector3(0, 8, 14));
  const targetPos = useRef(new THREE.Vector3(0, 4.0, Math.max(8, projectCount * 0.7 + 4)));
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    targetPos.current.z = Math.max(8, projectCount * 0.7 + 4);
    if (!entranceComplete) {
      elapsed.current += delta;
      const t = Math.min(elapsed.current / 3, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      camera.position.lerpVectors(initialPos.current, targetPos.current, ease);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.lerp(targetPos.current, 1 - Math.pow(0.01, delta));
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function Particles({ color: particleColor }: { color: string }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={particleColor} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// Normalize angle to [0, PI] distance from front
function angleDist(angle: number): number {
  const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return normalized > Math.PI ? Math.PI * 2 - normalized : normalized;
}

interface CarouselSceneProps {
  projects: Project[];
  selectedProjectId: number | null;
  onSelectProject: (project: Project) => void;
}

export default function CarouselScene({ projects, selectedProjectId, onSelectProject }: CarouselSceneProps) {
  const [sceneColors, setSceneColors] = useState({
    bg: "#B8CFEA",
    card: "#DDECEF",
    text: "#FAFBFC",
    textMuted: "#E8ECF0",
    lightPrimary: "#A8C5D6",
    lightSecondary: "#C5BFCF",
    particle: "#A8C5D6",
  });

  useEffect(() => {
    setSceneColors({
      bg: getCSSVar("--scene-bg", "#B8CFEA"),
      card: getCSSVar("--scene-card", "#DDECEF"),
      text: getCSSVar("--scene-text", "#FAFBFC"),
      textMuted: getCSSVar("--scene-text-muted", "#E8ECF0"),
      lightPrimary: getCSSVar("--scene-light-primary", "#A8C5D6"),
      lightSecondary: getCSSVar("--scene-light-secondary", "#C5BFCF"),
      particle: getCSSVar("--scene-particle", "#A8C5D6"),
    });
  }, []);

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const lastX = useRef(0);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const animatingRef = useRef(false);
  const pendingSelectRef = useRef<Project | null>(null);
  const lastInteraction = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Gentle clockwise auto-rotation — pauses during interaction, resumes after 3s idle
  useEffect(() => {
    const idle = !isDragging && !animatingRef.current && !selectedProjectId && hoveredId === null;
    if (!entranceComplete || !idle) return;

    let raf: number;
    let prev = performance.now();
    const AUTO_SPEED = 0.06;
    const RESUME_DELAY = 3000;

    const tick = () => {
      const now = performance.now();
      const dt = (now - prev) / 1000;
      prev = now;

      if (now - lastInteraction.current > RESUME_DELAY) {
        setRotation(r => r - AUTO_SPEED * dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entranceComplete, isDragging, selectedProjectId, hoveredId]);

  // Animate rotation smoothly toward a target, then open modal
  const animateToCard = useCallback((project: Project, index: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    pendingSelectRef.current = project;

    // Calculate target rotation to bring this card to front (angle = 0)
    const cardAngle = (index / projects.length) * Math.PI * 2;
    // We need rotation such that cardAngle + rotation ≡ 0 (mod 2π)
    const targetRot = -cardAngle;
    // Find shortest path from current rotation
    const current = rotation;
    let diff = targetRot - current;
    // Normalize to [-π, π]
    diff = ((diff + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    const finalTarget = current + diff;

    const startRot = current;
    const duration = 600; // ms
    const startTime = performance.now();

    const step = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      setRotation(startRot + diff * ease);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setRotation(finalTarget);
        animatingRef.current = false;
        if (pendingSelectRef.current) {
          onSelectProject(pendingSelectRef.current);
          pendingSelectRef.current = null;
        }
      }
    };
    requestAnimationFrame(step);
  }, [rotation, projects.length, onSelectProject]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (animatingRef.current) return;
    lastInteraction.current = performance.now();
    setIsDragging(true);
    lastX.current = e.clientX;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || animatingRef.current) return;
    lastInteraction.current = performance.now();
    const dx = e.clientX - lastX.current;
    setRotation(r => r + dx * 0.003);
    lastX.current = e.clientX;
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    lastInteraction.current = performance.now();
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (animatingRef.current) return;
    lastInteraction.current = performance.now();
    setRotation(r => r + e.deltaY * 0.001);
  }, []);

  // Find front-most card ID
  const frontId = useMemo(() => {
    let bestId = projects[0]?.id ?? null;
    let bestDist = Infinity;
    projects.forEach((p, i) => {
      const angle = (i / projects.length) * Math.PI * 2 + rotation;
      const dist = angleDist(angle);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = p.id;
      }
    });
    return bestId;
  }, [projects, rotation]);

  return (
    <div
      className="fixed inset-0"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 8, 14], fov: 45 }}
      >
        <color attach="background" args={["#A3C4E0"]} />
        <fog attach="fog" args={["#A3C4E0", 10, 30]} />

        <CameraRig entranceComplete={entranceComplete} projectCount={projects.length} />

        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color={sceneColors.lightPrimary} />
        <pointLight position={[-5, 3, -5]} intensity={1} color={sceneColors.lightSecondary} />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} color={sceneColors.text} />

        <Environment preset="night" background={false} />

        {/* Ground reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color={"#A3C4E0"} metalness={0.8} roughness={0.3} />
        </mesh>


        <Particles color={sceneColors.particle} />

        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            total={projects.length}
            rotation={rotation}
            onSelect={(p) => animateToCard(p, i)}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            isFront={project.id === frontId}
            isSelected={project.id === selectedProjectId}
            cardColor={sceneColors.card}
            textColor={sceneColors.text}
            textMutedColor={sceneColors.textMuted}
          />
        ))}
      </Canvas>
    </div>
  );
}
