"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWalletModal } from "@/components/solana/custom-wallet-modal-provider"
import { useSolanaWallet } from "@/components/solana/use-wallet"
import FloatingShapes from "@/components/floating-shapes"
import AnimatedBackground from "@/components/animated-background"
import { BlockchainNetworkSVG, IsometricCubeSVG, DataFlowSVG, HolographicCardSVG, OrbitingElementsSVG } from "@/components/svg-illustrations"

export default function HeroSection() {
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const sol = useSolanaWallet()

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated gradient mesh background */}
      <AnimatedBackground variant="mesh" intensity="medium" />

      {/* Floating 3D shapes */}
      <FloatingShapes count={10} colors={["purple", "cyan", "pink"]} />

      {/* Enhanced SVG illustrations with premium animations */}
      <div className="absolute top-20 right-0 w-1/2 h-1/2 opacity-10 pointer-events-none">
        <BlockchainNetworkSVG className="w-full h-full" />
      </div>

      <div className="absolute bottom-20 left-0 w-1/3 h-1/3 opacity-8 pointer-events-none">
        <IsometricCubeSVG className="w-full h-full" />
      </div>

      <div className="absolute top-1/2 left-10 w-1/4 h-1/4 opacity-6 pointer-events-none">
        <OrbitingElementsSVG className="w-full h-full" />
      </div>

      <div className="absolute top-1/3 right-20 w-1/5 h-1/5 opacity-8 pointer-events-none">
        <HolographicCardSVG className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Badge with enhanced glow and magnetic effect */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full glass border-2 border-cyan-500/30 px-6 py-3 glow-cyan animate-fade-in-scale magnetic-element cursor-magnet">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse-glow" />
          <span className="text-sm font-medium text-cyan-300 glitch-text" data-text="Secured by Solana Blockchain">Secured by Solana Blockchain</span>
        </div>

        {/* Main heading with vibrant gradient and glitch effect */}
        <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold gradient-text-vibrant text-balance animate-fade-in-up will-change-transform glitch-text" data-text="Decentralized Marketplace">
          Decentralized
          <br />
          Marketplace
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-12 max-w-2xl text-lg md:text-xl text-foreground/80 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Buy and sell merchandise securely using MKN tokens. Every transaction protected by smart contract escrow
          for complete peace of mind.
        </p>

        {/* CTA Buttons with enhanced styling and liquid morphing */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white border-0 h-14 px-10 text-base font-semibold shadow-lg glow-on-hover-enhanced transform transition-all hover:scale-105 will-change-transform liquid-button magnetic-element cursor-magnet-strong">
                <span className="relative z-10 flex items-center gap-2">
                  {sol.connected && sol.label ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse-glow" />
                      {sol.label}
                    </>
                  ) : (
                    "Connect to Start"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56 glass-strong border-border/50">
              <DropdownMenuItem onClick={() => signIn("google")} className="magnetic-element cursor-magnet">Sign in with Google</DropdownMenuItem>
              <DropdownMenuSeparator />
              {sol.connected ? (
                <DropdownMenuItem onClick={() => sol.disconnect()} className="magnetic-element cursor-magnet">Disconnect Solana Wallet</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setVisible(true)} className="magnetic-element cursor-magnet">Connect Solana Wallet</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => router.push("/marketplace")}
            variant="outline"
            className="glass border-2 border-cyan-500/50 hover:border-cyan-400 h-14 px-10 text-base font-semibold hover:bg-cyan-500/10 transition-all hover:scale-105 will-change-transform group liquid-button magnetic-element cursor-magnet-strong glow-on-hover-enhanced"
          >
            Explore Marketplace
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Stats Section with 3D cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl perspective-1000">
          <div className="glass-tint-purple rounded-2xl p-8 card-3d glow-on-hover will-change-transform animate-fade-in-scale" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 glow-purple">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="text-4xl font-bold mb-2 gradient-text-vibrant">120M MKN</div>
            <div className="text-sm text-foreground/70 font-medium">Total Trading Volume</div>
          </div>

          <div className="glass-tint-purple rounded-2xl p-8 card-3d glow-on-hover will-change-transform animate-fade-in-scale" style={{ animationDelay: "0.8s" }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/20 glow-cyan">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            <div className="text-4xl font-bold mb-2 gradient-text-vibrant">12,450</div>
            <div className="text-sm text-foreground/70 font-medium">Active Community Members</div>
          </div>

          <div className="glass-tint-purple rounded-2xl p-8 card-3d glow-on-hover will-change-transform animate-fade-in-scale" style={{ animationDelay: "1s" }}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 glow-pink">
                <Shield className="h-8 w-8 text-pink-400" />
              </div>
            </div>
            <div className="text-4xl font-bold mb-2 gradient-text-vibrant">45.2K</div>
            <div className="text-sm text-foreground/70 font-medium">Secure Transactions</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium">Instant Settlement</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-pink-400" />
            <span className="text-sm font-medium">Trusted Community</span>
          </div>
        </div>
      </div>
    </div>
  )
}

