/**
 * seed-admin.mjs
 *
 * Creates the ADMIN user in the database.
 * Credentials: admin@aguiadiesel.com.br / admin@123
 *
 * Requires: DATABASE_URL env var
 * Run: node scripts/seed-admin.mjs
 */

import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@aguiadiesel.com.br';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Administrador';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding admin user...');

  const passwordHash = await argon2.hash(ADMIN_PASSWORD);

  // ── AuthUser (auth-service DB table) ────────────────────────────────────
  const existing = await prisma.authUser.findUnique({ where: { email: ADMIN_EMAIL } });

  let authUser;
  if (existing) {
    authUser = await prisma.authUser.update({
      where: { email: ADMIN_EMAIL },
      data: { role: 'ADMIN', status: 'ACTIVE', passwordHash },
    });
    console.log(`✓ AuthUser updated: ${authUser.email} (role=ADMIN)`);
  } else {
    authUser = await prisma.authUser.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash,
        status: 'ACTIVE',
        role: 'ADMIN',
      },
    });
    console.log(`✓ AuthUser created: ${authUser.email} (role=ADMIN)`);
  }

  // ── User (users-service DB table) ─────────────────────────────────────
  const existingUser = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: authUser.id,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
      },
    });
    console.log(`✓ User profile created: ${ADMIN_NAME}`);
  } else {
    console.log(`✓ User profile already exists: ${ADMIN_NAME}`);
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Admin user ready!');
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role    : ADMIN`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
