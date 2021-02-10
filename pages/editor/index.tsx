import { Container } from '../../client/styled/editor/index'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Space } from 'antd'
import _ from 'lodash'
import 'antd/dist/antd.css'
import 'braft-editor/dist/index.css'
import { addKnowledge, modKnowledge, searchKnowledgeById } from '../../client/redux/knowledge/manage/actions'
import { handleXSS, routerPush } from '../../client/utils/common'
import { useRouter } from 'next/router'
import { RootState } from '../../client/redux/store'

let BraftEditor = null
let renderFlag = false
let nameChangeFlag = false

const Page = ({ }) => {
  const router = useRouter()
  let { id, from:queryFrom, view, debug }:any = router.query
  const queryId = (id != undefined) ? parseInt(id, 10) : 0
  const queryView = (view != undefined) ? parseInt(view, 10) : 0
  const queryDebug = (debug != undefined) ? parseInt(debug, 10) : 0
  console.log('queryParams', queryId, queryFrom, queryView, queryDebug)

  const [name, setName] = useState('')
  const [viewContent, setViewContent] = useState('')

  const dispatch = useDispatch()
  const [editorState, setEditorState] = useState(null)

  const state = useSelector((state: RootState) => state)
  const { knowledgeManage } = state
  console.log('knowledgeManage', knowledgeManage)
  const { knowledge, searchByIdFlag } = knowledgeManage
  const { totalCounts, items:knowledgeItems } = knowledge
  console.log('knowledge', knowledge)
  
  // 只执行一遍
  if (searchByIdFlag && totalCounts > 0 && !renderFlag) { 
    renderFlag = true
    const { name:searchName, content:searchContent } = knowledgeItems[0]
    setName(searchName)
    setViewContent(searchContent)
    setEditorState(BraftEditor.createEditorState(searchContent))
  }

  useEffect(() => {
    BraftEditor = require('braft-editor').default
    console.log('queryId', queryId, totalCounts)

    if (queryId == 0) {
      setEditorState(BraftEditor.createEditorState(null))
    } else { 
      if (totalCounts != 0) {
        let flag = false
        _.each(knowledgeItems, (item, index) => {
          const { id, name, content } = item
          if (id == queryId) {
            console.log('content', content)
            setName(name)
            setViewContent(content)
            setEditorState(BraftEditor.createEditorState(content))
            flag = true
            return false
          }
        })

        if (!flag) {
          setEditorState(BraftEditor.createEditorState(null))
        }
      } else { 
        dispatch(searchKnowledgeById(queryId))
      }
    }
  }, [dispatch])

  const doPublish = () => { 
    const content = editorState.toHTML()
    console.log('doPublish', name, content)

    const obj = {
      name: handleXSS(name),
      content,
      fromEditor: true
    }

    if (queryId == 0) {
      dispatch(addKnowledge(obj))
    } else { 
      dispatch(modKnowledge(queryId, obj))
    }
    
    if (!queryDebug) { 
      routerPush(router, queryFrom)
    }
  }

  const doBack = () => { 
    router.back()
  }

  const editDIV = () => { 
    return (
      <div className="content">
        <div className="line">
          <label>标题</label>
          <Input value={name} placeholder="默认显示富文本开始部分内容" onChange={(e) => { 
            nameChangeFlag = true
            setName(e.target.value)
          }} />
        </div>
        <div className="editor">
          <BraftEditor value={editorState} onChange={(value: any) => {
            if (queryId == 0 && !nameChangeFlag && name.length < 20) {
              setName(value.toHTML().replace(/<[^>]+>/g, "").substring(0, 20))
            }
            
            setEditorState(value)
          }} />
        </div>
      </div>
    )
  }

  const articleDiv = () => { 
    return (
      <div className="content">
        <div className="article-title">{name}</div>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: viewContent }}></div>
      </div>
    )
  }

  return (
    <Container>
      {
        editorState && ((queryView == 0) ? editDIV() : articleDiv())
      }
      <div className="operate">
        <Space>
          <Button onClick={doBack}>
            返回
          </Button>
          {(queryView == 0) && <Button type="primary" onClick={doPublish}>
            发布
          </Button>}
        </Space>
      </div>
    </Container>
  )
}

Page.getInitialProps = () => {
  return {}
}

export default Page
