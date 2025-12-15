"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useEscrow } from "@/hooks/use-escrow"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"

export function CreateListingModal() {
    const [open, setOpen] = useState(false)
    const [price, setPrice] = useState("")
    const [orderId, setOrderId] = useState("")
    const [merchant, setMerchant] = useState("")
    const { createEscrow } = useEscrow()
    const { connected } = useWallet()

    const handleCreate = async () => {
        if (!price || !orderId || !merchant) {
            toast.error("Please fill in all fields")
            return
        }

        // Default expiry 1 day for now
        const expiresAt = Math.floor(Date.now() / 1000) + 86400

        try {
            await createEscrow.mutateAsync({
                orderId,
                amount: parseFloat(price),
                expiresAt,
                merchant
            })
            setOpen(false)
        } catch (e) {
            // Error handled in hook
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                    <Plus className="h-4 w-4" />
                    Create Listing
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Listing</DialogTitle>
                    <DialogDescription>
                        Set up an escrow for your item. This will lock your SOL.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="orderId" className="text-right">
                            Order ID
                        </Label>
                        <Input
                            id="orderId"
                            placeholder="12345"
                            className="col-span-3"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="merchant" className="text-right">
                            Merchant
                        </Label>
                        <Input
                            id="merchant"
                            placeholder="Address"
                            className="col-span-3"
                            value={merchant}
                            onChange={(e) => setMerchant(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (SOL)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0.5"
                            className="col-span-3"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {!connected ? (
                        <Button disabled>Connect Wallet first</Button>
                    ) : (
                        <Button onClick={handleCreate} disabled={createEscrow.isPending}>
                            {createEscrow.isPending ? "Creating..." : "Create Escrow"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
