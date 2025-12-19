"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

interface GSAPAnimationProps {
  children: React.ReactNode
  animations?: AnimationConfig[]
  scrollTrigger?: boolean
  className?: string
}

interface AnimationConfig {
  target: string
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  duration?: number
  delay?: number
  ease?: string
  scrollTrigger?: ScrollTrigger.Vars
}

export function GSAPAnimator({ children, animations = [], scrollTrigger = false, className = "" }: GSAPAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      animations.forEach((config) => {
        const target = containerRef.current?.querySelector(config.target)
        if (!target) return

        const animationConfig: gsap.TweenVars = {
          ...config.to,
          duration: config.duration || 1,
          delay: config.delay || 0,
          ease: config.ease || "power2.out"
        }

        if (config.from) {
          gsap.fromTo(target, config.from, animationConfig)
        } else {
          gsap.to(target, animationConfig)
        }

        // Add scroll trigger if specified
        if (config.scrollTrigger || scrollTrigger) {
          ScrollTrigger.create({
            trigger: target,
            ...config.scrollTrigger,
            animation: gsap.to(target, animationConfig)
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [animations, scrollTrigger])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Stagger animation component
export function StaggerAnimation({ 
  children, 
  stagger = 0.1,
  animation = "fadeUp",
  className = "" 
}: {
  children: React.ReactNode
  stagger?: number
  animation?: "fadeUp" | "fadeIn" | "scaleIn" | "slideIn"
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.children
      if (!elements) return

      const animations = {
        fadeUp: {
          from: { y: 50, opacity: 0 },
          to: { y: 0, opacity: 1 }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        scaleIn: {
          from: { scale: 0.8, opacity: 0 },
          to: { scale: 1, opacity: 1 }
        },
        slideIn: {
          from: { x: -50, opacity: 0 },
          to: { x: 0, opacity: 1 }
        }
      }

      gsap.fromTo(
        elements,
        animations[animation].from,
        {
          ...animations[animation].to,
          duration: 0.8,
          stagger: stagger,
          ease: "power2.out"
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [stagger, animation])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Magnetic cursor effect with GSAP
export function MagneticCursor({ children, strength = 0.3, className = "" }: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return
      
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(container, {
        x: x * strength,
        y: y * strength,
        rotation: x * 0.01,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      gsap.to(container, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(container, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, isHovered])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Text typing animation
export function TypingAnimation({ 
  text, 
  speed = 0.05,
  className = "" 
}: {
  text: string
  speed?: number
  className?: string
}) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        text: text,
        duration: text.length * speed,
        ease: "none"
      })
    }, textRef)

    return () => ctx.revert()
  }, [text, speed])

  return (
    <div ref={textRef} className={className}>
      {text}
    </div>
  )
}

// Liquid morphing animation
export function LiquidMorph({ children, className = "" }: {
  children: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const element = containerRef.current
      if (!element) return

      // Create continuous morphing animation
      const tl = gsap.timeline({ repeat: -1, yoyo: true })
      
      tl.to(element, {
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        duration: 4,
        ease: "power1.inOut"
      })
      .to(element, {
        borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
        duration: 4,
        ease: "power1.inOut"
      })
      .to(element, {
        borderRadius: "30% 70% 70% 30% / 70% 30% 30% 70%",
        duration: 4,
        ease: "power1.inOut"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Parallax scroll animation
export function ParallaxScroll({ 
  children, 
  speed = 0.5,
  className = "" 
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Reveal animation on scroll
export function RevealOnScroll({ 
  children, 
  direction = "up",
  className = "" 
}: {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const animations = {
      up: { from: { y: 100, opacity: 0 } },
      down: { from: { y: -100, opacity: 0 } },
      left: { from: { x: 100, opacity: 0 } },
      right: { from: { x: -100, opacity: 0 } }
    }

    const ctx = gsap.context(() => {
      const element = containerRef.current
      if (!element) return

      gsap.fromTo(
        element,
        animations[direction].from,
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [direction])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
