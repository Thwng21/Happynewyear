"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stars, Sparkles, ContactShadows, Text, Float, Loader, Html } from "@react-three/drei";
import { useRef, Suspense, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const WISHES = [
  "Năm mới phát tài, vạn sự như ý!",
  "Sức khỏe dồi dào, an khang thịnh vượng!",
  "Tiền vào như nước, tiền ra nhỏ giọt!",
  "Công thành danh toại, sự nghiệp thăng tiến!",
  "Hay ăn chóng lớn, học hành tấn tới!",
  "Tình duyên phơi phới, hạnh phúc ngập tràn!",
  "Vạn sự cát tường, toàn gia hạnh phúc!",
  "Tấn tài tấn lộc, mã đáo thành công!"
];

const MONEY_VALUES = [
  { value: "1.000", label: "Một Nghìn Đồng", color: "#e6b800" },
  { value: "20.000", label: "Hai Mươi Nghìn Đồng", color: "#4da6ff" },
  { value: "50.000", label: "Năm Mươi Nghìn Đồng", color: "#ff99cc" },
  { value: "100.000", label: "Một Trăm Nghìn Đồng", color: "#66ff66" },
  { value: "200.000", label: "Hai Trăm Nghìn Đồng", color: "#ff8080" },
  { value: "500.000", label: "Năm Trăm Nghìn Đồng", color: "#00cc99" },
];

const SPECIAL_GIFTS = [
  { id: 'dog', model: "/models/dog.glb", text: "Năm mới bớt sống chó lại nha bạn!", type: "funny", scale: 1.5, offset: [0, -1, 0] },
  { id: 'hacker', model: "/models/hacker.glb", text: "Cẩn thận kẻo bị hack Facebook đó!", type: "funny", scale: 0.5, offset: [0, -2.5, 0] },
  { id: 'hoasen', model: "/models/hoasen.glb", text: "Chúc cho tâm hồn thanh cao như đóa sen hồng", type: "serious", scale: 2.0, offset: [0, -2, 0] },
  { id: 'banhchung', model: "/models/banhchung.glb", text: "Tết này ấm no, bánh chưng đầy thịt", type: "serious", scale: 1.0, offset: [-2, -0.5, 0], textPosition: [1.5, 0, 0], textAlign: 'left', anchorX: 'left' },
  { id: 'dienthoai', model: "/models/dienthoai.glb", text: "Chúc năm nay mua được ip17 promax", type: "serious", scale: 2.5, offset: [0, 0, 0] },
];

function SpecialGiftModel({ gift, onClose }: { gift: any, onClose: () => void }) {
  const { scene } = useGLTF(gift.model) as any;
  const clone = useMemo(() => scene.clone(), [scene]);
  const { viewport } = useThree();
  const isMobile = viewport.width < 10;
  
  // Responsive adjustments
  const finalScale = isMobile ? gift.scale * 0.6 : gift.scale;
  const finalOffset = isMobile && gift.id === 'banhchung' ? [0, -1, 0] : (gift.offset || [0, 0, 0]);
  const finalTextPosition = isMobile && gift.id === 'banhchung' ? [0, 3, 0] : (gift.textPosition || [0, 4, 0]);
  const finalTextAlign = isMobile && gift.id === 'banhchung' ? 'center' : (gift.textAlign || 'center');
  const finalAnchorX = isMobile && gift.id === 'banhchung' ? 'center' : (gift.anchorX || 'center');

  return (
    <group position={[15, 2, 0]} scale={isMobile ? 0.6 : 1}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <primitive 
            object={clone} 
            scale={gift.scale * 7} 
            position={finalOffset} 
        />
        <Text
            position={finalTextPosition}
            fontSize={0.5}
            color="#ffd700"
            anchorX={finalAnchorX}
            anchorY="middle"
            maxWidth={isMobile ? 3.5 : 6}
            textAlign={finalTextAlign}
            outlineWidth={0.02}
            outlineColor="#5c0000"
        >
            {gift.text}
        </Text>
        <Html position={[0, -3, 0]} center>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-full border-2 border-yellow-400 hover:bg-red-700 transition-colors shadow-lg whitespace-nowrap"
            >
                Đóng
            </button>
        </Html>
      </Float>
    </group>
  )
}

function GiftButton({ onClick, position }: { onClick: () => void, position: [number, number, number] }) {
  return (
    <Html position={position} center distanceFactor={10} zIndexRange={[100, 0]}>
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className="bg-red-600 text-white font-bold py-2 px-4 rounded-full border-2 border-yellow-400 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.8)] whitespace-nowrap hover:scale-110 transition-transform cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        🎁 Mở Quà
      </button>
    </Html>
  )
}

function LuckyMoneyBill({ value, label, color }: { value: string, label: string, color: string }) {
  // Generate a random serial number
  const serialNumber = useMemo(() => {
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const number = Math.floor(Math.random() * 10000000).toString().padStart(8, '0');
    return `${prefix} ${number}`;
  }, []);

  return (
    <div className="w-full h-full bg-[#fdfbf7] rounded-sm shadow-xl flex relative overflow-hidden select-none"
         style={{ 
           boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${color}, inset 0 0 20px rgba(0,0,0,0.1)`
         }}>
        
        {/* Guilloche Pattern Simulation (Background) */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 50% 50%, transparent 20%, ${color} 21%, transparent 22%),
                 radial-gradient(circle at 0% 0%, transparent 20%, ${color} 21%, transparent 22%),
                 radial-gradient(circle at 100% 0%, transparent 20%, ${color} 21%, transparent 22%),
                 radial-gradient(circle at 100% 100%, transparent 20%, ${color} 21%, transparent 22%),
                 radial-gradient(circle at 0% 100%, transparent 20%, ${color} 21%, transparent 22%),
                 repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent 8px)
               `,
               backgroundSize: '100% 100%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 20px 20px' 
             }}>
        </div>

        {/* Border Frame */}
        <div className="absolute inset-3 border-2 border-dashed opacity-60 rounded-sm" style={{ borderColor: color }}></div>
        <div className="absolute inset-1 border border-solid opacity-30 rounded-sm" style={{ borderColor: color }}></div>
        
        {/* Content */}
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6 z-10">
            {/* Top Row */}
            <div className="w-full flex justify-between items-start">
                <div className="flex flex-col items-start">
                    <span className="font-bold text-2xl font-serif" style={{ color: color }}>{value}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ngân Hàng GWOUTH</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-xs font-serif uppercase tracking-[0.3em] text-gray-600 font-bold">Cộng Hòa Xã Hội Chủ Nghĩa THÂN THƯƠNG</div>
                    <div className="text-[10px] font-serif text-gray-500">Độc lập - Tự do - Hạnh phúc</div>
                </div>
                <span className="font-bold text-2xl font-serif" style={{ color: color }}>{value}</span>
            </div>

            {/* Center */}
            <div className="flex flex-row items-center justify-center w-full gap-8">
                {/* Left Emblem */}
                <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center bg-white/40 backdrop-blur-[1px]" 
                     style={{ borderColor: color }}>
                     <div className="w-20 h-20 rounded-full border border-dashed flex items-center justify-center opacity-80" style={{ borderColor: color }}>
                        <span className="text-4xl filter grayscale opacity-70">🌸</span>
                     </div>
                </div>

                {/* Center Value */}
                <div className="flex flex-col items-center">
                    <div className="text-6xl font-bold font-serif tracking-tighter drop-shadow-sm" 
                         style={{ 
                             color: color,
                             textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                         }}>
                        {value}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] mt-2 text-gray-700 border-t border-b py-1" style={{ borderColor: color }}>
                        {label}
                    </div>
                </div>

                {/* Right Portrait Placeholder (Silhouette) */}
                <div className="w-24 h-32 rounded-full/10 border flex items-center justify-center bg-gradient-to-b from-transparent to-gray-100/50 overflow-hidden relative"
                     style={{ borderColor: color }}>
                     <div className="absolute bottom-0 w-20 h-24 bg-gray-300/30 rounded-t-full blur-sm"></div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="w-full flex justify-between items-end">
                 <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-red-600 tracking-widest">{serialNumber}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 uppercase">Thống đốc ngân hàng</span>
                    <div className="h-8 w-20 relative">
                        {/* Fake Signature */}
                        <svg viewBox="0 0 100 40" className="w-full h-full opacity-70" style={{ stroke: color }}>
                            <path d="M10,30 Q30,10 50,30 T90,20" fill="none" strokeWidth="2" />
                        </svg>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  )
}

function BanModel() {
  const { scene } = useGLTF("/models/ban.glb");
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clone} scale={1} position={[0, -1, 0]} />;
}

function BaolixiModel({ onClick }: { onClick: () => void }) {
  const { scene } = useGLTF("/models/baolixi.glb");
  const clone = useMemo(() => scene.clone(), [scene]);
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime;
      // Animation relative to the container
      ref.current.position.y = 0.2 + Math.abs(Math.sin(time * 3)) * 0.3;
      ref.current.rotation.y = time * 0.5;
      
      // Scale effect on hover
      const targetScale = hovered ? 0.6 : 0.5;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <group>
      <primitive 
        ref={ref} 
        object={clone} 
        scale={0.5} 
        position={[0, 0, 0]} 
      />
      {/* Invisible Hit Box for easier clicking */}
      <mesh 
        position={[0, 0.3, 0]} 
        scale={[0.8, 0.8, 0.8]}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Clicked!");
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <boxGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function CameraTransition({ targetPosition }: { targetPosition: [number, number, number] }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition[0], targetPosition[1], targetPosition[2]]);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    setIsMoving(true);
  }, [targetPosition[0], targetPosition[1], targetPosition[2]]);

  useFrame((state) => {
    if (isMoving) {
      state.camera.position.lerp(target, 0.05);
      if (state.camera.position.distanceTo(target) < 0.1) {
        setIsMoving(false);
      }
    }
  });
  return null;
}

