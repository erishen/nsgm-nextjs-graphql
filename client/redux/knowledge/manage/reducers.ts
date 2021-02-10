import * as types from './types'
import _ from 'lodash'

const initialState = {
  firstLoadFlag: true,
  searchByIdFlag: false,
  knowledge: {
    totalCounts: 0,
    items: []
  }
}

let fromEditorIndex = 0

export const knowledgeManageReducer = (state = initialState, { type, payload }) => {
  const { knowledge } = state
  const { totalCounts, items } = knowledge
  let newItems = []
  const payloadId = payload && payload.id
  const payloadKnowledge = payload && payload.knowledge
  const fromEditor = payloadKnowledge && payloadKnowledge.fromEditor
  //console.log('fromEditor', type, fromEditor, fromEditorIndex)

  if (fromEditor) { 
    fromEditorIndex++
  }
    
  switch (type) {
    case types.UPDATE_SSR_KNOWLEDGE:
      //console.log('reducer_payload_ssr', payload)

      let firstLoadFlag = true
      if (fromEditorIndex > 0) { 
        firstLoadFlag = false
        fromEditorIndex = 0
      }

      return {
        ...state,
        firstLoadFlag,
        searchByIdFlag: false,
        knowledge: payloadKnowledge
      }
    case types.GET_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_get', payload)
      return {
        ...state,
        firstLoadFlag: false,
        searchByIdFlag: false,
        knowledge: payloadKnowledge
      }
    case types.SEARCH_KNOWLEDGE_SUCCEEDED:
        console.log('reducer_payload_search', payload)
        return {
          ...state,
          firstLoadFlag: false,
          knowledge: payloadKnowledge
        }
    case types.SEARCH_KNOWLEDGE_BYID_SUCCEEDED:
      newItems.push(payloadKnowledge)

      return {
        ...state,
        firstLoadFlag: false,
        searchByIdFlag: true,
        knowledge: {
          totalCounts: totalCounts + 1,
          items: newItems
        }
      }
    case types.ADD_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_add', payload)
      newItems = [...items]
      newItems.push(payloadKnowledge)

      //console.log('newItems-add', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        searchByIdFlag: false,
        knowledge: {
          totalCounts: totalCounts + 1,
          items: newItems
        }
      }
    case types.MOD_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_mod', payload)
      const modItem = payloadKnowledge

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
        searchByIdFlag: false,
        knowledge: {
          totalCounts: totalCounts,
          items: newItems
        }
      }
    case types.DEL_KNOWLEDGE_SUCCEEDED:
      //console.log('reducer_payload_del', payload)
      _.each(items, (item, index) => { 
        if (item.id != payloadId) { 
          newItems.push(item)
        }
      })

      //console.log('newItems-del', newItems)
      return {
        ...state,
        firstLoadFlag: false,
        searchByIdFlag: false,
        knowledge: {
          totalCounts: totalCounts - 1,
          items: newItems
        }
      }
    default:
      return state
  }
}
