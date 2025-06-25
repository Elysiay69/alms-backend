import { createFlowMap, updateFlowMap, getFlowMapsByUserId } from '../repositories/flowRepository';

// Service to add a new flow map
export const addFlowMapService = async (data: { currentUserId: string }) => {
  return await createFlowMap(data);
};

// Service to update a flow map by ID
export const updateFlowMapService = async (
  id: string,
  data: { currentUserId?: string }
) => {
  return await updateFlowMap(id, data);
};

// Service to get flow maps by user ID
export const getFlowMapsByUserIdService = async (userId: string) => {
  return await getFlowMapsByUserId(userId);
};
