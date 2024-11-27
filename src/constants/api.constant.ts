export const ApiConstant = {
  auth: {
    login: '/auth/login',
  },
  users: {
    me: '/users/me',
    list: '/users',
    create: '/users',
    update: '/users/:id',
    delete: '/users/:id',
  },
  projects: {
    list: '/projects',
    create: '/projects',
    get: '/projects/:id',
    update: '/projects/:id',
    delete: '/projects/:id',
  },
  places: {
    list: '/projects/:projectId/places?size=:size&page=:page',
    create: '/projects/:projectId/places',
    get: '/projects/:projectId/places/:id',
    update: '/places/:id',
    delete: '/places/:id',
  },
  propertyTypes: {
    list: '/projects/:projectId/property-types',
    create: '/projects/:projectId/property-types',
    get: '/projects/:projectId/property-types/:id',
    update: '/property-types/:id',
    delete: '/property-types/:id',
  },
  statistics: {
    price: '/stats/prices',
    parking: '/stats/parking',
    district: '/stats/districts',
    area: '/stats/areas',
  },
  prices: {
    list: '/projects/:projectId/prices',
  },
};
