import React, { useEffect, useState } from 'react'
import { ConfigProvider, Table, Modal, Button, Input, Space } from 'antd'
import { Container, SearchRow, ModalContainer } from '../../client/styled/knowledge/manage'
import { useDispatch, useSelector } from 'react-redux'
import { getKnowledge, addKnowledge, modKnowledge, delKnowledge, updateSSRKnowledge, searchKnowledge } from '../../client/redux/knowledge/manage/actions'
import { getKnowledgeService } from '../../client/service/knowledge/manage'
import { RootState } from '../../client/redux/store'
import _ from 'lodash'
import 'antd/dist/antd.css'
import moment from 'moment'
import locale from 'antd/lib/locale/zh_CN'
import { handleXSS, routerPush, getNewLink } from '../../client/utils/common'
import { useRouter } from 'next/router'
import Link from 'next/link'

const { TextArea } = Input
const pageSize = 100
const dateFormat = 'YYYY-MM-DD'
const currentDate = moment().format(dateFormat)
console.log('currentDate', currentDate)

const Page = ({ knowledge }) => { 
  const router = useRouter()
  const dispatch = useDispatch()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
  const [modalName, setModalName] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalUIContent, setModalUIContent] = useState('')
  const [modalIsEditor, setModalIsEditor] = useState(false)

  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    dispatch(updateSSRKnowledge(knowledge))
  }, [dispatch])

  const state = useSelector((state: RootState) => state)
  const { knowledgeManage } = state
  console.log('knowledgeManage', knowledgeManage, knowledge)

  if (!knowledgeManage.firstLoadFlag || !knowledge) { 
    knowledge = knowledgeManage.knowledge
  }

  const { totalCounts, items:knowledgeItems } = knowledge
  console.log('knowledge', knowledge)

  _.each(knowledgeItems, (item, index) => { 
    const { id } = item
    item.key = id
    let newContent = item.content.replace(/<[^>]+>/g, "")
    if (newContent.length > 25) { 
      newContent = newContent.substring(0, 25) + '...'
    }
    item.contentUI = newContent
  })

  console.log('knowledgeItems', knowledgeItems)

  const dataSource = knowledgeItems
  const columns:any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: '内容',
      dataIndex: 'contentUI',
      key: 'contentUI'
    },
    {
      title: '操作',
      dataIndex: '',
      render: (_:any, record:any) => {
        return (
          <Space>
            <Button onClick={() => { 
              console.log('record', record)
              viewKnowledge(record)
            }}>查看</Button>
            <Button onClick={() => { 
              console.log('record', record)
              updateKnowledge(record)
            }}>修改</Button>
            <Button onClick={() => { 
              console.log('record', record)
              const { id } = record
              deleteKnowledge(id)
            }}>删除</Button>
          </Space>
        )
      }
    }
  ]
  
  const createKnowledge = () => {
    setModalId(0)
    setModalName('')
    setModalContent('')
    setModalUIContent('')
    setModalIsEditor(false)
    showModal()
  }

  const viewKnowledge = (record:any) => { 
    let { id } = record
    routerPush(router, '/editor?id=' + id + '&view=1&from=/knowledge/manage')
  }

  const updateKnowledge = (record:any) => { 
    let { id, name, content } = record
    //console.log('content', content, (/<[^>]+>/g).test(content))

    if ((/<[^>]+>/g).test(content)) {
      setModalContent(content)
      setModalUIContent(content.replace(/<[^>]+>/g, ""))
      setModalIsEditor(true)
    } else { 
      setModalUIContent(content)
      setModalContent(content)
      setModalIsEditor(false)
    }

    setModalId(id)
    setModalName(name)
    showModal()
  }

  const deleteKnowledge = (id:number) => { 
    Modal.confirm({
      title: '提示',
      content: '确认删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk : (e) => {
        dispatch(delKnowledge(id))
        Modal.destroyAll()
      }
    })
  }

  const showModal = () => { 
    setIsModalVisible(true)
  }

  const handleOk = () => { 
    const modalObj = {
      name: handleXSS(modalName),
      content: modalIsEditor ? modalContent : handleXSS(modalContent),
      contentUI: modalUIContent,
      isEditor: modalIsEditor
    }

    console.log('handleOk', modalObj)

    if (modalId == 0) {  // 新增
      dispatch(addKnowledge(modalObj))
    } else { 
      dispatch(modKnowledge(modalId, modalObj))
    }
    
    setIsModalVisible(false)
  }

  const handleCancel = () => { 
    setIsModalVisible(false)
  }

  const createEditorKnowledge = () => { 
    routerPush(router, '/editor?from=/knowledge/manage')
  }

  const doSearch = () => { 
    dispatch(searchKnowledge(0, pageSize, {
      name: handleXSS(searchName)
    }))
  }

  return (  
    <Container>
      <ConfigProvider locale={locale}>
        <SearchRow>
          <Space>
            <Button type="primary" onClick={createKnowledge}>
              新增
            </Button>
            <Button type="primary" onClick={createEditorKnowledge}>
              新增富文本
            </Button>
            <Input value={searchName} placeholder="" onChange={(e) => setSearchName(e.target.value)} />
            <Button type="primary" onClick={doSearch}>
              搜索
            </Button>
          </Space>
        </SearchRow>
        <Table dataSource={dataSource} columns={columns} pagination={{
              total: totalCounts,
              pageSize: pageSize,
              onChange: (page, pageSize) => { 
                console.log('onChange', page, pageSize)
                dispatch(getKnowledge(page-1, pageSize))
              }
        }} />
        <Modal title={(modalId == 0 ? "新增" : "修改") + " knowledge"} visible={isModalVisiable} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
          <ModalContainer>
            <div className="line">
              <label>标题</label>
              <Input value={modalName} placeholder="" onChange={(e) => setModalName(e.target.value)} />
            </div>
            <div className="multiline">
              <label>内容</label>
              <TextArea placeholder="" disabled={modalIsEditor} autoSize={{ minRows: 3, maxRows: 5 }}
                value={modalIsEditor ? modalUIContent : modalContent} onChange={(e) => setModalContent(e.target.value)} />
            </div>
            {modalIsEditor && <div className="rightline">
              <Link href={getNewLink("/editor?id=" + modalId + "&from=/knowledge/manage")}>
                <a>跳到富文本编辑器修改</a>
              </Link>
            </div>}
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  )
}

Page.getInitialProps = async ({ req }) => {
  if (req) {
    let knowledge = null

    await getKnowledgeService(0, pageSize).then((res: { data: any }) => {
      //console.log('res', res)
      const { data } = res
      knowledge = data.knowledge
    })
  
    console.log('knowledge-getInitialProps', knowledge)
  
    return {
      knowledge
    }
  } else { 
    return {}
  }
}

export default Page