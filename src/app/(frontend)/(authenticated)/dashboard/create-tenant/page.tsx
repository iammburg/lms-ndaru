import { Suspense } from 'react'
import CreateTenantForm from '../../_components/CreateTenantForm'
import MyTenantsList from '../../_components/MyTenantsList'

export default function CreateTenantPage() {
    return (
        <div className="flex flex-col mx-auto w-full max-w-5xl p-3 sm:p-4 lg:p-6 gap-6">
            <div className="flex flex-col">
                <h1 className="text-lg lg:text-xl font-bold">Create Your Own Tenant</h1>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                    Create and manage your own LMS environment with a custom subdomain.
                    Perfect for organizations, schools, or companies that want their own branded learning platform.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-base lg:text-lg font-semibold mb-4">Create New Tenant</h2>
                    <CreateTenantForm />
                </div>

                <div>
                    <h2 className="text-base lg:text-lg font-semibold mb-4">Your Tenants</h2>
                    <Suspense
                        fallback={
                            <div className="p-4 text-center text-muted-foreground">Loading your tenants...</div>
                        }
                    >
                        <MyTenantsList />
                    </Suspense>
                </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-base lg:text-lg font-semibold mb-2">What happens after creating a tenant?</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• You&apos;ll get your own subdomain (e.g., yourcompany.bibubelajar.com)</li>
                    <li>• A tenant admin account will be automatically created for you</li>
                    <li>• You can manage courses, users, and content independently</li>
                    <li>• Your data is completely isolated from other tenants</li>
                    <li>• You can customize branding and settings for your tenant</li>
                </ul>
            </div>
        </div>
    )
}
