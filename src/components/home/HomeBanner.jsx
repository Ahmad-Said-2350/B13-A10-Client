"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function HomeBanner() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
      <motion.p
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="section-label mb-4"
      >
        Recipe Sharing Platform
      </motion.p>

      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mb-4 max-w-2xl"
      >
        Discover and share great recipes
      </motion.h1>

      <motion.p
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-secondary text-sm md:text-base max-w-md mb-8 leading-relaxed"
      >
        Browse community recipes, save favorites, and share your own creations.
      </motion.p>

      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Link href="/recipes" className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
          Browse Recipes
          <FiArrowRight size={15} />
        </Link>
        <Link href="/register" className="btn-secondary px-6 py-2.5 text-sm">
          Get Started
        </Link>
      </motion.div>
    </section>
  );
}


