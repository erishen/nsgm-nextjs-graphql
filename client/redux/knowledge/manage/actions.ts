import * as types from './types'
import { getKnowledgeService, addKnowledgeService, updateKnowledgeService, deleteKnowledgeService, searchKnowledgeByIdService, searchKnowledgeService } from '../../../service/knowledge/manage'

export const getKnowledge = (page=0, pageSize=10) => (
  dispatch: (arg0: {
    type: string
    payload?: { knowledge: any }
  }) => void
) => {
  dispatch({
    type: types.GET_KNOWLEDGE
  })

  getKnowledgeService(page, pageSize)
    .then((res: { data: any }) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.GET_KNOWLEDGE_SUCCEEDED,
        payload: {
          knowledge: data.knowledge
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.GET_KNOWLEDGE_FAILED
      })
    })
}

export const searchKnowledge = (page=0, pageSize=10, data: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { knowledge: any }
  }) => void
) => {
  dispatch({
    type: types.SEARCH_KNOWLEDGE
  })

  searchKnowledgeService(page, pageSize, data)
    .then((res: { data: any }) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.SEARCH_KNOWLEDGE_SUCCEEDED,
        payload: {
          knowledge: data.knowledgeSearch
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.SEARCH_KNOWLEDGE_FAILED
      })
    })
}

export const updateSSRKnowledge = (knowledge: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { knowledge: any }
  }) => void
) => {
  dispatch({
    type: types.UPDATE_SSR_KNOWLEDGE,
    payload: {
      knowledge: knowledge
    }
  })
}

export const addKnowledge = (obj:any) => (
  dispatch: (arg0: {
    type: string
    payload?: { knowledge: any }
  }) => void
) => {
  dispatch({
    type: types.ADD_KNOWLEDGE
  })

  addKnowledgeService(obj)
    .then((res: { data: any }) => {
      //console.log('action_res', res)
      const { data } = res
      const knowledge = {
        id: data.knowledgeAdd,
        ...obj
      }
      dispatch({
        type: types.ADD_KNOWLEDGE_SUCCEEDED,
        payload: {
          knowledge
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.ADD_KNOWLEDGE_FAILED
      })
    })
}

export const modKnowledge = (id: number, obj: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { knowledge: any }
  }) => void
) => {
  dispatch({
    type: types.MOD_KNOWLEDGE
  })

  updateKnowledgeService(id, obj)
    .then((res: { data: any }) => {
      console.log('action_res', res)
      const knowledge = {
        id,
        ...obj
      }
      dispatch({
        type: types.MOD_KNOWLEDGE_SUCCEEDED,
        payload: {
          knowledge
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.MOD_KNOWLEDGE_FAILED
      })
    })
}

export const delKnowledge = (id: number) => (
  dispatch: (arg0: {
    type: string
    payload?: { id: number }
  }) => void
) => {
  dispatch({
    type: types.DEL_KNOWLEDGE
  })

  deleteKnowledgeService(id)
    .then((res: { data: any }) => {
      console.log('action_res', res)

      dispatch({
        type: types.DEL_KNOWLEDGE_SUCCEEDED,
        payload: {
          id
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.DEL_KNOWLEDGE_FAILED
      })
    })
}

export const searchKnowledgeById = (id: number) => (
  dispatch: (arg0: {
    type: string
    payload?: { knowledge: any }
  }) => void
) => {
  dispatch({
    type: types.SEARCH_KNOWLEDGE_BYID
  })

  searchKnowledgeByIdService(id)
    .then((res: { data: any }) => {
      //console.log('action_res', res)
      const { data } = res

      dispatch({
        type: types.SEARCH_KNOWLEDGE_BYID_SUCCEEDED,
        payload: {
          knowledge: data.knowledgeGet
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.SEARCH_KNOWLEDGE_BYID_FAILED
      })
    })
}