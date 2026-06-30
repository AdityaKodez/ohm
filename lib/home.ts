export const loadingSteps = [
  "Reading learning material",
  "Designing balanced questions",
  "Checking answer keys",
  "Preparing quiz room",
]

export const promptIdeas = [
  "Photosynthesis",
  "French Revolution",
  "Human digestive system",
]

export const easeOut = [0.16, 1, 0.3, 1] as const

export const openingContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
}

export const openingItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: easeOut },
  },
}
