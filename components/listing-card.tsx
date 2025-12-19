"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    description: string
    price: number
    image_url: string
    category: string
    seller: { username: string; avatar: string }
    rating: number
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [magneticPosition, setMagneticPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const rippleIdRef = useRef(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    setMousePosition({
      x: mouseX,
      y: mouseY
    })
    
    // Magnetic effect
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
    const maxDistance = 150
    if (distance < maxDistance) {
      const strength = 1 - (distance / maxDistance)
      const magneticX = mouseX * strength * 0.3
      const magneticY = mouseY * strength * 0.3
      setMagneticPosition({ x: magneticX, y: magneticY })
    } else {
      setMagneticPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
    setMagneticPosition({ x: 0, y: 0 })
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  return (
    <Card
      ref={cardRef}
      className={`group relative border-2 border-border bg-card overflow-hidden transition-all duration-500 hover:border-purple-500/50 will-change-transform perspective-1000 magnetic-element cursor-magnet ${
        isHovered ? 'glow-on-hover-enhanced' : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `
          rotateY(${mousePosition.x / 20}deg) 
          rotateX(${-mousePosition.y / 20}deg)
          translateX(${magneticPosition.x}px)
          translateY(${magneticPosition.y}px)
        `,
        '--magnetic-x': `${magneticPosition.x}px`,
        '--magnetic-y': `${magneticPosition.y}px`
      } as React.CSSProperties}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none animate-ripple-expand"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)'
          }}
        />
      ))}

      {/* Enhanced holographic shimmer effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 animate-shimmer-enhanced" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-data-flow" />
      </div>

      {/* Liquid morph border effect */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-700 ${
        isHovered ? 'liquid-border' : ''
      }`} />

      {/* Enhanced glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-lg transition-all duration-500 ${
        isHovered ? 'opacity-30 blur-md' : 'opacity-0'
      }`} />

      {/* Image with enhanced hover effect */}
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src={listing.image_url || "/placeholder.svg"}
          alt={listing.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Category badge with enhanced float animation */}
        <div className={`absolute top-3 right-3 glass-strong px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20 transition-all duration-300 ${
          isHovered ? 'animate-float glow-cyan' : 'animate-float-slow'
        }`}>
          {listing.category}
        </div>
        
        {/* Trending indicator with enhanced effects */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 glass-strong px-2 py-1 rounded-full transition-all duration-300 ${
          isHovered ? 'glow-success scale-110' : ''
        }`}>
          <TrendingUp className="h-3 w-3 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">Hot</span>
        </div>

        {/* Overlay effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      <CardHeader className="pb-3">
        <h3 className={`font-bold text-lg line-clamp-2 transition-all duration-300 ${
          isHovered ? 'gradient-text-vibrant' : ''
        }`}>
          {listing.title}
        </h3>
        <p className="text-sm text-foreground/60 line-clamp-2">{listing.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Enhanced Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-all duration-300 ${
                  i < Math.floor(listing.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                } ${isHovered ? 'scale-110' : ''}`}
              />
            ))}
          </div>
          <span className={`text-sm font-semibold transition-all duration-300 ${
            isHovered ? 'text-warning' : ''
          }`}>{listing.rating}</span>
        </div>

        {/* Enhanced Seller */}
        <div className={`flex items-center gap-2 glass rounded-lg px-3 py-2 transition-all duration-300 ${
          isHovered ? 'bg-purple-500/10 border-purple-500/30 scale-105' : ''
        }`}>
          <span className="text-2xl transition-transform duration-300 hover:scale-125">{listing.seller.avatar}</span>
          <span className="text-sm font-medium text-foreground/80">{listing.seller.username}</span>
        </div>

        {/* Enhanced Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-foreground/60 mb-1">Price</p>
            <p className={`text-2xl font-bold transition-all duration-300 ${
              isHovered ? 'gradient-gold animate-neon-flicker' : 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
            }`}>
              {listing.price} SOL
            </p>
          </div>
          <Link href={`/marketplace/${listing.id}`}>
            <Button
              size="sm"
              className={`relative overflow-hidden transition-all duration-300 liquid-button ${
                isHovered 
                  ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 gap-2 shadow-lg glow-on-hover-enhanced transform hover:scale-105' 
                  : 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 gap-2 shadow-lg'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              View
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ${
                isHovered ? 'translate-x-[100%]' : 'translate-x-[-100%]'
              }`} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

