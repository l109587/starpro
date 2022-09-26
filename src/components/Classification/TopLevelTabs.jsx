import { Tabs, Menu, Dropdown, Modal, message, Button, Space } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { deleteCategory, getCategories } from '@/services/categories'
import styles from './TopLevelTabs.less'

const { TabPane } = Tabs

// 递归收集ID
const collectionIDs = (list) => {
  const ids = []
  const rev = (arr) => {
    arr.forEach((e) => {
      ids.push(e.CategoryId)
      if (e.ChildrenList && e.ChildrenList.length) rev(e.ChildrenList)
    })
  }

  rev(list)

  return ids
}

export default function TopLevelTabs({
  activeID,
  topList,
  onTopChange,
  onAdd,
  onRename,
  onDeleteTopCate,
}) {
  const onChange = (key) => onTopChange(key)
  const onEdit = (_, action) => {
    if (action !== 'add') return

    // 新增一级分类
    onAdd('C1', '0')
  }
  const onDelete = (CategoryName, CategoryId) => {
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
        const {
          Data: { Categories },
        } = await getCategories({ CategoryId })
        const CategoryIds = collectionIDs(Categories)
        const { Code } = await deleteCategory({ CategoryIds })
        if (Code !== 'Succeed') return

        message.success('删除分类成功')
        onDeleteTopCate()
      },
    })
  }

  const ButtonActions = ({ CategoryName, CategoryId }) => {
    return (
      <Menu>
        <Menu.Item key="2" onClick={() => onRename(CategoryId, CategoryName)}>
          重命名
        </Menu.Item>
        <Menu.Item
          key="3"
          style={{ color: 'red' }}
          onClick={() => onDelete(CategoryName, CategoryId)}
        >
          删除
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div className={styles.topLevelWrap}>
      <Space wrap>
        {topList.map(({ CategoryName, CategoryId }) => (
          <Button
            key={String(CategoryId)}
            type={String(activeID) === CategoryId ? 'primary' : 'default'}
            onClick={() => {
              onTopChange(CategoryId)
            }}
          >
            <div className={CategoryId !== '100000' ? styles.buttonInner : ''}>
              {CategoryName}
              {CategoryId !== '100000' && (
                <Dropdown
                  overlay={<ButtonActions {...{ CategoryName, CategoryId }} />}
                  placement="bottomCenter"
                  arrow
                >
                  <div className={styles.moreWrapper}>
                    <EllipsisOutlined className={styles.more} />
                  </div>
                </Dropdown>
              )}
            </div>
          </Button>
        ))}
      </Space>
      <Button type="primary" block style={{ margin: '20px 0' }} onClick={() => onAdd('C1', '0')}>新增主类</Button>
    </div>
  )
}
