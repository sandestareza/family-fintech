"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function InviteCodeCard({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Kode Undangan Keluarga</CardTitle>
                <CardDescription>Bagikan kode ini kepada pasangan atau anggota keluarga untuk bergabung.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input 
                            value={code} 
                            readOnly 
                            className="font-mono text-lg tracking-widest text-center uppercase" 
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={onCopy}>
                        <span className="sr-only">Copy</span>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
