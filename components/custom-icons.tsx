"use client"

import React from "react"

// Custom SolMarket Icon Set with premium styling
export function SolMarketLogo({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Hexagonal shape representing blockchain */}
      <path
        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
        fill="url(#logoGradient)"
        filter="url(#logoGlow)"
        className="animate-pulse-glow"
      />
      
      {/* Inner hexagon */}
      <path
        d="M50 25 L70 37.5 L70 62.5 L50 75 L30 62.5 L30 37.5 Z"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Center dot */}
      <circle cx="50" cy="50" r="5" fill="#fff" opacity="0.9" />
      
      {/* Connecting lines */}
      <path
        d="M50 25 L50 75 M30 37.5 L70 62.5 M70 37.5 L30 62.5"
        stroke="#fff"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  )
}

export function SolanaIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0099ff" />
        </linearGradient>
      </defs>
      
      {/* Solana S symbol */}
      <path
        d="M25 30 L75 30 L75 35 L35 50 L75 65 L75 70 L25 70 L25 65 L65 50 L25 35 Z"
        fill="url(#solanaGradient)"
        className="animate-pulse"
      />
    </svg>
  )
}

export function SecurityIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Shield shape */}
      <path
        d="M50 10 L80 25 L80 55 Q80 85 50 90 Q20 85 20 55 L20 25 Z"
        fill="url(#securityGradient)"
        className="animate-pulse-glow"
      />
      
      {/* Lock icon */}
      <rect x="40" y="45" width="20" height="15" rx="2" fill="#fff" opacity="0.9" />
      <path
        d="M42 45 V40 Q42 35 50 35 Q58 35 58 40 V45"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="50" cy="52" r="2" fill="url(#securityGradient)" />
    </svg>
  )
}

export function TransactionIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="transactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      
      {/* Arrow flow */}
      <path
        d="M20 50 L40 50 M60 50 L80 50"
        stroke="url(#transactionGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        className="animate-data-flow"
      />
      
      {/* Circles */}
      <circle cx="20" cy="50" r="8" fill="url(#transactionGradient)" className="animate-pulse-glow" />
      <circle cx="50" cy="50" r="10" fill="url(#transactionGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
      <circle cx="80" cy="50" r="8" fill="url(#transactionGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
      
      {/* Arrow heads */}
      <path d="M36 45 L40 50 L36 55" stroke="url(#transactionGradient)" strokeWidth="2" fill="none" />
      <path d="M64 45 L60 50 L64 55" stroke="url(#transactionGradient)" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function MarketplaceIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      
      {/* Storefront */}
      <rect x="20" y="40" width="60" height="40" rx="2" fill="url(#marketGradient)" />
      <path d="M15 40 L50 20 L85 40" stroke="url(#marketGradient)" strokeWidth="3" fill="none" />
      
      {/* Windows */}
      <rect x="30" y="50" width="15" height="15" fill="#fff" opacity="0.8" />
      <rect x="55" y="50" width="15" height="15" fill="#fff" opacity="0.8" />
      
      {/* Door */}
      <rect x="45" y="60" width="10" height="20" fill="#fff" opacity="0.9" />
      
      {/* Shopping bag icon */}
      <path d="M65 35 Q65 30 70 30 Q75 30 75 35 L75 45 L65 45 Z" fill="url(#marketGradient)" className="animate-float" />
    </svg>
  )
}

export function WalletIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      
      {/* Wallet body */}
      <rect x="15" y="30" width="70" height="50" rx="8" fill="url(#walletGradient)" />
      
      {/* Wallet flap */}
      <path d="M15 30 Q50 20 85 30 L85 40 Q50 35 15 40 Z" fill="url(#walletGradient)" opacity="0.8" />
      
      {/* Card slots */}
      <rect x="25" y="45" width="40" height="3" rx="1" fill="#fff" opacity="0.6" />
      <rect x="25" y="52" width="40" height="3" rx="1" fill="#fff" opacity="0.6" />
      <rect x="25" y="59" width="40" height="3" rx="1" fill="#fff" opacity="0.6" />
      
      {/* Lock indicator */}
      <circle cx="75" cy="65" r="4" fill="#fff" opacity="0.9" className="animate-pulse-glow" />
    </svg>
  )
}

export function NetworkIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="33%" stopColor="#ec4899" />
          <stop offset="66%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      
      {/* Network connections */}
      <path d="M50 20 L30 40 L70 40 Z" stroke="url(#networkGradient)" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M30 40 L30 70 L70 70 L70 40" stroke="url(#networkGradient)" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M30 70 L50 80 L70 70" stroke="url(#networkGradient)" strokeWidth="2" fill="none" opacity="0.6" />
      
      {/* Network nodes */}
      <circle cx="50" cy="20" r="6" fill="url(#networkGradient)" className="animate-pulse-glow" />
      <circle cx="30" cy="40" r="5" fill="url(#networkGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
      <circle cx="70" cy="40" r="5" fill="url(#networkGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
      <circle cx="30" cy="70" r="5" fill="url(#networkGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.6s" }} />
      <circle cx="70" cy="70" r="5" fill="url(#networkGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.8s" }} />
      <circle cx="50" cy="80" r="6" fill="url(#networkGradient)" className="animate-pulse-glow" style={{ animationDelay: "1s" }} />
    </svg>
  )
}

export function LoadingSpinner({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      
      <circle
        cx="50"
        cy="50"
        r="20"
        stroke="url(#spinnerGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        className="animate-spin"
      />
    </svg>
  )
}

export function CheckIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      <path
        d="M25 50 L40 65 L75 30"
        stroke="url(#checkGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-elastic-scale"
      />
    </svg>
  )
}

export function ErrorIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="30" fill="url(#errorGradient)" opacity="0.2" />
      <path
        d="M35 35 L65 65 M65 35 L35 65"
        stroke="url(#errorGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        className="animate-pulse-glow"
      />
    </svg>
  )
}
