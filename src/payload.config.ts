import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { tr } from '@payloadcms/translations/languages/tr'

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
import { ParentModules } from './collections/Modules/ParentModule'
import { LessonsRequests } from './collections/Lessons/LessonsRequests'
import { Teams } from './collections/Teams/Teams'
import { DrillCategories } from './collections/Drills/DrillCategories'
import { seedData } from './actions/server/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  folders: {
    slug: 'folders',
  },
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
    ParentModules,
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
  ],
})
