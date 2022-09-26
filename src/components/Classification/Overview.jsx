import { Row, Col } from 'antd'
import TotalPanel from './TotalPanel'
import TopPanel from './TopPanel'
import DistributionPanel from './DistributionPanel'
import ApiAssets from '@/components/Classification/ApiAssets'
import styles from './Overview.less'

export default function Overview({ CategoryIds, topLevelList, refreshCategories }) {
  return (
    <div>
      {CategoryIds !== '100000' && (
        <div className={styles.overviewWrap}>
          <Row gutter={24} className={styles.panelRow}>
            <Col span={8}>
              <TotalPanel CategoryIds={CategoryIds} />
            </Col>
            <Col span={8}>
              <TopPanel CategoryIds={CategoryIds} />
            </Col>
            <Col span={8}>
              <DistributionPanel CategoryIds={CategoryIds} />
            </Col>
          </Row>
        </div>
      )}
      <ApiAssets
        CategoryIds={CategoryIds}
        topLevelList={topLevelList}
        refreshCategories={refreshCategories}
      />
    </div>
  )
}
