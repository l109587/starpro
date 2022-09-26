import React from 'react'
import { Checkbox, message } from 'antd'
import { FolderOutlined, FolderOpenOutlined, FileTextOutlined } from '@ant-design/icons'
import { getBranchUrls } from '@/services/assets'
import styles from './index.less'

export default class CasMuiltySelect extends React.Component {
  state = {
    apiSelectMap: {},
    parentOptions: this.props.options.concat(),
  }

  get API_MAP() {
    const res = this.state.parentOptions.reduce((acc, i) => {
      acc[i.value] = i.children
      return acc
    }, {})

    return res
  }

  get apiParentKeys() {
    const { apiSelectMap } = this.state
    const pKeys = []
    Object.keys(apiSelectMap).forEach((key) => {
      // TODO options过滤子选项为空的情况
      if (apiSelectMap[key].length && this.API_MAP[key].length === apiSelectMap[key].length) {
        pKeys.push(key)
      }
    })

    return pKeys
  }

  onApiSelect = (val) => {
    // eslint-disable-next-line prefer-const
    let { apiSelectMap, parentOptions = [] } = this.state
    let selectVal

    if (this.apiParentKeys.length < val.length) {
      // 子选项联动
      selectVal = val.filter((i) => !this.apiParentKeys.includes(i))[0]

      // 动态获取子选项接口 - 缓存，只请求一次
      if (!this.API_MAP[selectVal].length) {
        getBranchUrls({
          Url: selectVal,
        }).then((res) => {
          if (res.Code === 'Succeed') {
            const childApis = res.Data || []

            parentOptions = parentOptions.map((i) => {
              return {
                ...i,
                showChild: i.value === selectVal ? !i.showChild : i.showChild,
                children:
                  i.value === selectVal
                    ? childApis.map((j) => {
                        return {
                          name: j.Url,
                          value: j.Url,
                          count: i.Count,
                          apiId: i.ApiId,
                        }
                      })
                    : i.children,
              }
            })

            this.setState(
              {
                parentOptions,
              },
              () => {
                apiSelectMap[selectVal] = this.API_MAP[selectVal].map((i) => i.value)
                this.setState(
                  {
                    apiSelectMap,
                  },
                  () => {
                    this.props.onChange(this.state.apiSelectMap)
                  },
                )
              },
            )
          } else {
            message.error(res.Message || '获取api错误！')
          }
        })
      } else {
        apiSelectMap[selectVal] = this.API_MAP[selectVal].map((i) => i.value)
        this.setChildOption(parentOptions, apiSelectMap, selectVal)
      }
    } else {
      selectVal = this.apiParentKeys.filter((i) => !val.includes(i))[0]
      apiSelectMap[selectVal] = []
      this.setChildOption(parentOptions, apiSelectMap, selectVal)
    }
  }

  setChildOption = (parentOptions, apiSelectMap, selectVal) => {
    // eslint-disable-next-line no-param-reassign
    parentOptions = parentOptions.map((i) => {
      return {
        ...i,
        showChild: i.value === selectVal ? !i.showChild : i.showChild,
      }
    })

    this.setState(
      {
        apiSelectMap,
        parentOptions,
      },
      () => {
        this.props.onChange(this.state.apiSelectMap)
      },
    )
  }

  render() {
    const { apiSelectMap } = this.state

    return (
      <div className={styles.muiltySelect}>
        <Checkbox.Group
          style={{ width: '100%' }}
          onChange={(val) => {
            this.onApiSelect(val)
          }}
          value={this.apiParentKeys || []}
        >
          {this.state.parentOptions.map((i, idx) => {
            return (
              <div className={styles.parentCheckboxWrap} key={i.value}>
                <Checkbox key={i.value} value={i.value} style={{ width: '100%' }}>
                  <div className={styles.flexSpace}>
                    <div>
                      {i.showChild ? (
                        <FolderOpenOutlined className={styles.fileIcon} />
                      ) : (
                        <FolderOutlined className={styles.fileIcon} />
                      )}
                      <span>{i.name}</span>
                    </div>
                    <div className={styles.pRightBadge}>{i.count}</div>
                  </div>
                  {i.showChild ? (
                    <ApiChildCheckbox
                      getApiDetail={(id) => this.props.getApiDetail(id)}
                      options={i.children}
                      value={apiSelectMap[i.value]}
                      onChange={(childVals) => {
                        apiSelectMap[i.value] = childVals

                        this.setState(
                          {
                            apiSelectMap,
                          },
                          () => {
                            this.props.onChange(this.state.apiSelectMap)
                          },
                        )
                      }}
                    />
                  ) : null}
                </Checkbox>
                <br />
              </div>
            )
          })}
        </Checkbox.Group>
      </div>
    )
  }
}

const ApiChildCheckbox = ({ options = [], value = [], onChange, getApiDetail }) => {
  const onApiChildSelect = (val) => {
    onChange(val)
  }

  return (
    <>
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(val) => {
          onApiChildSelect(val)
        }}
        value={value}
      >
        {options.map((i) => {
          return (
            <div key={i.value}>
              <Checkbox key={i.value} value={i.value} style={{ width: '100%', margin: '8px 0' }}>
                <div>
                  <FileTextOutlined className={styles.fileIcon} />
                  <span
                    onClick={() => {
                      getApiDetail(i.value)
                    }}
                  >
                    {i.name}
                  </span>
                </div>
              </Checkbox>
              <br />
            </div>
          )
        })}
      </Checkbox.Group>
    </>
  )
}
