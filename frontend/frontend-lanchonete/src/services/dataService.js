import api from './api'

export const produtoService = {
  listar: () => api.get('/produtos').then(r => r.data),
  criar: (data) => api.post('/produtos', data).then(r => r.data),
  atualizar: (id, data) => api.put(`/produtos/${id}`, data).then(r => r.data),
  deletar: (id) => api.delete(`/produtos/${id}`),
}

export const vendaService = {
  registrar: (payload) => api.post('/vendas', payload).then(r => r.data),
  listar: (params) => api.get('/vendas', { params }).then(r => r.data),
  resumoDia: () => api.get('/vendas/resumo-dia').then(r => r.data),
}

export const usuarioService = {
  listar: () => api.get('/usuarios').then(r => r.data),
  criar: (data) => api.post('/usuarios', data).then(r => r.data),
  atualizar: (id, data) => api.put(`/usuarios/${id}`, data).then(r => r.data),
  deletar: (id) => api.delete(`/usuarios/${id}`),
}
