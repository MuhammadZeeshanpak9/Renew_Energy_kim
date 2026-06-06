import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  y?: number
  x?: number
  duration?: number
  stagger?: number
  delay?: number
  scale?: number
  childSelector?: string
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 40,
      x = 0,
      duration = 0.8,
      stagger = 0.12,
      delay = 0,
      scale,
      childSelector,
    } = options

    const targets = childSelector ? el.querySelectorAll(childSelector) : el

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y,
      x,
    }

    if (scale !== undefined) {
      fromVars.scale = scale
    }

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    }

    if (scale !== undefined) {
      toVars.scale = 1
    }

    if (childSelector && targets instanceof NodeList && targets.length > 1) {
      toVars.stagger = stagger
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, fromVars, toVars)
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}
