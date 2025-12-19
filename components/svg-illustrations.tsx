export function BlockchainNetworkSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Dark mode gradient */}
                <linearGradient id="nodeGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9">
                        <animate attributeName="stop-color" values="#a855f7;#06b6d4;#ec4899;#a855f7" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.7">
                        <animate attributeName="stop-color" values="#ec4899;#a855f7;#06b6d4;#ec4899" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9">
                        <animate attributeName="stop-color" values="#06b6d4;#ec4899;#a855f7;#06b6d4" dur="4s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
                
                {/* Light mode gradient - darker colors */}
                <linearGradient id="nodeGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.95">
                        <animate attributeName="stop-color" values="#7c3aed;#0891b2;#db2777;#7c3aed" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#db2777" stopOpacity="0.85">
                        <animate attributeName="stop-color" values="#db2777;#7c3aed;#0891b2;#db2777" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.95">
                        <animate attributeName="stop-color" values="#0891b2;#db2777;#7c3aed;#0891b2" dur="4s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
                
                <radialGradient id="coreGradient">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="50%" stopColor="#d97706" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.8" />
                </radialGradient>
                
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                
                <filter id="strongGlow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Animated background mesh */}
            <g className="dark:opacity-10 opacity-20">
                <circle cx="400" cy="300" r="250" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse" />
                <circle cx="400" cy="300" r="200" fill="none" className="dark:stroke-[url(#nodeGradientDark)] stroke-[url(#nodeGradientLight)] animate-pulse" strokeWidth="1" style={{ animationDelay: "0.5s" }} />
                <circle cx="400" cy="300" r="150" fill="none" className="dark:stroke-[url(#nodeGradientDark)] stroke-[url(#nodeGradientLight)] animate-pulse" strokeWidth="1" style={{ animationDelay: "1s" }} />
            </g>

            {/* Enhanced Connection Lines with data flow */}
            <g className="dark:opacity-60 opacity-80 dark:stroke-[url(#nodeGradientDark)] stroke-[url(#nodeGradientLight)]" strokeWidth="2" fill="none">
                <path d="M150 100 Q225 125 300 150" className="animate-pulse" />
                <circle r="3" className="dark:fill-[#06b6d4] fill-[#0891b2]">
                    <animateMotion dur="3s" repeatCount="indefinite">
                        <mpath href="#flow1" />
                    </animateMotion>
                </circle>
                <path id="flow1" d="M150 100 Q225 125 300 150" fill="none" />
                
                <path d="M300 150 Q375 125 450 100" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
                <circle r="3" className="dark:fill-[#ec4899] fill-[#db2777]">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s">
                        <mpath href="#flow2" />
                    </animateMotion>
                </circle>
                <path id="flow2" d="M300 150 Q375 125 450 100" fill="none" />
                
                <path d="M450 100 Q550 150 650 200" className="animate-pulse" style={{ animationDelay: "1s" }} />
                <circle r="3" className="dark:fill-[#a855f7] fill-[#7c3aed]">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
                        <mpath href="#flow3" />
                    </animateMotion>
                </circle>
                <path id="flow3" d="M450 100 Q550 150 650 200" fill="none" />
                
                <path d="M150 100 Q175 200 200 300" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
                <path d="M200 300 Q300 325 400 350" className="animate-pulse" style={{ animationDelay: "0.7s" }} />
                <path d="M400 350 Q500 375 600 400" className="animate-pulse" style={{ animationDelay: "1.2s" }} />
                <path d="M300 150 Q350 250 400 350" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
                <path d="M450 100 Q525 250 600 400" className="animate-pulse" style={{ animationDelay: "0.9s" }} />
            </g>

            {/* Enhanced Nodes with pulsing cores */}
            <g filter="url(#strongGlow)">
                {/* Core node - larger and more prominent */}
                <circle cx="400" cy="350" r="30" fill="url(#coreGradient)" className="animate-pulse-glow" />
                <circle cx="400" cy="350" r="20" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse" />
                
                {/* Satellite nodes */}
                <circle cx="150" cy="100" r="20" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse-glow" />
                <circle cx="300" cy="150" r="25" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
                <circle cx="450" cy="100" r="20" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse-glow" style={{ animationDelay: "1s" }} />
                <circle cx="650" cy="200" r="22" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
                <circle cx="200" cy="300" r="18" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse-glow" style={{ animationDelay: "0.7s" }} />
                <circle cx="600" cy="400" r="20" className="dark:fill-[url(#nodeGradientDark)] fill-[url(#nodeGradientLight)] animate-pulse-glow" style={{ animationDelay: "0.9s" }} />
            </g>

            {/* Orbital rings around core */}
            <g transform="translate(400, 350)" className="dark:opacity-30 opacity-50">
                <ellipse rx="80" ry="40" fill="none" className="dark:stroke-[url(#nodeGradientDark)] stroke-[url(#nodeGradientLight)] animate-rotate-3d" strokeWidth="1" />
                <ellipse rx="80" ry="40" fill="none" className="dark:stroke-[url(#nodeGradientDark)] stroke-[url(#nodeGradientLight)] animate-rotate-3d" strokeWidth="1" transform="rotate(60)" />
                <ellipse rx="80" ry="40" fill="none" className="dark:stroke-[url(#nodeGradientDark)] stroke-[url(#nodeGradientLight)] animate-rotate-3d" strokeWidth="1" transform="rotate(120)" />
            </g>

            {/* Hexagonal Pattern Overlay with animation */}
            <g className="dark:opacity-15 opacity-30 dark:stroke-[#a855f7] stroke-[#7c3aed]" strokeWidth="1" fill="none">
                <polygon points="100,50 130,35 160,50 160,80 130,95 100,80" className="animate-pulse" />
                <polygon points="250,120 280,105 310,120 310,150 280,165 250,150" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
                <polygon points="500,80 530,65 560,80 560,110 530,125 500,110" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
                <polygon points="180,280 210,265 240,280 240,310 210,325 180,310" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
                <polygon points="420,330 450,315 480,330 480,360 450,375 420,360" className="animate-pulse" style={{ animationDelay: "0.8s" }} />
            </g>
        </svg>
    )
}

