'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createTenant } from '../_actions/createTenant'

export default function CreateTenantForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [tenantUrl, setTenantUrl] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const data = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                contactEmail: formData.get('contactEmail') as string,
            }

            // Basic validation
            if (!data.name || !data.slug) {
                throw new Error('Name and subdomain are required')
            }

            // Validate slug format
            const slugPattern = /^[a-z0-9-]+$/
            if (!slugPattern.test(data.slug)) {
                throw new Error('Subdomain can only contain lowercase letters, numbers, and hyphens')
            }

            const result = await createTenant(data)
            setTenantUrl(result.subdomainUrl)
            setIsSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-green-600">Tenant Created Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your tenant has been created and is ready to use.
                    </p>
                    {tenantUrl && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium">Your tenant URL:</p>
                            <a
                                href={tenantUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                            >
                                {tenantUrl}
                            </a>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setIsSuccess(false)
                                setTenantUrl(null)
                            }}
                            variant="outline"
                            className="flex-1"
                        >
                            Create Another
                        </Button>
                        {tenantUrl && (
                            <Button
                                onClick={() => window.open(tenantUrl, '_blank')}
                                className="flex-1"
                            >
                                Visit Tenant
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create New Tenant</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Create your own LMS environment with a custom subdomain.
                </p>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tenant Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="My Company LMS"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Subdomain *</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="slug"
                                name="slug"
                                type="text"
                                placeholder="mycompany"
                                required
                                disabled={isSubmitting}
                                className="flex-1"
                                pattern="^[a-z0-9-]+$"
                                title="Only lowercase letters, numbers, and hyphens allowed"
                            />
                            <span className="text-sm text-muted-foreground">.bibubelajar.com</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This will be your subdomain URL (e.g., mycompany.bibubelajar.com)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Brief description of your organization..."
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            placeholder="admin@mycompany.com"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave blank to use your current email
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Creating Tenant...' : 'Create Tenant'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
