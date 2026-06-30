"use client"

import { motion, useReducedMotion } from "motion/react"

import { easeOut } from "@/lib/home"

/**
 * Decorative, education-themed line doodles anchored to the bottom corners of
 * the landing page. Purely cosmetic: hidden from assistive tech, non-interactive,
 * and tucked behind the quiz card (z-0). Hidden on small screens so they never
 * crowd the centered content.
 */
export function CornerDoodles() {
  const shouldReduceMotion = useReducedMotion()

  const reveal = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 12 },
    animate: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
  }

  const float = shouldReduceMotion
    ? undefined
    : { y: [0, -6, 0], rotate: [0, -1.5, 0] }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-64 md:block"
    >
      {/* Bottom-left: stack of books with a leaning pencil */}
      <motion.svg
        className="absolute bottom-4 left-4 size-40 text-primary lg:bottom-6 lg:left-8 lg:size-48"
        viewBox="0 0 200 200"
        fill="none"
        {...reveal}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.3 }}
      >
        <motion.g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={float}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* Book stack */}
          <g strokeWidth={3} className="opacity-30">
            <rect x="34" y="150" width="92" height="24" rx="5" />
            <path d="M34 158h92" strokeWidth={2} />
            <rect x="42" y="126" width="84" height="24" rx="5" />
            <path d="M42 134h84" strokeWidth={2} />
            <rect x="36" y="102" width="78" height="24" rx="5" />
            <path d="M36 110h78" strokeWidth={2} />
            {/* bookmark */}
            <path d="M62 102v16l6-5 6 5v-16" strokeWidth={2} />
          </g>

          {/* Pencil leaning on the stack */}
          <g strokeWidth={3} className="opacity-25">
            <path d="M150 174 178 96" strokeWidth={6} />
            <path d="m150 174 5-13 7 2.4" strokeWidth={2.5} />
            <path d="m178 96-3-13" strokeWidth={2.5} />
          </g>

          {/* sparkle */}
          <path
            d="M150 116v14M143 123h14"
            strokeWidth={2.5}
            className="opacity-40"
          />
        </motion.g>
      </motion.svg>

      {/* Bottom-right: lightbulb idea, atom, and question mark */}
      <motion.svg
        className="absolute right-4 bottom-4 size-40 text-primary lg:right-8 lg:bottom-6 lg:size-48"
        viewBox="0 0 200 200"
        fill="none"
        {...reveal}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.45 }}
      >
        <motion.g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={float}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* Lightbulb */}
          <g strokeWidth={3} className="opacity-30">
            <path d="M104 64a30 30 0 0 1 18 54c-4 3-6 7-6 12h-24c0-5-2-9-6-12a30 30 0 0 1 18-54Z" />
            <path d="M96 142h16M99 152h10" strokeWidth={2.5} />
            <path d="M104 96v18M97 104l7 4 7-6" strokeWidth={2} />
          </g>
          {/* Idea rays */}
          <path
            d="M104 40v-12M138 54l8-8M70 54l-8-8M150 92h12M58 92H46"
            strokeWidth={2.5}
            className="opacity-25"
          />

          {/* Atom */}
          <g strokeWidth={2.5} className="opacity-25">
            <circle cx="52" cy="150" r="4" />
            <ellipse cx="52" cy="150" rx="22" ry="9" />
            <ellipse cx="52" cy="150" rx="22" ry="9" transform="rotate(60 52 150)" />
            <ellipse cx="52" cy="150" rx="22" ry="9" transform="rotate(120 52 150)" />
          </g>

          {/* sparkle */}
          <path
            d="M158 138v12M152 144h12"
            strokeWidth={2.5}
            className="opacity-40"
          />
        </motion.g>
      </motion.svg>
    </div>
  )
}
