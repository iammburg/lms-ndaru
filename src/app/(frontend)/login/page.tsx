import React, { ReactElement } from 'react'
import LoginForm from './_components/LoginForm'
import { getTenantContext } from '@/lib/tenant'

export default async function page(): Promise<ReactElement> {
  const { tenant } = await getTenantContext()

  return (
    <div className="min-h-screen flex flex-col">
      {tenant && (
        <div className="w-full bg-cyan-500 sticky top-0 z-50 text-white py-3 px-4 text-center">
          <p className="text-sm font-medium">
            Selamat datang di <span className="font-bold">{tenant.name}</span>
          </p>
        </div>
      )}
      <div className="flex-1">
        <LoginForm tenantId={tenant?.id} tenantName={tenant?.name} />
      </div>
    </div>
  )
}
