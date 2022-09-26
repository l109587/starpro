import styles from './InfoBlock.less'

const InfoBlock = (props) => {
  const { title, children } = props

  return (
    <div className={styles.infoBlock}>
      <div className={styles.infoTitle}>{title}</div>
      <div className={styles.infoBody}>{children}</div>
    </div>
  )
}

export default InfoBlock
