import { prisma } from '../dbConfig/prisma';
import { FlowMap } from '@prisma/client';

// Add a new flow map
export const createFlowMap = async (data: {
  currentUserId: string;
}): Promise<FlowMap> => {
  return prisma.flowMap.create({
    data: {
      currentUserId: data.currentUserId,
    },
  });
};

// Update a flow map by ID
export const updateFlowMap = async (
  id: string,
  data: { currentUserId?: string }
): Promise<FlowMap> => {
  return prisma.flowMap.update({
    where: { id },
    data,
  });
};

// Get flow maps by user ID
export const getFlowMapsByUserId = async (
  userId: string
): Promise<FlowMap[]> => {
  return prisma.flowMap.findMany({
    where: { currentUserId: userId },
    include: {
      nextUsers: true,
      actions: true,
    },
  });
};
