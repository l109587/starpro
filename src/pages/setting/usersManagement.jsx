import { Component, useState } from 'react'
import {
  Button,
  Table,
  Pagination,
  Space,
  message,
  Modal,
  Form,
  Select,
  Divider,
  Input,
  Tag,
} from 'antd'
import { DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
import styles from './index.less'
import { getUsers, postCreateUser, postEditUser, postDeleteUsers } from '@/services/settings'
import { getIntl, injectIntl } from 'umi'
import moment from 'moment'
import { getUsername } from '@/utils/user'
import { logout } from '@/utils/utils'

function UsersTable(props) {
  const intl = getIntl()
  const { userList, onChangeSuccess, onSelection } = props
  const [editVisible, setEditVisible] = useState(false)
  const [editRecord, setEditRecord] = useState({})
  const onUpdate = async ({ Name, Role }) => {
    const { Code, status } = await postEditUser({ Name, Role: [Role], OldName: editRecord.Name })

    if (status === 404)
      return !message.error(intl.formatMessage({ id: 'pages.settings.userinfo.edit.fail' }))
    if (status === 403) return !message.error('请联系超级管理员')
    if (Code !== 'Succeed') return

    message.success(intl.formatMessage({ id: 'pages.settings.userinfo.edit.success' }))
    setEditVisible(false)
    onChangeSuccess()
    const username = getUsername()
    if (username === editRecord.Name) {
      setTimeout(() => {
        logout()
      }, 400)
    }
    return true
  }

  const onShowEdit = (record) => {
    setEditRecord(record)
    setEditVisible(true)
  }
  const onShowDelete = ({ Name }) => {
    const title = (
      <div>
        {intl.formatMessage(
          { id: 'pages.settings.user.delete.hint' },
          {
            username: Name,
            span: (str) => <span style={{ color: '#1785ff' }}>{str}</span>,
          },
        )}
      </div>
    )
    Modal.confirm({
      title,
      content: intl.formatMessage({ id: 'pages.settings.userinfo.will.remove' }),
      cancelText: intl.formatMessage({ id: 'component.button.cancel' }),
      okText: intl.formatMessage({ id: 'component.button.delete' }),
      okButtonProps: {
        danger: true,
      },
      onOk: async (close) => {
        const { Code, status } = await postDeleteUsers({ UserNames: [Name] })

        if (status === 403) return message.error('请联系超级管理员')
        if (Code !== 'Succeed') return

        close()
        message.success(intl.formatMessage({ id: 'pages.settings.user.delete.success' }))
        onChangeSuccess()
      },
    })
  }
  const rowSelection = {
    columnWidth: 64,
    onChange: (selectedRowKeys) => {
      onSelection(selectedRowKeys)
    },
  }
  const roleMap = {
    Auditor: intl.formatMessage({ id: 'pages.settings.role.auditor' }),
    Guest: intl.formatMessage({ id: 'pages.settings.role.guest' }),
    Admin: intl.formatMessage({ id: 'pages.settings.role.admin' }),
    SuperAdmin: '超级管理员',
  }
  const statusMap = {
    Activate: '激活',
    Deactivate: '未激活',
  }
  const columns = [
    {
      title: '#',
      width: 70,
      align: 'center',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: intl.formatMessage({ id: 'pages.settings.column.username' }),
      dataIndex: 'Name',
    },
    {
      title: intl.formatMessage({ id: 'pages.settings.column.role' }),
      dataIndex: 'Role',
      render: (text) => roleMap[text],
    },
    {
      title: intl.formatMessage({ id: 'pages.settings.column.email' }),
      dataIndex: 'Email',
    },
    {
      title: intl.formatMessage({ id: 'pages.settings.column.status' }),
      dataIndex: 'Status',
      render: (status) => (
        <Tag color={status === 'Activate' ? 'processing' : 'error'}>{statusMap[status]}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.settings.column.lastLogin' }),
      dataIndex: 'LastLogin',
      render: (LastLogin) => {
        if (new Date(LastLogin).getFullYear() === 1970) {
          return '-'
        } else {
          return moment(LastLogin).format('YYYY-MM-DD HH:mm:ss')
        }
      },
    },
    {
      title: (
        <span style={{ paddingRight: 8 }}>
          {intl.formatMessage({ id: 'pages.settings.column.operation' })}
        </span>
      ),
      dataIndex: 'UserId',
      width: 110,
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            title={intl.formatMessage({ id: 'component.button.edit' })}
            icon={<EditOutlined />}
            onClick={() => onShowEdit(record)}
          />
          <Button
            type="link"
            title={intl.formatMessage({ id: 'component.button.delete' })}
            danger
            icon={<DeleteOutlined />}
            onClick={() => onShowDelete(record)}
          />
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={userList}
        pagination={false}
        rowKey={(record) => record.Name}
      />
      {editVisible && (
        <EditFormModal
          visible={editVisible}
          userInfo={editRecord}
          onUpdate={onUpdate}
          onCancel={() => setEditVisible(false)}
        />
      )}
    </>
  )
}

function CreateFormModal({ visible, onCreate, onCancel }) {
  const intl = getIntl()
  const [form] = Form.useForm()
  const newPasswordValidator = (_, value) => {
    const passwordReg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/

    if (!value)
      return Promise.reject(
        new Error(intl.formatMessage({ id: 'pages.settings.user.pwd.required' })),
      )
    if (!passwordReg.test(value))
      return Promise.reject(new Error(intl.formatMessage({ id: 'pages.settings.new.pwd.invalid' })))
    return Promise.resolve()
  }

  return (
    <Modal
      width={450}
      visible={visible}
      title={intl.formatMessage({ id: 'pages.settings.create.user' })}
      okText={intl.formatMessage({ id: 'component.button.confirm' })}
      cancelText={intl.formatMessage({ id: 'component.button.cancel' })}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const isOk = await onCreate(values)
            if (isOk) form.resetFields()
          })
          .catch((info) => {
            console.log('Form validation failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="Role"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.settings.role.required' }),
            },
          ]}
        >
          <Select placeholder={intl.formatMessage({ id: 'pages.settings.role.placeholder' })}>
            <Select.Option value="Auditor">
              {intl.formatMessage({ id: 'pages.settings.role.auditor' })}
            </Select.Option>
            <Select.Option value="Guest">
              {intl.formatMessage({ id: 'pages.settings.role.guest' })}
            </Select.Option>
            <Select.Option value="Admin">
              {intl.formatMessage({ id: 'pages.settings.role.admin' })}
            </Select.Option>
          </Select>
        </Form.Item>
        <Divider />
        <Form.Item
          name="Name"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.settings.username.required' }),
              whitespace: true,
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.settings.username.placeholder' })} />
        </Form.Item>
        <Form.Item
          name="Email"
          rules={[
            {
              type: 'email',
              message: intl.formatMessage({ id: 'pages.settings.email.invalid' }),
            },
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.settings.create.email.required' }),
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.settings.create.email.placeholder' })}
          />
        </Form.Item>
        <Form.Item
          name="Password"
          rules={[
            {
              required: true,
              message: '',
            },
            {
              validator: newPasswordValidator,
            },
          ]}
        >
          <Input.Password
            placeholder={intl.formatMessage({ id: 'pages.settings.create.pwd.placeholder' })}
            prefix={<LockOutlined />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function EditFormModal({ visible, userInfo, onUpdate, onCancel }) {
  const intl = getIntl()
  const [form] = Form.useForm()
  const { Name, Role } = userInfo

  return (
    <Modal
      width={450}
      visible={visible}
      title={intl.formatMessage({ id: 'pages.settings.edit.userinfo' })}
      okText={intl.formatMessage({ id: 'component.button.save' })}
      cancelText={intl.formatMessage({ id: 'component.button.cancel' })}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okButtonProps={{ disabled: Role === 'SuperAdmin' }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const isOk = await onUpdate(values)
            if (isOk) form.resetFields()
          })
          .catch((info) => {
            console.log('Form validation failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ Name, Role }}>
        <Form.Item
          name="Name"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.settings.username.required' }),
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.settings.username.placeholder' })}
            readOnly={Role === 'SuperAdmin'}
          />
        </Form.Item>
        <Form.Item
          name="Role"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.settings.role.required' }),
            },
          ]}
        >
          {Role === 'SuperAdmin' ? (
            <span>超级管理员</span>
          ) : (
            <Select placeholder={intl.formatMessage({ id: 'pages.settings.role.placeholder' })}>
              <Select.Option value="Auditor">
                {intl.formatMessage({ id: 'pages.settings.role.auditor' })}
              </Select.Option>
              <Select.Option value="Guest">
                {intl.formatMessage({ id: 'pages.settings.role.guest' })}
              </Select.Option>
              <Select.Option value="Admin">
                {intl.formatMessage({ id: 'pages.settings.role.admin' })}
              </Select.Option>
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

class UsersManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Search: '',
      PageNum: 1,
      PageSize: 10,
      totalNum: 0,
      userList: [],
      createVisible: false,
      UserNames: [],
    }
    this.fetchUsers = this.fetchUsers.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.onChangeSuccess = this.onChangeSuccess.bind(this)
    this.onSelection = this.onSelection.bind(this)
    this.onShowDeleteBatch = this.onShowDeleteBatch.bind(this)
  }

  async fetchUsers() {
    const { Search, PageNum, PageSize } = this.state
    const { Code, Data, Message } = await getUsers({ Search, PageNum, PageSize })

    // get users data failed
    if (Code !== 'Succeed') return

    // get users data successed
    this.setState({
      totalNum: Data.Total || 0,
      userList: Data.Users || [],
    })
  }

  async onCreate({ Role, Name, Email, Password }) {
    const { intl } = this.props
    const body = {
      Role: [Role],
      Name,
      Email,
      Password,
    }
    const { Code, status } = await postCreateUser(body)

    if (status === 404)
      return !message.error(intl.formatMessage({ id: 'pages.settings.username.exist' }))
    if (status === 403) return !message.error('请联系超级管理员')

    if (Code !== 'Succeed') return
    this.setState({ createVisible: false })
    message.success(intl.formatMessage({ id: 'pages.settings.create.user.success' }))
    this.fetchUsers()
    return true
  }

  onChangeSuccess() {
    this.fetchUsers()
  }

  onSelection(UserNames) {
    this.setState({ UserNames })
  }

  onShowDeleteBatch() {
    const { intl } = this.props
    const { UserNames } = this.state
    const title = (
      <div>
        {intl.formatMessage(
          { id: 'pages.settings.user.batch.delete.hint' },
          {
            count: UserNames.length,
            span: (str) => <span style={{ color: '#1785ff' }}>{str}</span>,
          },
        )}
      </div>
    )

    UserNames.length === 0
      ? message.error('选择要删除的用户')
      : Modal.confirm({
          title,
          content: intl.formatMessage(
            { id: 'pages.settings.userinfo.will.batch.remove' },
            { count: UserNames.length },
          ),
          cancelText: intl.formatMessage({ id: 'component.button.cancel' }),
          okText: intl.formatMessage({ id: 'component.button.delete' }),
          okButtonProps: {
            danger: true,
          },
          onOk: async (close) => {
            const { Code, status } = await postDeleteUsers({ UserNames })

            if (status === 403) return message.error('请联系超级管理员')
            if (Code !== 'Succeed') return

            close()
            message.success(
              intl.formatMessage(
                { id: 'pages.settings.user.batch.delete.success' },
                { count: UserNames.length },
              ),
            )
            this.fetchUsers()
          },
        })
  }

  componentDidMount() {
    this.fetchUsers()
  }

  render() {
    const { intl } = this.props
    const { PageNum, PageSize, totalNum, userList, createVisible } = this.state

    return (
      <>
        <div className={styles.buttonWrapper}>
          <Button type="primary" onClick={() => this.setState({ createVisible: true })}>
            {intl.formatMessage({ id: 'pages.settings.button.create.user' })}
          </Button>
          <CreateFormModal
            visible={createVisible}
            onCreate={this.onCreate}
            onCancel={() => this.setState({ createVisible: false })}
          />
        </div>
        <UsersTable
          userList={userList}
          onChangeSuccess={this.onChangeSuccess}
          onSelection={this.onSelection}
        />
        <div className={styles.usersFooter}>
          <Button size="middle" icon={<DeleteOutlined />} onClick={this.onShowDeleteBatch}>
            {intl.formatMessage({ id: 'pages.settings.button.batch.delete' })}
          </Button>
          <Pagination
            showQuickJumper
            showSizeChanger
            current={PageNum}
            pageSize={PageSize}
            total={totalNum}
            pageSizeOptions={[10, 20]}
            onChange={(page, pageSize) => {
              this.setState(
                {
                  PageNum: page,
                  PageSize: pageSize,
                },
                () => this.fetchUsers(),
              )
            }}
          />
        </div>
      </>
    )
  }
}

export default injectIntl(UsersManagement)
