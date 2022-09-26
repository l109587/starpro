import { getIntl } from 'umi'

const intl = getIntl()

export const SeverityOptions = [
  { value: 'High', label: intl.formatMessage({ id: 'pages.issues.risk.high' }) },
  { value: 'Medium', label: intl.formatMessage({ id: 'pages.issues.risk.medium' }) },
  { value: 'Low', label: intl.formatMessage({ id: 'pages.issues.risk.low' }) },
  { value: 'Info', label: intl.formatMessage({ id: 'pages.issues.risk.info' }) },
]
export const CategoryOptions = [
  { value: 'web_attack', label: 'Web攻击' },
  { value: 'data_risk', label: '数据风险' },
  { value: 'custom', label: '自定义' },
]
export const ConfidencesOptions = [
  { value: 'Certain', label: intl.formatMessage({ id: 'pages.issues.confidences.certain' }) },
  { value: 'Tentative', label: intl.formatMessage({ id: 'pages.issues.confidences.tentative' }) },
  { value: 'Firm', label: intl.formatMessage({ id: 'pages.issues.confidences.firm' }) },
]
export const StatusOptions = [
  { value: 'Undisposed', label: intl.formatMessage({ id: 'pages.issues.status.unprocessed' }) },
  { value: 'Disposed', label: '手动处理' },
  { value: 'Ignored', label: intl.formatMessage({ id: 'pages.issues.status.ignored' }) },
  { value: 'FalsePositive', label: intl.formatMessage({ id: 'pages.issues.status.falsealarm' }) },
  { value: 'Whited', label: '加白名单' },
]

export const SeverityMap = {
  High: intl.formatMessage({ id: 'pages.issues.risk.high' }),
  Medium: intl.formatMessage({ id: 'pages.issues.risk.medium' }),
  Low: intl.formatMessage({ id: 'pages.issues.risk.low' }),
  Info: intl.formatMessage({ id: 'pages.issues.risk.info' }),
}

export const StatusMap = {
  Undisposed: intl.formatMessage({ id: 'pages.issues.status.unprocessed' }),
  Disposed: '手动处理',
  Ignored: intl.formatMessage({ id: 'pages.issues.status.ignored' }),
  FalsePositive: intl.formatMessage({ id: 'pages.issues.status.falsealarm' }),
  Whited: '加白名单',
}

export const CategoryMap = {
  web_attack: intl.formatMessage({ id: 'pages.issues.vul.type.web.attack' }),
  data_risk: intl.formatMessage({ id: 'pages.issues.vul.type.data.risk' }),
  custom: '自定义',
}

export const ConfidenceMap = {
  Certain: intl.formatMessage({ id: 'pages.issues.confidences.certain' }),
  Firm: intl.formatMessage({ id: 'pages.issues.confidences.firm' }),
  Tentative: intl.formatMessage({ id: 'pages.issues.confidences.tentative' }),
}

export const PermissionMap = {
  Guest: [
    '/',
    '/assets/api',
    '/assets/api/app',
    '/assets/portraits',
    '/assets/portraits/api',
    '/assets/portraits/ip',
    '/data/classify',
    '/threat/secure',
    '/operate/sourcing',
    '/operate/push',
    '/personal',
  ],
  Admin: [
    '/',
    '/assets/api',
    '/assets/api/app',
    '/assets/portraits',
    '/assets/portraits/api',
    '/assets/portraits/ip',
    '/data/classify',
    '/threat/secure',
    '/operate/sourcing',
    '/operate/push',
    '/operate/systemOperationLog',
    '/config/strategy',
    '/config/setting',
    '/personal',
  ],
  Auditor: ['/operate/systemOperationLog', '/personal'],
}

export const fieldOptions = [
  { value: 'src_host', label: '源IP (src_host)' },
  { value: 'src_port', label: '源端口 (src_port)' },
  { value: 'dst_host', label: '目的IP (dst_host)' },
  { value: 'dst_port', label: '目的端口 (dst_port)' },
  { value: 'url', label: '请求URL (url)' },
  { value: 'req_method', label: '请求方法 (req_method)' },
  { value: 'req_path', label: '请求URL Path (req_path)' },
  { value: 'req_query', label: '请求URL Query (req_query)' },
  { value: 'req_headers', label: '请求Headers全文 (req_headers)' },
  { value: 'req_body', label: '请求Body全文 (req_body)' },
  { value: 'req_raw_ascii', label: '请求报文全文 (req_raw_ascii)' },
  { value: 'resp_status_code', label: '响应码 (resp_status_code)' },
  { value: 'resp_headers', label: '响应Headers全文 (resp_headers)' },
  { value: 'resp_body', label: '响应Body全文 (resp_body)' },
  { value: 'resp_raw_ascii', label: '响应报文全文 (resp_raw_ascii)' },
]

export const actions = [
  {
    value: '==',
    label: '相等 (==)',
  },
  {
    value: '<',
    label: '小于 (<)',
  },
  {
    value: '>',
    label: '大于 (>)',
  },
  {
    value: '<=',
    label: '小于等于 (<=)',
  },
  {
    value: '>=',
    label: '大于等于 (>=)',
  },
  {
    value: 'match',
    label: '正则匹配 (match)',
  },
  {
    value: 'contains',
    label: '包含 (contains)',
  },
]

// 这个值不要动!
export const esIndex = 'elastic_index_placeholder'

export const esPort = '5601'
