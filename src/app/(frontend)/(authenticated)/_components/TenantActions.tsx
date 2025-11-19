'use client'

import { Button } from '@/components/ui/button'

interface TenantActionsProps {
    tenantSlug: string
}

export default function TenantActions({ tenantSlug }: TenantActionsProps) {
    return (
        <div className="mt-3 flex gap-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://${tenantSlug}.bibubelajar.com`, '_blank')}
            >
                Kunjungi Tenant
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://${tenantSlug}.bibubelajar.com/admin`, '_blank')}
            >
                Admin Panel
            </Button>
        </div>
    )
}