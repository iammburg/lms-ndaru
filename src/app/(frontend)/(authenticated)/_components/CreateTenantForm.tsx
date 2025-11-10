'use client'

import { useState } from 'react'
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

            if (!data.name || !data.slug) {
                throw new Error('Name and subdomain are required')
            }

            const slugPattern = /^[a-z0-9-]+$/
            if (!slugPattern.test(data.slug)) {
                throw new Error('Subdomain can only contain lowercase letters, numbers, and hyphens')
            }

            const result = await createTenant(data)
            setTenantUrl(result.subdomainUrl)
            setAdminPanelUrl(result.adminPanelUrl || null)

            setIsSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="text-green-600">Tenant berhasil dibuat!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Tenant kamu telah berhasil dibuat. Berikut detailnya:
                    </p>
                    {tenantUrl && (
                        <div>
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
                        <div>
                            <p className="text-sm font-medium">Admin Panel URL:</p>
                            <a
                                href={adminPanelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                            >
                                {adminPanelUrl}
                            </a>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setIsSuccess(false)
                                setTenantUrl(null)
                                setAdminPanelUrl(null)
                            }}
                            variant="outline"
                            className="flex-1"
                        >
                            Buat yang lain
                        </Button>
                        {adminPanelUrl && (
                            <Button
                                onClick={() => window.open(adminPanelUrl, '_blank')}
                                className="flex-1"
                            >
                                Pergi ke Admin Panel
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle>Buat Tenant Baru</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Buat lingkungan LMS kamu sendiri dengan custom subdomain
                </p>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Tenant *</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ndaru LMS"
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
                                placeholder="my-lms"
                                required
                                disabled={isSubmitting}
                                className="flex-1"
                                pattern="^[a-z0-9-]+$"
                                title="Hanya huruf kecil, angka, dan tanda hubung yang diperbolehkan."
                            />
                            <span className="text-sm text-muted-foreground">.bibubelajar.com</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ini akan menjadi URL subdomain kamu (misalnya: ndaru-salto.bibubelajar.com)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Deskripsi singkat tentang LMS kamu"
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Kontak</Label>
                        <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            placeholder="admin@mylms.com"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                            Kosongkan untuk menggunakan email-mu
                        </p>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <h3 className="font-medium text-sm">Pengaturan Akun Admin</h3>

                        <div className="space-y-2">
                            <Label htmlFor="adminName">Nama Admin</Label>
                            <Input
                                id="adminName"
                                name="adminName"
                                type="text"
                                placeholder="Nama Admin"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Kosongkan untuk generate secara otomatis
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Email Admin</Label>
                            <Input
                                id="adminEmail"
                                name="adminEmail"
                                type="email"
                                placeholder="admin@lms.com"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Kosongkan untuk menggunakan email contact kamu.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminPassword">Password Admin</Label>
                            <Input
                                id="adminPassword"
                                name="adminPassword"
                                type="password"
                                placeholder="Masukkan password yang aman"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Kosongkan untuk generate secara otomatis
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Membuat Tenant...' : 'Buat Tenant'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
