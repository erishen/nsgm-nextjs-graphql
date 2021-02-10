import { getLocalGraphql } from '../../utils/fetch'
import { handleUserInput } from '../../utils/common'

export const getKnowledgeService = (page=0, pageSize=10) => {
  const getKnowledgeQuery = `query { knowledge(page:` + page + `, pageSize:` + pageSize + `) { 
      totalCounts items { 
        id name content
      } 
    } 
  }`
  return getLocalGraphql(getKnowledgeQuery)
}

export const searchKnowledgeByIdService = (id: number) => {
  const searchKnowledgeByIdQuery = `query { knowledgeGet(id:` + id + `) { 
      id name content
    } 
  }`
  return getLocalGraphql(searchKnowledgeByIdQuery)
}

export const searchKnowledgeService = (page = 0, pageSize = 10, data: any) => {
  const { name } = data
  const searchKnowledgeQuery = `query { knowledgeSearch(page:` + page + `, pageSize:` + pageSize + `, data: { name: "` + name + `" }) { 
      totalCounts items { 
        id name content
      } 
    } 
  }`
  return getLocalGraphql(searchKnowledgeQuery)
}

export const addKnowledgeService = (data: any) => { 
  let { name, content } = data

  if (name != undefined && name != '') { 
    name = handleUserInput(name)
  }

  if (content != undefined && content != '') {
    content = handleUserInput(content)
  } 

  console.log('content_add', name, content)
  const addKnowledgeQuery = `mutation { knowledgeAdd(data: { name: "` + name + `" content: "` + content + `"}) }`

  //console.log('addKnowledgeQuery', addKnowledgeQuery) 
  return getLocalGraphql(addKnowledgeQuery)
}

export const updateKnowledgeService = (id: number, data: any) => { 
  let { name, content, isEditor } = data
  let updateKnowledgeQuery = ''

  if (name != undefined && name != '') { 
    name = handleUserInput(name)
  }

  if (content != undefined && content != '') {
    content = handleUserInput(content)
  } 
  console.log('content_update', isEditor, name, content)

  if (isEditor) {
    updateKnowledgeQuery = `mutation { knowledgeUpdate(id: ` + id + `, data: { name: "` + name + `"}) }`
  } else { 
    updateKnowledgeQuery = `mutation { knowledgeUpdate(id: ` + id + `, data: { name: "` + name + `" content: "` + content + `"}) }`
  }
    
  //console.log('updateKnowledgeQuery', updateKnowledgeQuery) 
  return getLocalGraphql(updateKnowledgeQuery)
}

export const deleteKnowledgeService = (id: number) => { 
  const deleteKnowledgeQuery = `mutation { knowledgeDelete(id: ` + id + `) }`

  return getLocalGraphql(deleteKnowledgeQuery)
}