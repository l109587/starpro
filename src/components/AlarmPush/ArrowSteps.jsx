import styles from './ArrowSteps.less'

const ArrowSteps = (props) => {
  const { items, ...restProps } = props

  return (
    <ul className={styles.arrowSteps} {...restProps}>
      {items.map((e) => {
        return (
          <li key={e.title} className={`${styles.stepItem} ${e.active ? styles.active : ''}`}>
            {e.title}
          </li>
        )
      })}
    </ul>
  )
}

export default ArrowSteps