function Scene({ onBaolixiClick, onGiftBoxClick, specialGift, onCloseSpecialGift, isWelcomeVisible, isRewardOpen }: { 
    onBaolixiClick: () => void, 
    onGiftBoxClick: () => void,
    specialGift: any,
    onCloseSpecialGift: () => void,
    isWelcomeVisible: boolean,
    isRewardOpen: boolean
}) {
  // Camera states
  const defaultCameraPos: [number, number, number] = [0, 5, 12];
  const giftCameraPos: [number, number, number] = [15, 5, 12];

  return (
    <>
      <CameraTransition targetPosition={specialGift ? giftCameraPos : defaultCameraPos} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={12} size={4} speed={0.4} opacity={0.5} color="#ffd700" />
      
      <group position={[0, -0.5, 0]}>
        <BanModel />
        {!isWelcomeVisible && !specialGift && !isRewardOpen && (
            <GiftButton onClick={onGiftBoxClick} position={[-1.2, 1.5, -0.8]} />
        )}
        <group position={[-3.8, 0.8, 1.0]}>
            <BaolixiModel onClick={onBaolixiClick} />
        </group>
      </group>

      <Suspense fallback={null}>
        {specialGift && (
            <SpecialGiftModel gift={specialGift} onClose={onCloseSpecialGift} />
        )}
      </Suspense>
      
      <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={10} color="#000000" />
      <Environment preset="city" />
    </>
  );
}

