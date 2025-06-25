import {
  addFlowMapService,
  updateFlowMapService,
  getFlowMapsByUserIdService,
} from '../services/flowService';

// POST /flow-maps
export const addFlowMap = async (event: any) => {
  const body = JSON.parse(event.body);

  // Validate input
  if (!body.currentUserId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input. currentUserId is required.' }),
    };
  }

  const newFlowMap = await addFlowMapService(body);
  return {
    statusCode: 201,
    body: JSON.stringify(newFlowMap),
  };
};

// PUT /flow-maps/{id}
export const updateFlowMapById = async (event: any) => {
  const id = event.pathParameters?.id;
  const body = JSON.parse(event.body);

  // Validate input
  if (!id || !body.currentUserId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input. id and currentUserId are required.' }),
    };
  }

  const updatedFlowMap = await updateFlowMapService(id, body);
  return {
    statusCode: 200,
    body: JSON.stringify(updatedFlowMap),
  };
};

// GET /flow-maps/user/{userId}
export const getFlowMapsByUserId = async (event: any) => {
  const userId = event.pathParameters?.userId;

  // Validate input
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'userId is required.' }),
    };
  }

  const flowMaps = await getFlowMapsByUserIdService(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(flowMaps),
  };
};
