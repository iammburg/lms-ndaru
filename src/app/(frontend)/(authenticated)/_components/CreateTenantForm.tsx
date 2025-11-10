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
    const [adminPanelUrl, setAdminPanelUrl] = useState<string | null>(null)
    const [adminCredentials, setAdminCredentials] = useState<{ email: string, password: string } | null>(null)
    // const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const data = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                contactEmail: formData.get('contactEmail') as string,
                adminEmail: formData.get('adminEmail') as string,
                adminPassword: formData.get('adminPassword') as string,
                adminName: formData.get('adminName') as string,
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
            setAdminPanelUrl(result.adminPanelUrl || null)

            if (result.adminUser) {
                setAdminCredentials({
                    email: result.adminUser.email,
                    password: result.adminUser.defaultPassword
                })
            }

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
                    <CardTitle className="text-green-600">🎉 Tenant Created Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your tenant has been created and is ready to use.
                    </p>
                    {tenantUrl && (
                        <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                            <p className="text-sm font-medium">Tenant URL:</p>
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
                    {adminPanelUrl && (
                        <div className="p-4 bg-purple-50 rounded-lg space-y-2">
                            <p className="text-sm font-medium">Admin Panel URL:</p>
                            <a
                                href={adminPanelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 underline text-sm break-all"
                            >
                                {adminPanelUrl}
                            </a>
                        </div>
                    )}
                    {adminCredentials && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
                            <p className="text-sm font-bold text-yellow-800">⚠️ Admin Credentials (Save this!)</p>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Email:</span> {adminCredentials.email}</p>
                                <p><span className="font-medium">Password:</span> {adminCredentials.password}</p>
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">
                                Please save these credentials securely. You can change the password after first login.
                            </p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setIsSuccess(false)
                                setTenantUrl(null)
                                setAdminPanelUrl(null)
                                setAdminCredentials(null)
                            }}
                            variant="outline"
                            className="flex-1"
                        >
                            Create Another
                        </Button>
                        {adminPanelUrl && (
                            <Button
                                onClick={() => window.open(adminPanelUrl, '_blank')}
                                className="flex-1"
                            >
                                Go to Admin Panel
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

                    <div className="border-t pt-4 space-y-4">
                        <h3 className="font-medium text-sm">Admin Account Settings</h3>

                        <div className="space-y-2">
                            <Label htmlFor="adminName">Admin Name</Label>
                            <Input
                                id="adminName"
                                name="adminName"
                                type="text"
                                placeholder="Admin Name"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave blank to auto-generate
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Admin Email</Label>
                            <Input
                                id="adminEmail"
                                name="adminEmail"
                                type="email"
                                placeholder="admin@mycompany.com"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave blank to use contact email
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminPassword">Admin Password</Label>
                            <Input
                                id="adminPassword"
                                name="adminPassword"
                                type="password"
                                placeholder="Secure password"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave blank to auto-generate secure password
                            </p>
                        </div>
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
