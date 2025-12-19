"use client"

import { useEffect, useRef } from "react"

interface FloatingShapesProps {
    count?: number
    colors?: string[]
}

export default function FloatingShapes({ count = 8, colors = ["purple", "cyan", "pink"] }: FloatingShapesProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const shapes = containerRef.current.querySelectorAll(".floating-shape")
        shapes.forEach((shape, index) => {
            const delay = Math.random() * 5
            const duration = 15 + Math.random() * 10
                ; (shape as HTMLElement).style.animationDelay = `${delay}s`
                ; (shape as HTMLElement).style.animationDuration = `${duration}s`
        })
    }, [])

    const getShapeColor = (index: number) => {
        const colorMap: Record<string, string> = {
            purple: "from-purple-500/20 to-purple-600/10",
            cyan: "from-cyan-500/20 to-cyan-600/10",
            pink: "from-pink-500/20 to-pink-600/10",
        }
        return colorMap[colors[index % colors.length]]
    }

    const getShapeType = (index: number) => {
        const types = ["cube", "sphere", "pyramid"]
        return types[index % types.length]
    }

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: count }).map((_, i) => {
                const type = getShapeType(i)
                const size = 60 + Math.random() * 100
                const left = Math.random() * 100
                const top = Math.random() * 100

                return (
                    <div
                        key={i}
                        className="floating-shape absolute animate-float-slow will-change-transform"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                        }}
                    >
                        {type === "cube" && (
                            <div className={`w-full h-full bg-gradient-to-br ${getShapeColor(i)} rounded-lg transform-3d animate-rotate-3d opacity-40`} />
                        )}
                        {type === "sphere" && (
                            <div className={`w-full h-full bg-gradient-to-br ${getShapeColor(i)} rounded-full blur-sm opacity-30`} />
                        )}
                        {type === "pyramid" && (
                            <div
                                className={`w-full h-full bg-gradient-to-br ${getShapeColor(i)} opacity-30`}
                                style={{
                                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                }}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
