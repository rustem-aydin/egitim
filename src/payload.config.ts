import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { tr } from '@payloadcms/translations/languages/tr'
import { s3Storage } from '@payloadcms/storage-s3'
import { Users } from './collections/Users/Users'
import { Media } from './collections/Media'
import { Groups } from './collections/Groups/Groups'
import { Modules } from './collections/Modules/Modules'
import { Lessons } from './collections/Lessons/Lessons'
import { Feedbacks } from './collections/Lessons/Feedbacks'
import { Drills } from './collections/Drills/Drills'
import { Categories } from './collections/Lessons/Categories'
import { DrillGroups } from './collections/Drills/DrillGroups'
import { Locations } from './collections/Lessons/Locations'
import { Levels } from './collections/Lessons/Levels'
import { LessonsRequests } from './collections/Lessons/LessonsRequests'
import { Teams } from './collections/Teams/Teams'
import { DrillCategories } from './collections/Drills/DrillCategories'
import { seedData } from './actions/seed'
import { Expert } from './collections/Experts/Experts'
import { Filters } from './collections/Filters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  folders: {
    slug: 'folders',
  },
  // email: nodemailerAdapter({
  //   defaultFromAddress: 'info@payloadcms.com',
  //   defaultFromName: 'Payload',
  //   // Nodemailer transportOptions
  //   transportOptions: {
  //     host: process.env.SMTP_HOST,
  //     port: 587,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   },
  // }),
  onInit: async (payload) => {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.docs.length === 0) {
      console.log('🌱 Seeding initial data...')
      await seedData(payload)
    }
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },

    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'admin@admin.com',
            password: 'admin',
            prefillOnly: true,
          }
        : false,
  },

  collections: [
    Users,
    LessonsRequests,
    Media,
    Groups,
    Modules,
    Lessons,
    Teams,
    Feedbacks,
    Locations,
    Drills,
    Filters,
    Expert,
    Categories,
    Levels,
    DrillGroups,
    DrillCategories,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  i18n: {
    supportedLanguages: {
      tr,
    },
    fallbackLanguage: 'tr',
  },
  sharp,
  plugins: [
    mcpPlugin({
      collections: {
        users: {
          enabled: true,
        },
      },
    }),

    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})
