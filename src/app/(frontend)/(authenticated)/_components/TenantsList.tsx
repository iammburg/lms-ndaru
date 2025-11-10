import { getUser } from '../_actions/getUser'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TenantActions from './TenantActions'

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800'
        case 'inactive':
            return 'bg-gray-100 text-gray-800'
        case 'suspended':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

async function getMyTenants() {
    const user = await getUser()

    if (!user) {
        return []
    }

    const payload = await getPayload({ config })

    try {
        const result = await payload.find({
            collection: 'tenants',
            where: {
                createdBy: { equals: user.id }
            },
            sort: '-createdAt',
        })

        return result.docs
    } catch (error) {
        console.error('Error fetching user tenants:', error)
        return []
    }
}

export default async function MyTenantsList() {
    const tenants = await getMyTenants()

    if (tenants.length === 0) {
        return (
            <Card className="w-full max-h-3/6 overflow-auto">
                <CardHeader>
                    <CardTitle>List Tenant</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Kamu belum membuat tenant apa pun. Buat tenant pertamamu untuk memulai!
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-h-3/6 overflow-auto">
            <CardHeader>
                <CardTitle>Tenant Kamu ({tenants.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            className="p-4 border rounded-lg hover:bg-secondary"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium text-sm">{tenant.name}</h3>
                                        <Badge
                                            variant="secondary"
                                            className={getStatusColor(tenant.status)}
                                        >
                                            {tenant.status}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-muted-foreground mb-2">
                                        <strong>Subdomain:</strong> {tenant.slug}.bibubelajar.com
                                    </p>

                                    {tenant.description && (
                                        <p className="text-xs text-muted-foreground mb-2">
                                            {tenant.description}
                                        </p>
                                    )}

                                    <p className="text-xs text-muted-foreground">
                                        Dibuat: {new Date(tenant.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <TenantActions tenantSlug={tenant.slug} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
