import api from './api'

export const authService = {
  login: async ({ email, senha }) => {
    const { data } = await api.post('/auth/login', { email, senha })
    return data // { token, user: { id, nome, email, role } }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
