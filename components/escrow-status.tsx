"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EscrowStatusProps {
  status: "active" | "released" | "refunded" | "disputed"
  amount: number
  daysRemaining?: number
  onRelease?: () => void
  onRefund?: () => void
  onDispute?: () => void
}

export default function EscrowStatus({
  status,
  amount,
  daysRemaining,
  onRelease,
  onRefund,
  onDispute,
}: EscrowStatusProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === "active" && (
            <>
              <Clock className="h-5 w-5 text-yellow-400" />
              Escrow Active
            </>
          )}
          {status === "released" && (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Released
            </>
          )}
          {status === "disputed" && (
            <>
              <AlertCircle className="h-5 w-5 text-red-400" />
              Disputed
            </>
          )}
          {status === "refunded" && (
            <>
              <RotateCcw className="h-5 w-5 text-blue-400" />
              Refunded
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-foreground/60 mb-1">Amount in Escrow</p>
          <p className="text-2xl font-bold text-cyan-400">{amount} SOL</p>
        </div>

        {status === "active" && daysRemaining && (
          <div>
            <p className="text-sm text-foreground/60 mb-1">Dispute Window</p>
            <p className="font-medium">{daysRemaining} days remaining</p>
            <p className="text-xs text-foreground/60 mt-1">Confirm receipt or initiate dispute within this period</p>
          </div>
        )}

        {status === "active" && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onRelease}
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30"
            >
              Confirm Receipt
            </Button>
            <Button onClick={onDispute} variant="outline" className="flex-1 bg-transparent">
              Dispute
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