export default function NewYearExperience() {
  const [reward, setReward] = useState<{ money: typeof MONEY_VALUES[0]; wish: string } | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [ready, setReady] = useState(false);
  const [specialGift, setSpecialGift] = useState<any>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const handleOpenRedEnvelope = () => {
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];
    const randomMoney = MONEY_VALUES[Math.floor(Math.random() * MONEY_VALUES.length)];
    setReward({ money: randomMoney, wish: randomWish });
  };

  const handleOpenGiftBox = () => {
      const randomGift = SPECIAL_GIFTS[Math.floor(Math.random() * SPECIAL_GIFTS.length)];
      setSpecialGift(randomGift);
  };

  return (
    <div className="w-full h-screen bg-black relative">
      {ready && (
        <Canvas camera={{ position: [0, 5, 12], fov: 45 }} shadows>
          <Suspense fallback={null}>
            <Scene 
                onBaolixiClick={handleOpenRedEnvelope} 
                onGiftBoxClick={handleOpenGiftBox}
                specialGift={specialGift}
                onCloseSpecialGift={() => setSpecialGift(null)}
                isWelcomeVisible={showWelcome}
                isRewardOpen={!!reward}
            />
          </Suspense>
          <OrbitControls 
            enableZoom={true} 
            autoRotate={true} // Always auto rotate
            autoRotateSpeed={0.5} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2} 
            target={specialGift ? [15, 2, 0] : [0, 0, 0]} // Update target for controls
          />
        </Canvas>
      )}
      
      {/* Debug Controls Toggle */}
      {/* Removed Debug Controls */}
      
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none select-none">
        <h1 className="text-4xl md:text-6xl font-serif text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          Chúc Mừng Năm Mới 2026
        </h1>
        <p className="text-white/80 mt-2 font-serif italic">Vạn sự như ý - Tỷ sự như mơ</p>
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-[#a00000] to-[#800000] p-8 rounded-2xl border-2 border-[#ffd700] max-w-lg w-full text-center shadow-[0_0_50px_rgba(255,215,0,0.2)]"
            >
              <h2 className="text-3xl font-bold text-[#ffd700] mb-4 font-serif">Lời Chúc Năm Mới</h2>
              <p className="text-xl text-white font-serif italic mb-8 leading-relaxed">
                "Phạm Hữu Thân Thương chúc mừng năm mới. Hãy khám phá những món quà ở trên bàn nhé."
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="bg-[#ffd700] text-[#a00000] px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg hover:scale-105 transform duration-200"
              >
                Khám Phá Ngay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setReward(null)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-[#a00000] p-8 rounded-2xl border-4 border-[#ffd700] max-w-md w-full text-center shadow-[0_0_50px_rgba(255,215,0,0.3)] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Decorative patterns */}
               <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#ffd700] rounded-tl-xl opacity-50"></div>
               <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#ffd700] rounded-tr-xl opacity-50"></div>
               <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#ffd700] rounded-bl-xl opacity-50"></div>
               <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#ffd700] rounded-br-xl opacity-50"></div>

              <h2 className="text-3xl font-bold text-[#ffd700] mb-6 font-serif">Lì Xì May Mắn</h2>
              
              <div className="relative w-full aspect-[2/1] mb-6 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                <LuckyMoneyBill 
                  value={reward.money.value} 
                  label={reward.money.label} 
                  color={reward.money.color} 
                />
              </div>
              
              <p className="text-xl text-white font-serif italic mb-8 leading-relaxed">
                "{reward.wish}"
              </p>
              
              <button
                onClick={() => setReward(null)}
                className="bg-[#ffd700] text-[#a00000] px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
              >
                Cảm ơn & Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Preload models
useGLTF.preload("/models/ban.glb");
useGLTF.preload("/models/baolixi.glb");
useGLTF.preload("/models/dog.glb");
useGLTF.preload("/models/hacker.glb");
useGLTF.preload("/models/hoasen.glb");
useGLTF.preload("/models/banhchung.glb");
useGLTF.preload("/models/dienthoai.glb");
