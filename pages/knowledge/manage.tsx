import React, { useEffect, useState } from 'react'
import { ConfigProvider, Table, Modal, Button, Input, Space, Upload, message } from 'antd'
import { Container, SearchRow, ModalContainer } from '../../client/styled/knowledge/manage'
import { useDispatch, useSelector } from 'react-redux'
import { getKnowledge, addKnowledge, modKnowledge, delKnowledge, updateSSRKnowledge, searchKnowledge, batchDelKnowledge } from '../../client/redux/knowledge/manage/actions'
import { getKnowledgeService } from '../../client/service/knowledge/manage'
import { RootState } from '../../client/redux/store'
import _ from 'lodash'
import 'antd/dist/antd.css'
import moment from 'moment'
import locale from 'antd/lib/locale/zh_CN'
import { handleXSS, checkModalObj } from '../../client/utils/common'
import XLSX from 'xlsx'
import { UploadOutlined } from '@ant-design/icons'

const pageSize = 100
const dateFormat = 'YYYY-MM-DD'
const currentDate = moment().format(dateFormat)
console.log('currentDate', currentDate)

const keyTitles = {
  name: '名称'
}

const Page = ({ knowledge }) => { 
  const dispatch = useDispatch()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
  const [modalName, setModalName] = useState('')
  const [searchName, setSearchName] = useState('')
  const [batchDelIds, setBatchDelIds] = useState([])

  useEffect(() => {
    dispatch(updateSSRKnowledge(knowledge))
  }, [dispatch])

  const state = useSelector((state: RootState) => state)
  const { knowledgeManage } = state
  console.log('knowledgeManage', knowledgeManage)

  if (!knowledgeManage.firstLoadFlag) { 
    knowledge = knowledgeManage.knowledge
  }
  
  const { totalCounts, items:knowledgeItems } = knowledge
  console.log('knowledge', knowledge)

  _.each(knowledgeItems, (item, index) => { 
    const { id } = item
    item.key = id
  })

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
      title: keyTitles.name,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false
    },
    {
      title: '操作',
      dataIndex: '',
      render: (_:any, record:any) => {
        return (
          <Space>
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setBatchDelIds(selectedRowKeys)
    }
  }

  const createKnowledge = () => {
    setModalId(0)
    setModalName('')
    showModal()
  }

  const updateKnowledge = (record:any) => { 
    let { id, name } = record

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

  const getMessageTitle = (key: string) => { 
    let result = keyTitles[key]
    if (result == undefined)
      result = key
    return result
  }

  const handleOk = () => { 
    const modalObj = {
      name: handleXSS(modalName)
    }
    console.log('handleOk', modalObj)

    const checkResult = checkModalObj(modalObj)

    if (!checkResult) {
      if (modalId == 0) {  // 新增
        dispatch(addKnowledge(modalObj))
      } else {
        dispatch(modKnowledge(modalId, modalObj))
      }
      
      setIsModalVisible(false)
    } else { 
      message.info(getMessageTitle(checkResult.key) + checkResult.reason)
    }
  }

  const handleCancel = () => { 
    setIsModalVisible(false)
  }

  const doSearch = () => { 
    dispatch(searchKnowledge(0, pageSize, { name: handleXSS(searchName) }))
  }

  const exportKnowledge = () => { 
    if (knowledgeItems.length > 0) {
      const wb = XLSX.utils.book_new()
      const jsonData = _.map(knowledgeItems, (item) => _.omit(item, ['key']))
      //console.log('jsonData', jsonData)
      const ws = XLSX.utils.json_to_sheet(jsonData)
  
      /* add worksheet to workbook */
      XLSX.utils.book_append_sheet(wb, ws, "Knowledge")
  
      /* write workbook */
      XLSX.writeFile(wb, "Knowledge.xlsx")
    } else { 
      message.info("没有数据无需导出")
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/rest/knowledge/import',
    onChange(info:any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
        window.location.reload()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    }
  }

  const batchDeleteKnowledge = () => { 
    if (batchDelIds.length > 0) { 
      Modal.confirm({
        title: '提示',
        content: '确认批量删除吗',
        okText: '确认',
        cancelText: '取消',
        onOk : (e) => {
          dispatch(batchDelKnowledge(batchDelIds))
          Modal.destroyAll()
        }
      })
    } else { 
      message.info("没有数据不能批量删除")
    }
  }

  return (  
    <Container>
      <ConfigProvider locale={locale}>
        <SearchRow>
          <Space>
            <Button type="primary" onClick={createKnowledge}>
              新增
            </Button>
            <Input value={searchName} placeholder="" onChange={(e) => setSearchName(e.target.value)} />
            <Button type="primary" onClick={doSearch}>
              搜索
            </Button>
            <Button type="primary" onClick={exportKnowledge}>
              导出
            </Button>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>导入</Button>
            </Upload>
            <Button type="primary" onClick={batchDeleteKnowledge}>
              批量删除
            </Button>
          </Space>
        </SearchRow>
        <Table rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}  dataSource={dataSource} columns={columns} pagination={{
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
              <label>{keyTitles.name}</label>
              <Input value={modalName} placeholder="" onChange={(e) => setModalName(e.target.value)} />
            </div>
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  )
}

Page.getInitialProps = async () => {
  let knowledge = null

  await getKnowledgeService(0, pageSize).then((res: any) => { 
    console.log('res', res)
    const { data } = res
    knowledge = data.knowledge
  })

  console.log('knowledge-getInitialProps', knowledge)

  return {
    knowledge
  }
}

export default Page