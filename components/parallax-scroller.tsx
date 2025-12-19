"use client"

import { useEffect, useRef, useState } from "react"
import { useScroll, useTransform, motion } from "framer-motion"

interface ParallaxLayer {
  id: string
  component: React.ReactNode
  speed: number
  opacity?: number
  scale?: number
}

interface ParallaxScrollerProps {
  children: React.ReactNode
  layers?: ParallaxLayer[]
  className?: string
}

export default function ParallaxScroller({ children, layers = [], className = "" }: ParallaxScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const midgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div 
      ref={containerRef}
      className={`relative h-screen overflow-y-auto parallax-depth-container ${className}`}
    >
      {/* Parallax Background Layer */}
      <motion.div
        className="absolute inset-0 parallax-layer parallax-bg"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float" />
          <div className="absolute top-40 right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-500/20 rounded-full blur-xl animate-parallax-float" />
        </div>
      </motion.div>

      {/* Parallax Midground Layer */}
      <motion.div
        className="absolute inset-0 parallax-layer parallax-mid pointer-events-none"
        style={{ y: midgroundY }}
      >
        <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full animate-rotate-3d" />
        </div>
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 opacity-25">
          <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-full animate-rotate-3d" style={{ animationDelay: "2s" }} />
        </div>
      </motion.div>

      {/* Parallax Foreground Elements */}
      <motion.div
        className="absolute inset-0 parallax-layer parallax-fg pointer-events-none"
        style={{ y: foregroundY }}
      >
        <div className="absolute top-20 left-10 w-16 h-16 opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 rounded-lg animate-liquid-morph" />
        </div>
        <div className="absolute bottom-40 right-20 w-20 h-20 opacity-35">
          <div className="w-full h-full bg-gradient-to-tr from-pink-400 to-cyan-400 rounded-full animate-liquid-morph" style={{ animationDelay: "1s" }} />
        </div>
      </motion.div>

      {/* Custom Layers */}
      {layers.map((layer, index) => (
        <motion.div
          key={layer.id}
          className="absolute inset-0 parallax-layer pointer-events-none"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -layer.speed * 100]),
            opacity: layer.opacity || 1,
            scale: layer.scale || 1
          }}
        >
          {layer.component}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Hook for parallax effect on individual elements
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffset(rate)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

// Parallax card component
export function ParallaxCard({ 
  children, 
  speed = 0.5, 
  className = "" 
}: { 
  children: React.ReactNode
  speed?: number
  className?: string 
}) {
  const { ref, offset } = useParallax(speed)

  return (
    <div 
      ref={ref}
      className={`relative will-change-transform ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}
