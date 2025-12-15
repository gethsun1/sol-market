"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Copy } from "lucide-react"

interface ProfileCardProps {
  user: {
    id: string
    username: string
    email: string
    wallet_address: string
    bio?: string
    profile_image_url?: string
  }
  onEdit?: () => void
}

export default function ProfileCard({ user, onEdit }: ProfileCardProps) {
  const [copied, setCopied] = useState(false)

  const copyWallet = () => {
    navigator.clipboard.writeText(user.wallet_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-2xl">{user.username}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2 bg-transparent">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio && (
          <div>
            <p className="text-sm text-foreground/60 mb-2">About</p>
            <p className="text-foreground">{user.bio}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-foreground/60 mb-2">Wallet Address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-input px-3 py-2 rounded font-mono text-sm text-cyan-400 truncate">
              {user.wallet_address}
            </code>
            <button onClick={copyWallet} className="p-2 hover:bg-white/10 rounded transition-colors">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-green-400 mt-1">Copied!</p>}
        </div>
      </CardContent>
    </Card>
  )
}
