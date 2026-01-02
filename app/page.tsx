"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Envelope from "@/components/Envelope";
import NewYearExperience from "@/components/NewYearExperience";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="w-full h-screen overflow-hidden bg-black relative">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.5 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-10"
          >
            <Envelope onOpen={() => setIsOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="experience"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <NewYearExperience />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