export function SecurityShieldSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="shieldGlow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Shield Shape */}
            <path
                d="M200 50 L320 100 L320 200 Q320 300 200 350 Q80 300 80 200 L80 100 Z"
                fill="url(#shieldGradient)"
                opacity="0.2"
                filter="url(#shieldGlow)"
            />
            <path
                d="M200 50 L320 100 L320 200 Q320 300 200 350 Q80 300 80 200 L80 100 Z"
                stroke="url(#shieldGradient)"
                strokeWidth="3"
                fill="none"
                className="animate-pulse-glow"
            />

            {/* Lock Icon */}
            <g transform="translate(170, 160)">
                <rect x="10" y="30" width="40" height="50" rx="5" fill="url(#shieldGradient)" opacity="0.6" />
                <path
                    d="M15 30 V20 Q15 10 30 10 Q45 10 45 20 V30"
                    stroke="url(#shieldGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                <circle cx="30" cy="55" r="5" fill="#fff" opacity="0.8" />
            </g>

            {/* Hexagonal Pattern */}
            <g opacity="0.15" stroke="url(#shieldGradient)" strokeWidth="1" fill="none">
                <polygon points="200,80 220,70 240,80 240,100 220,110 200,100" />
                <polygon points="160,120 180,110 200,120 200,140 180,150 160,140" />
                <polygon points="240,120 260,110 280,120 280,140 260,150 240,140" />
            </g>
        </svg>
    )
}

export function ShoppingCartSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>

            {/* Cart Body */}
            <path
                d="M100 100 L120 100 L150 250 L320 250 L350 150 L140 150"
                stroke="url(#cartGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
            />

            {/* Wheels */}
            <circle cx="180" cy="280" r="15" fill="url(#cartGradient)" className="animate-pulse" />
            <circle cx="290" cy="280" r="15" fill="url(#cartGradient)" className="animate-pulse" style={{ animationDelay: "0.2s" }} />

            {/* Particles */}
            <circle cx="250" cy="120" r="3" fill="#a855f7" className="animate-float" opacity="0.6" />
            <circle cx="280" cy="140" r="2" fill="#06b6d4" className="animate-float" opacity="0.6" style={{ animationDelay: "0.5s" }} />
            <circle cx="220" cy="160" r="2.5" fill="#ec4899" className="animate-float" opacity="0.6" style={{ animationDelay: "1s" }} />
        </svg>
    )
}

