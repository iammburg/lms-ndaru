import { Suspense } from 'react'
import CreateTenantForm from '../../_components/CreateTenantForm'
import MyTenantsList from '../../_components/TenantsList'
import { getTenantContext } from '@/lib/tenant'
import { redirect } from 'next/navigation'

export default async function CreateTenantPage() {
    const tenant = await getTenantContext()

    if (tenant.tenant) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col mx-auto w-full max-w-5xl p-3 sm:p-4 lg:p-6 gap-6">
            <div className="flex flex-col">
                <h1 className="text-lg lg:text-xl font-bold">Buat lingkungan LMS kamu sendiri</h1>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                    Buat dan kelola lingkungan LMS kamu sendiri dengan subdomain kustom. Ideal untuk organisasi, sekolah, atau perusahaan yang ingin memiliki platform pembelajaran bermerk sendiri.
                </p>
                <div className="mt-4 p-4 bg-secondary border rounded-lg">
                    <h3 className="text-base lg:text-lg font-semibold mb-2">Apa yang terjadi setelah membuat Tenant?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li>- Kamu akan mendapatkan subdomain sendiri (misalnya: faza-salto.bibubelajar.com)</li>
                        <li>- Akun admin Tenant akan dibuat secara otomatis buat kamu.</li>
                        <li>- Kamu bisa mengelola materi, pengguna, dan konten secara mandiri.</li>
                        <li>- Data kamu sepenuhnya terisolasi dari tenant atau penyewa lain.</li>
                        <li>- Kamu bisa menyesuaikan branding dan pengaturan untuk Tenant kamu. (comming soon)</li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <div>
                    <h2 className="text-base lg:text-lg font-semibold mb-4">Buat Tenant Baru</h2>
                    <CreateTenantForm />
                </div>

                <div>
                    <h2 className="text-base lg:text-lg font-semibold mb-4">Tenant Kamu</h2>
                    <Suspense
                        fallback={
                            <div className="p-4 text-center text-muted-foreground">Memuat tenant...</div>
                        }
                    >
                        <MyTenantsList />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
