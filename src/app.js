import { getUserRole } from './utils/user'

export async function getInitialState() {
  const Role = getUserRole() || ''

  return {
    Role,
  }
}