export function IsometricCubeSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="cubeTopDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="cubeTopLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="cubeLeftDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="cubeLeftLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#db2777" stopOpacity="0.75" />
                </linearGradient>
                <linearGradient id="cubeRightDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="cubeRightLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.9" />
                </linearGradient>
                <filter id="cubeGlow">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g transform="translate(200, 200)" filter="url(#cubeGlow)">
                {/* Cube faces */}
                <path d="M0,-50 L50,-25 L50,25 L0,50 Z" className="dark:fill-[url(#cubeLeftDark)] fill-[url(#cubeLeftLight)] animate-pulse" />
                <path d="M0,-50 L-50,-25 L-50,25 L0,50 Z" className="dark:fill-[url(#cubeRightDark)] fill-[url(#cubeRightLight)] animate-pulse" style={{ animationDelay: "0.2s" }} />
                <path d="M0,-50 L50,-25 L0,0 L-50,-25 Z" className="dark:fill-[url(#cubeTopDark)] fill-[url(#cubeTopLight)] animate-pulse" style={{ animationDelay: "0.4s" }} />
                
                {/* Inner structure */}
                <path d="M0,-30 L30,-15 L30,15 L0,30 Z" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
                <path d="M0,-30 L-30,-15 L-30,15 L0,30 Z" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
                <path d="M0,-30 L30,-15 L0,0 L-30,-15 Z" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
            </g>
            
            {/* Floating particles */}
            <circle cx="100" cy="100" r="2" className="dark:fill-[#a855f7] fill-[#7c3aed] dark:opacity-60 opacity-80 animate-float" />
            <circle cx="300" cy="120" r="3" className="dark:fill-[#06b6d4] fill-[#0891b2] dark:opacity-60 opacity-80 animate-float" style={{ animationDelay: "0.5s" }} />
            <circle cx="320" cy="280" r="2.5" className="dark:fill-[#ec4899] fill-[#db2777] dark:opacity-60 opacity-80 animate-float" style={{ animationDelay: "1s" }} />
        </svg>
    )
}

export function DataFlowSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 600 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="flowGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="33%" stopColor="#ec4899" stopOpacity="0.8" />
                    <stop offset="66%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="flowGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.95" />
                    <stop offset="33%" stopColor="#db2777" stopOpacity="0.95" />
                    <stop offset="66%" stopColor="#0891b2" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.95" />
                </linearGradient>
                <filter id="flowGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Main flow line */}
            <path
                d="M50 150 L550 150"
                className="dark:stroke-[url(#flowGradientDark)] stroke-[url(#flowGradientLight)] animate-pulse"
                strokeWidth="4"
                filter="url(#flowGlow)"
            />

            {/* Data packets */}
            <g>
                <circle r="8" className="dark:fill-[#a855f7] fill-[#7c3aed]" filter="url(#flowGlow)">
                    <animateMotion dur="3s" repeatCount="indefinite">
                        <mpath href="#mainFlow" />
                    </animateMotion>
                </circle>
                <circle r="6" className="dark:fill-[#ec4899] fill-[#db2777]" filter="url(#flowGlow)">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
                        <mpath href="#mainFlow" />
                    </animateMotion>
                </circle>
                <circle r="7" className="dark:fill-[#06b6d4] fill-[#0891b2]" filter="url(#flowGlow)">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="2s">
                        <mpath href="#mainFlow" />
                    </animateMotion>
                </circle>
            </g>
            
            <path id="mainFlow" d="M50 150 L550 150" fill="none" />

            {/* Branching paths */}
            <g className="dark:opacity-60 opacity-80">
                <path d="M150 150 Q200 100 250 120" className="dark:stroke-[#a855f7] stroke-[#7c3aed] animate-pulse" strokeWidth="2" fill="none" />
                <path d="M300 150 Q350 200 400 180" className="dark:stroke-[#ec4899] stroke-[#db2777] animate-pulse" strokeWidth="2" fill="none" style={{ animationDelay: "0.5s" }} />
                <path d="M450 150 Q500 100 550 120" className="dark:stroke-[#06b6d4] stroke-[#0891b2] animate-pulse" strokeWidth="2" fill="none" style={{ animationDelay: "1s" }} />
            </g>

            {/* Nodes */}
            <g filter="url(#flowGlow)">
                <circle cx="50" cy="150" r="12" className="dark:fill-[url(#flowGradientDark)] fill-[url(#flowGradientLight)] animate-pulse-glow" />
                <circle cx="150" cy="150" r="8" className="dark:fill-[#a855f7] fill-[#7c3aed] animate-pulse" />
                <circle cx="250" cy="150" r="8" className="dark:fill-[#ec4899] fill-[#db2777] animate-pulse" style={{ animationDelay: "0.3s" }} />
                <circle cx="350" cy="150" r="8" className="dark:fill-[#06b6d4] fill-[#0891b2] animate-pulse" style={{ animationDelay: "0.6s" }} />
                <circle cx="450" cy="150" r="8" className="dark:fill-[#a855f7] fill-[#7c3aed] animate-pulse" style={{ animationDelay: "0.9s" }} />
                <circle cx="550" cy="150" r="12" className="dark:fill-[url(#flowGradientDark)] fill-[url(#flowGradientLight)] animate-pulse-glow" />
            </g>
        </svg>
    )
}

