"use client"

import { motion } from "motion/react"

import { openingItem } from "@/lib/home"

export function Hero() {
  return (
    <motion.div className="space-y-3 text-center" variants={openingItem}>
      <p className="font-display text-xl tracking-tight text-foreground/80 italic">Ohm</p>
      <div className="space-y-2.5">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          What should we quiz today?
        </h1>
        <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Type a topic or attach a PDF chapter. Ohm will turn it into a
          balanced live quiz with answer keys and AI feedback.
        </p>
      </div>
    </motion.div>
  )
}
