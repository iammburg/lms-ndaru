import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import nodeMailerAdapter from './utils/nodeMailerAdapter'
import { Customers } from './collections/Customer'
import { Courses } from './collections/courses/Courses'
import { Participation } from './collections/courses/Participation'
import { Tenants } from './collections/Tenants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- BiBu Belajar LMS',
    },
  },
  email: nodeMailerAdapter(),
  collections: [Users, Media, Customers, Courses, Participation, Tenants],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      tenantsSlug: 'tenants',
      collections: {
        courses: {
          useBaseFilter: false,    // ✅ CHANGED: Manual filtering through access control
          customTenantField: true, // ✅ CHANGED: Manual tenant field management
        },
        participation: {
          useBaseFilter: false,    // ✅ CHANGED: Manual filtering through access control
          customTenantField: true, // ✅ CHANGED: Manual tenant field management
        },
        customers: {
          // Customers dapat exist tanpa tenant (main app) atau dengan tenant
          useBaseFilter: false,     // ❌ Tidak auto-filter - allow global customers
          customTenantField: true,  // ✅ Handle tenant field manual dengan required: false
        },
        media: {
          useBaseFilter: true,    // ✅ Terisolasi per tenant
          customTenantField: false, // ✅ Satu media = satu tenant
        },
      },
      userHasAccessToAllTenants: (user) => {
        // Super admin has access to all tenants
        return user?.collection === 'users' && user?.role === 'super-admin'
      },
      useTenantsCollectionAccess: false,
    }),
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET_NAME || '',
      config: {
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
