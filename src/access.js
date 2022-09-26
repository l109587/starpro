import { PermissionMap } from './constant/content'

export default (initialState = {}) => {
  const { Role } = initialState

  return {
    permission: ({ path }) => {
      if (Role === 'SuperAdmin') return true

      const allowPaths = PermissionMap[Role] || []

      return allowPaths.includes(path)
    },
  }
}
