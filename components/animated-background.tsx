"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
    variant?: "mesh" | "particles" | "waves" | "explosions"
    intensity?: "low" | "medium" | "high"
}

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    life?: number
    maxLife?: number
    exploding?: boolean
}

interface ExplosionParticle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    life: number
    maxLife: number
}

export default function AnimatedBackground({ variant = "mesh", intensity = "medium" }: AnimatedBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const particlesRef = useRef<Particle[]>([])
    const explosionsRef = useRef<ExplosionParticle[]>([])

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particleCount = intensity === "low" ? 30 : intensity === "medium" ? 50 : 80
        const colors = [
            "rgba(168, 85, 247, 0.6)", 
            "rgba(6, 182, 212, 0.6)", 
            "rgba(236, 72, 153, 0.6)"
        ]

        // Initialize particles
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
        }))

        // Create explosion effect
        const createExplosion = (x: number, y: number) => {
            const particleCount = 20
            const explosionColors = [
                "rgba(168, 85, 247, 0.8)",
                "rgba(6, 182, 212, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(251, 191, 36, 0.8)"
            ]

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount
                const velocity = 2 + Math.random() * 3
                
                explosionsRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    size: Math.random() * 4 + 2,
                    color: explosionColors[Math.floor(Math.random() * explosionColors.length)],
                    life: 1,
                    maxLife: 1
                })
            }
        }

        // Random explosions
        const explosionInterval = setInterval(() => {
            if (variant === "explosions") {
                createExplosion(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                )
            }
        }, 2000)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw regular particles
            particlesRef.current.forEach((particle) => {
                particle.x += particle.vx
                particle.y += particle.vy

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = particle.color
                ctx.fill()

                // Draw connections
                particlesRef.current.forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - distance / 100)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            // Update and draw explosion particles
            explosionsRef.current = explosionsRef.current.filter((particle) => {
                particle.x += particle.vx
                particle.y += particle.vy
                particle.vx *= 0.98 // friction
                particle.vy *= 0.98
                particle.life -= 0.02

                if (particle.life <= 0) return false

                const opacity = particle.life / particle.maxLife
                ctx.save()
                ctx.globalAlpha = opacity
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
                
                // Create gradient for explosion particles
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * particle.life
                )
                gradient.addColorStop(0, particle.color)
                gradient.addColorStop(1, "transparent")
                
                ctx.fillStyle = gradient
                ctx.fill()
                
                // Add glow effect
                ctx.shadowBlur = 20
                ctx.shadowColor = particle.color
                ctx.fill()
                ctx.restore()

                return true
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", handleResize)

        return () => {
            cancelAnimationFrame(animationRef.current!)
            clearInterval(explosionInterval)
            window.removeEventListener("resize", handleResize)
        }
    }, [variant, intensity])

    if (variant === "mesh") {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 gradient-mesh animate-gradient-shift opacity-60" />
            </div>
        )
    }

    if (variant === "particles" || variant === "explosions") {
        return (
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: intensity === "low" ? 0.3 : intensity === "medium" ? 0.5 : 0.7 }}
            />
        )
    }

    if (variant === "waves") {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-full h-full"
                        style={{
                            background: `radial-gradient(circle at ${30 + i * 20}% ${40 + i * 15}%, rgba(168, 85, 247, 0.${3 - i}) 0%, transparent 50%)`,
                            animation: `wave ${8 + i * 2}s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    />
                ))}
            </div>
        )
    }

    return null
}
