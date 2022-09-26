/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { Tree, Dropdown, Menu, Button, Modal, Input, message, Divider } from 'antd'
import TopLevelTabs from '@/components/Classification/TopLevelTabs'
import { EllipsisOutlined } from '@ant-design/icons'
import {
  getCategories,
  getTopLevelCategories,
  createCategory,
  renameCategory,
  deleteCategory,
} from '@/services/categories'
import { useSelector } from 'umi'
import styles from './CategoriesTree.less'

const convertData = (data) => {
  data.forEach((item) => {
    item.key = item.CategoryId
    if (item.ChildrenList) {
      item.children = item.ChildrenList
      delete item.ChildrenList
      convertData(item.children)
    }
  })
}
const UN_CLASSIFIED_ID = '100000'

export default function CategoriesTree({ onSelected, getTopLevelList, flagNumber }) {
  const [selectedKeys, setSelectedKeys] = useState([])
  const [topList, setTopList] = useState([])
  const [currentTopID, setCurrentTopID] = useState(null)
  const [treeData, setTreeData] = useState([])
  const [apiTotal, setApiTotal] = useState(0)
  const tableRecordsTotal = useSelector((state) => state.classification.apiTotal)

  useEffect(() => getTopLevelList(topList), [topList, getTopLevelList])

  // 递归收集ID
  const collectionIDs = (list) => {
    const ids = []
    const rev = (arr) => {
      arr.forEach((e) => {
        ids.push(e.CategoryId)
        if (e.children && e.children.length) rev(e.children)
      })
    }

    rev(list)

    return ids
  }

  const fetchTopLevelCategories = async (stay) => {
    const {
      Code,
      Data: { Categories },
    } = await getTopLevelCategories()
    if (Code !== 'Succeed') return

    if (!stay) {
      Categories.push({
        CategoryName: '未分类',
        CategoryId: UN_CLASSIFIED_ID,
        Index: 100000,
        ParentId: '0',
      })
      setCurrentTopID(Categories[0].CategoryId)
    }
    setTopList(Categories)
  }

  useEffect(() => {
    fetchTopLevelCategories()
  }, [])

  const fetchData = async (stay) => {
    if (currentTopID === null) return

    // 选中未分类
    if (currentTopID === UN_CLASSIFIED_ID) {
      setTreeData([])
      setSelectedKeys([])
      onSelected([UN_CLASSIFIED_ID])
      return
    }

    const {
      Code,
      Data: { Categories },
    } = await getCategories({ CategoryId: currentTopID })
    if (Code !== 'Succeed') return

    const categoryList = Categories[0]?.ChildrenList || []
    convertData(categoryList)

    setTreeData(categoryList)
    if (!stay) {
      onSelected([currentTopID].concat(collectionIDs(categoryList)))
      setApiTotal(Categories[0]?.Count)
    }
  }

  useEffect(() => {
    if (flagNumber === 1) return

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagNumber])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopID])

  const onTopChange = (topID) => {
    setCurrentTopID(topID)
    setSelectedKeys([])
    onSelected([currentTopID].concat(collectionIDs(treeData)))
  }

  const onSelect = (keys, { selected, node }) => {
    setSelectedKeys(keys)
    if (!selected) return

    const categoryIds = collectionIDs([node])
    onSelected(categoryIds)
  }

  const getNextLevel = (Level) => `C${parseInt(Level.substr(1)) + 1}`

  const onAdd = (Level, ParentId) => {
    let categoryName = ''
    Modal.confirm({
      title: (
        <div style={{ margin: '14px 0 10px' }}>
          {Level === 'C1' && ParentId === '0' ? '组别名称' : '名称'}
        </div>
      ),
      content: (
        <Input
          placeholder="请输入分类命名"
          onChange={(e) => {
            categoryName = e.target.value
          }}
        />
      ),
      width: 480,
      icon: '',
      closable: true,
      onOk: () =>
        new Promise((resolve) => {
          createCategory({ ParentId, Level: [Level], Name: categoryName }).then(({ Code }) => {
            if (Code !== 'Succeed') return

            resolve()
            message.success('新增分类成功')
            fetchData(true)
            fetchTopLevelCategories(true)
          })
        }),
    })
  }

  const onRename = (CategoryId, CategoryName) => {
    let renameValue = ''
    Modal.confirm({
      title: <div style={{ margin: '14px 0 10px' }}>名称</div>,
      content: (
        <Input
          defaultValue={CategoryName}
          placeholder="请输入新命名"
          onChange={(e) => {
            renameValue = e.target.value
          }}
        />
      ),
      width: 480,
      icon: '',
      closable: true,
      onOk: () =>
        new Promise((resolve) => {
          renameCategory({ CategoryId, CategoryName: renameValue }).then(({ Code }) => {
            if (Code !== 'Succeed') return

            resolve()
            message.success('重命名分类成功')
            fetchData(true)
            fetchTopLevelCategories(true)
          })
        }),
    })
  }

  const onDeleteTopCate = () => {
    fetchTopLevelCategories()
  }

  const onDelete = (CategoryName, CategoryId, ChildrenList) => {
    const CategoryIds = collectionIDs([{ CategoryId, ChildrenList }])
    const title = (
      <div>
        确认删除
        <span style={{ color: '#1890FF', margin: '0 4px' }}>{CategoryName}</span>
        类别吗？
      </div>
    )
    const content = <span style={{ color: 'red' }}>对应 API 资产关联信息也将删除</span>

    Modal.confirm({
      title,
      content,
      width: 480,
      closable: true,
      onOk: async () => {
        const { Code } = await deleteCategory({ CategoryIds })
        if (Code !== 'Succeed') return

        message.success('删除分类成功')
        fetchData()
      },
    })
  }

  const titleRender = ({ CategoryName, Count, CategoryId, Level, children }) => {
    const menu = (
      <Menu>
        {Level !== 'C5' && (
          <Menu.Item key="1" onClick={() => onAdd(getNextLevel(Level), CategoryId)}>
            新增
          </Menu.Item>
        )}
        <Menu.Item key="2" onClick={() => onRename(CategoryId, CategoryName)}>
          重命名
        </Menu.Item>
        <Menu.Item
          key="3"
          style={{ color: 'red' }}
          onClick={() => onDelete(CategoryName, CategoryId, children)}
        >
          删除
        </Menu.Item>
      </Menu>
    )

    return (
      <div className={styles.treeNodeTitle}>
        <div>
          {CategoryName} ({Count})
        </div>
        <Dropdown overlay={menu} placement="bottomCenter">
          <a onClick={(e) => e.preventDefault()}>
            <EllipsisOutlined style={{ color: '#666666', fontSize: 20 }} />
          </a>
        </Dropdown>
      </div>
    )
  }

  return (
    <div className={styles.categoriesTree}>
      <div className={styles.total}>
        总数：{currentTopID === UN_CLASSIFIED_ID ? tableRecordsTotal : apiTotal}
      </div>
      <TopLevelTabs
        activeID={currentTopID}
        topList={topList}
        onTopChange={onTopChange}
        onAdd={onAdd}
        onRename={onRename}
        onDeleteTopCate={onDeleteTopCate}
      />
      <Divider style={{ borderTopColor: '#28294a', margin: 0 }} />
      <div className={styles.treeNodes}>
        <Tree
          blockNode
          titleRender={titleRender}
          className={styles.tree}
          treeData={treeData}
          selectedKeys={selectedKeys}
          onSelect={onSelect}
          switcherIcon={<span></span>}
        />
        <div className={styles.footer}>
          <Button
            type="primary"
            disabled={currentTopID === UN_CLASSIFIED_ID}
            onClick={() => onAdd('C2', currentTopID)}
          >
            新增类别
          </Button>
        </div>
      </div>
    </div>
  )
}
