import { getLocalGraphql } from '../../utils/fetch'
import _ from 'lodash'

export const getKnowledgeService = (page=0, pageSize=10) => {
  const getKnowledgeQuery = `query { knowledge(page:` + page + `, pageSize:` + pageSize + `) { 
      totalCounts items { 
        id name
      } 
    } 
  }`
  return getLocalGraphql(getKnowledgeQuery)
}

export const searchKnowledgeByIdService = (id: number) => {
  const searchKnowledgeByIdQuery = `query { knowledgeGet(id:` + id + `) { 
      id name
    } 
  }`
  return getLocalGraphql(searchKnowledgeByIdQuery)
}

export const searchKnowledgeService = (page = 0, pageSize = 10, data: any) => {
  const { name } = data
  const searchKnowledgeQuery = `query { knowledgeSearch(page:` + page + `, pageSize:` + pageSize + `, data: { name: "` + name + `" }) { 
      totalCounts items { 
        id name
      } 
    } 
  }`
  return getLocalGraphql(searchKnowledgeQuery)
}

export const addKnowledgeService = (data: any) => { 
  const { name } = data

  const addKnowledgeQuery = `mutation { knowledgeAdd(data: { name: "` + name + `"}) }`

  return getLocalGraphql(addKnowledgeQuery)
}

export const updateKnowledgeService = (id: number, data: any) => { 
  const { name } = data

  const updateKnowledgeQuery = `mutation { knowledgeUpdate(id: ` + id + `, data: { name: "` + name + `"}) }`

  return getLocalGraphql(updateKnowledgeQuery)
}

export const deleteKnowledgeService = (id: number) => { 
  const deleteKnowledgeQuery = `mutation { knowledgeDelete(id: ` + id + `) }`

  return getLocalGraphql(deleteKnowledgeQuery)
}

export const batchAddKnowledgeService = (datas: any) => { 
  let batchStr = ''
  _.each(datas, (item, index) => { 
    const { name } = item
    batchStr += `{ name: "` + name + `" },`
  })
  batchStr = batchStr.substring(0, batchStr.length - 1)

  const batchAddKnowledgeQuery = `mutation { knowledgeBatchAdd(datas: [` + batchStr + `]) }`

  return getLocalGraphql(batchAddKnowledgeQuery)
}

export const batchDeleteKnowledgeService = (ids: any) => { 
  const batchStr = ids.join(',')

  const batchDeleteKnowledgeQuery = `mutation { knowledgeBatchDelete(ids: [` + batchStr + `]) }`

  return getLocalGraphql(batchDeleteKnowledgeQuery)
}