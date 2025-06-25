import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1️⃣ Create Permissions (with individual create to capture returned objects)
  const permissionForward = await prisma.permission.create({
    data: { code: 'FORWARD', name: 'Forward Application', category: 'Action' }
  })
  const permissionApprove = await prisma.permission.create({
    data: { code: 'APPROVE', name: 'Approve Application', category: 'Action' }
  })
  const permissionReview = await prisma.permission.create({
    data: { code: 'REVIEW', name: 'Review Application', category: 'Action' }
  })

  // 2️⃣ Create Roles and attach permissions
  const zsRole = await prisma.role.create({
    data: {
      code: 'ZS',
      name: 'Zonal Supervisor',
      rolePermissions: {
        create: [
          { permissionId: permissionForward.id },
          { permissionId: permissionApprove.id },
          { permissionId: permissionReview.id }
        ]
      }
    }
  })

  const acpRole = await prisma.role.create({
    data: {
      code: 'ACP',
      name: 'Assistant Commissioner of Police',
      rolePermissions: {
        create: [
          { permissionId: permissionForward.id },
          { permissionId: permissionApprove.id }
        ]
      }
    }
  })

  // 3️⃣ Create Users
  const userA = await prisma.user.create({
    data: {
      username: 'userA',
      officeName: 'Office A',
      email: 'userA@example.com',
      phoneNo: '1111111111',
      password: 'hashed-password-a',
      roleId: zsRole.id
    }
  })

  const userB = await prisma.user.create({
    data: {
      username: 'userB',
      officeName: 'Office B',
      email: 'userB@example.com',
      phoneNo: '2222222222',
      password: 'hashed-password-b',
      roleId: acpRole.id
    }
  })

  const userC = await prisma.user.create({
    data: {
      username: 'userC',
      officeName: 'Office C',
      email: 'userC@example.com',
      phoneNo: '3333333333',
      password: 'hashed-password-c',
      roleId: acpRole.id
    }
  })

  // 4️⃣ Create FlowMap for userA → can forward to userB and userC
  const flow = await prisma.flowMap.create({
    data: {
      currentUserId: userA.id,
      nextUsers: {
        create: [
          { nextUserId: userB.id },
          { nextUserId: userC.id }
        ]
      }
    }
  })

  // 5️⃣ Create ActionHistory (userA forwarded to userB)
  await prisma.actionHistory.create({
    data: {
      flowMapId: flow.id,
      fromUserId: userA.id,
      toUserId: userB.id,
      actionTaken: 'FORWARD'
    }
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