export function HolographicCardSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="holographicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8">
                        <animate attributeName="stop-color" values="#a855f7;#06b6d4;#ec4899;#a855f7" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6">
                        <animate attributeName="stop-color" values="#ec4899;#a855f7;#06b6d4;#ec4899" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8">
                        <animate attributeName="stop-color" values="#06b6d4;#ec4899;#a855f7;#06b6d4" dur="3s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
                <filter id="holographicGlow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Card base */}
            <rect x="50" y="50" width="300" height="150" rx="15" fill="url(#holographicGradient)" filter="url(#holographicGlow)" className="animate-holographic-shift" />
            
            {/* Card details */}
            <rect x="70" y="70" width="80" height="50" rx="5" fill="#fff" opacity="0.1" />
            <rect x="170" y="70" width="160" height="8" rx="4" fill="#fff" opacity="0.2" />
            <rect x="170" y="85" width="120" height="6" rx="3" fill="#fff" opacity="0.15" />
            <rect x="170" y="98" width="140" height="6" rx="3" fill="#fff" opacity="0.15" />
            
            {/* Chip */}
            <rect x="70" y="140" width="40" height="30" rx="5" fill="#fbbf24" opacity="0.8" className="animate-pulse" />
            
            {/* Holographic shimmer effect */}
            <rect x="50" y="50" width="300" height="150" rx="15" fill="url(#holographicGradient)" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
            </rect>
        </svg>
    )
}

export function OrbitingElementsSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <radialGradient id="centerCore">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                </radialGradient>
                <filter id="orbitGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g transform="translate(200, 200)">
                {/* Central core */}
                <circle r="25" fill="url(#centerCore)" filter="url(#orbitGlow)" className="animate-pulse-glow" />
                
                {/* Orbiting elements */}
                <g className="animate-rotate-3d">
                    <circle cx="0" cy="-80" r="8" fill="#a855f7" filter="url(#orbitGlow)" />
                    <circle cx="69" cy="-40" r="6" fill="#ec4899" filter="url(#orbitGlow)" />
                    <circle cx="69" cy="40" r="7" fill="#06b6d4" filter="url(#orbitGlow)" />
                    <circle cx="0" cy="80" r="5" fill="#a855f7" filter="url(#orbitGlow)" />
                    <circle cx="-69" cy="40" r="6" fill="#ec4899" filter="url(#orbitGlow)" />
                    <circle cx="-69" cy="-40" r="8" fill="#06b6d4" filter="url(#orbitGlow)" />
                </g>
                
                {/* Orbital paths */}
                <circle r="80" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.2" />
                <circle r="60" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.2" />
                <circle r="100" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.2" />
            </g>
        </svg>
    )
}

export function TransactionFlowSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 600 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>

            {/* Flow Path */}
            <path
                d="M50 200 L200 200 L250 150 L350 150 L400 200 L550 200"
                stroke="url(#flowGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10 5"
                className="animate-pulse"
            />

            {/* Nodes */}
            <circle cx="50" cy="200" r="20" fill="url(#flowGradient)" className="animate-pulse-glow" />
            <circle cx="250" cy="150" r="20" fill="url(#flowGradient)" className="animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
            <circle cx="550" cy="200" r="20" fill="url(#flowGradient)" className="animate-pulse-glow" style={{ animationDelay: "1s" }} />

            {/* Labels */}
            <text x="50" y="250" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="bold">Buyer</text>
            <text x="250" y="120" textAnchor="middle" fill="#ec4899" fontSize="14" fontWeight="bold">Escrow</text>
            <text x="550" y="250" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">Seller</text>
        </svg>
    )
}
