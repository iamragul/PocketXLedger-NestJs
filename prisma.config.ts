import path from 'node:path';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma'),
  migrations: { 
    path: 'prisma/migrations',
  },
  // engine: 'classic',
  // datasource: { 
  //   url: env('DATABASE_URL'),
  // },
});