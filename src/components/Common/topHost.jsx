import numeral from 'numeral'
import styles from './topHost.less'

const TopHosts = (props) => {
  // hostName, value为接口定义的key值，默认为 Host Count
  const { title = 'Top', topListData = [], hostName = 'Host', value = 'Count' } = props
  return (
    <div className={styles.topbox}>
      <div className={styles.trendTitle}>{title}</div>
      <ul className={styles.topList}>
        {topListData.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>
            <span className={`${styles.topItemNumber} ${i < 3 ? styles.active : ''}`}>{i + 1}</span>
            <span className={styles.topItemTitle}>{item[hostName]}</span>
            <span className={styles.topItemValue}>{numeral(item[value]).format('0,0')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopHosts
