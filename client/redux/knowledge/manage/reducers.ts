import * as types from './types'
import _ from 'lodash'

const initialState = {
  firstLoadFlag: true,
  knowledge: {
    totalCounts: 0,
    items: []
  }
}

export const knowledgeManageReducer = (state = initialState, { type, payload }) => {
  const { knowledge } = state
  const { totalCounts, items } = knowledge
  let newItems = []

  switch (type) {
    case types.UPDATE_SSR_KNOWLEDGE:
      //console.log('reducer_payload_ssr', payload)
      return {
        ...state,
        firstLoadFlag: true,
        knowledge: payload.knowledge
      }
    case types.GET_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_get', payload)
      return {
        ...state,
        firstLoadFlag: false,
        knowledge: payload.knowledge
      }
    case types.SEARCH_KNOWLEDGE_SUCCEEDED:
      console.log('reducer_payload_search', payload)
      return {
        ...state,
        firstLoadFlag: false,
        knowledge: payload.knowledge
      }
    case types.ADD_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_add', payload)
      newItems = [...items]
      newItems.push(payload.knowledge)

      //console.log('newItems-add', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        knowledge: {
          totalCounts: totalCounts + 1,
          items: newItems
        }
      }
    case types.MOD_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_mod', payload)
      const modItem = payload.knowledge

      _.each(items, (item, index) => { 
        if (item.id == modItem.id) {
          newItems.push(modItem)
        } else { 
          newItems.push(item)
        }
      })

      //console.log('newItems-mod', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        knowledge: {
          totalCounts: totalCounts,
          items: newItems
        }
      }
    case types.DEL_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_del', payload)
      const delItemId = payload.id

      _.each(items, (item, index) => { 
        if (item.id != delItemId) { 
          newItems.push(item)
        }
      })

      //console.log('newItems-del', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        knowledge: {
          totalCounts: totalCounts - 1,
          items: newItems
        }
      }
    case types.BATCH_DEL_KNOWLEDGE_SUCCEEDED:
      const delItemIds = payload.ids
      const allIds = _.map(_.map(items, (item) => _.pick(item, ['id'])), 'id')
      const diffIds = _.xor(allIds, delItemIds)

      console.log('delItemIds', delItemIds, allIds, diffIds)

      newItems = _.filter(items, (item) => _.includes(diffIds, item.id))

      let newTotalCounts = totalCounts - delItemIds.length
      if (newTotalCounts < 0)
        newTotalCounts = 0
      
      console.log('newItems-batch-del', newItems, newTotalCounts)
      return {
        ...state,
        firstLoadFlag: false,
        knowledge: {
          totalCounts: newTotalCounts,
          items: newItems
        }
      }
    default:
      return state
  }
}
