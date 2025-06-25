import {
  addRoleService,
  addPermissionService,
  updateRoleService,
  updatePermissionService,
  getRolesHierarchyService,
  getRoleActionsService,
} from '../services/roleService';

// GET /roles/actions
export const getRoleActions = async (event: any) => {
  const roleId = event.queryStringParameters?.roleId || event.pathParameters?.roleId;

  if (!roleId || isNaN(Number(roleId))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'roleId must be a valid number and is required.' }),
    };
  }

  const roleIdNumber = Number(roleId);
  const actions = await getRoleActionsService(roleIdNumber);

  if (!actions) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Role not found.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(actions),
  };
};

// GET /roles/hierarchy
export const getRoleHierarchy = async () => {
  const roles = await getRolesHierarchyService();
  return {
    statusCode: 200,
    body: JSON.stringify(roles),
  };
};

// POST /roles
export const addRole = async (event: any) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  if (!body.code || !body.name || typeof body.is_active !== 'boolean') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input. code, name, and is_active are required.' }),
    };
  }

  const newRole = await addRoleService(body);
  return {
    statusCode: 201,
    body: JSON.stringify(newRole),
  };
};

// POST /permissions
export const addPermission = async (event: any) => {
  const body = JSON.parse(event.body);

  if (!body.code || !body.name || !body.category) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input. code, name, and category are required.' }),
    };
  }

  const newPermission = await addPermissionService(body);
  return {
    statusCode: 201,
    body: JSON.stringify(newPermission),
  };
};

// PUT /roles/{id}
export const updateRoleById = async (event: any) => {
  const id = event.pathParameters?.id;
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  if (!id || (!body.name && typeof body.is_active !== 'boolean')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input. id and at least one field to update are required.' }),
    };
  }

  const updatedRole = await updateRoleService(Number(id), body);
  return {
    statusCode: 200,
    body: JSON.stringify(updatedRole),
  };
};

// PUT /permissions/{id}
export const updatePermissionById = async (event: any) => {
  const id = event.pathParameters?.id;
  const body = JSON.parse(event.body);

  if (!id || (!body.name && !body.category)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input. id and at least one field to update are required.' }),
    };
  }

  const updatedPermission = await updatePermissionService(Number(id), body);
  return {
    statusCode: 200,
    body: JSON.stringify(updatedPermission),
  };
};
