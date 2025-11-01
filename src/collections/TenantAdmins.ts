import type { CollectionConfig } from 'payload'

export const TenantAdmins: CollectionConfig = {
    slug: 'tenantAdmins',
    admin: {
        useAsTitle: 'email',
        group: 'User Management',
        description: 'Administrators for specific tenants',
    },
    auth: {
        // Custom login path for tenant admins
        loginWithUsername: false,
        maxLoginAttempts: 5,
        lockTime: 600 * 1000, // 10 minutes
    },
    access: {
        // Auto-create tenant admin, super admin can manually create
        create: () => true,
        read: ({ req }) => {
            // Super admin can read all
            if (req.user?.collection === 'users') return true
            // Tenant admin can only read their own record
            if (req.user?.collection === 'tenantAdmins') {
                return { id: { equals: req.user.id } }
            }
            return false
        },
        update: ({ req }) => {
            // Super admin can update all
            if (req.user?.collection === 'users') return true
            // Tenant admin can update limited fields of their own record
            if (req.user?.collection === 'tenantAdmins') {
                return { id: { equals: req.user.id } }
            }
            return false
        },
        delete: ({ req }) => req.user?.collection === 'users',
    },
    fields: [
        // tenant field will be automatically added by multi-tenant plugin
        {
            name: 'role',
            type: 'select',
            required: true,
            defaultValue: 'admin',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Manager', value: 'manager' },
            ],
            admin: {
                description: 'Role within the tenant',
            },
            access: {
                // Only super admin can change roles
                update: ({ req }) => req.user?.collection === 'users',
            }
        },
        {
            name: 'isActive',
            type: 'checkbox',
            required: true,
            defaultValue: true,
            admin: {
                description: 'Whether this admin account is active',
            },
            access: {
                // Only super admin can activate/deactivate
                update: ({ req }) => req.user?.collection === 'users',
            }
        },
        {
            name: 'permissions',
            type: 'group',
            label: 'Tenant Permissions',
            fields: [
                {
                    name: 'canManageUsers',
                    type: 'checkbox',
                    defaultValue: true,
                    label: 'Can manage customers',
                },
                {
                    name: 'canManageCourses',
                    type: 'checkbox',
                    defaultValue: true,
                    label: 'Can manage courses',
                },
                {
                    name: 'canViewAnalytics',
                    type: 'checkbox',
                    defaultValue: true,
                    label: 'Can view analytics',
                },
            ],
            access: {
                // Only super admin can change permissions
                update: ({ req }) => req.user?.collection === 'users',
            }
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, req, operation }) => {
                // Auto-assign tenant for self-service creation
                if (operation === 'create' && !data.tenant && req.user?.collection === 'customers') {
                    try {
                        const { detectTenantFromDomain } = await import('../lib/tenant')
                        const tenantId = await detectTenantFromDomain()
                        if (tenantId) {
                            data.tenant = tenantId
                        }
                    } catch (error) {
                        console.error('Error auto-assigning tenant to admin:', error)
                    }
                }
                return data
            }
        ]
    },
    timestamps: true,
}