/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { debounce } from 'lodash'

const useEchartsResize = (chart) => {
  useEffect(() => {
    const resizeHandler = debounce(() => {
      chart.current && chart.current.resize()
    }, 200)

    const sidebarResizeHandler = (e) => {
      if (e.propertyName === 'width') {
        resizeHandler()
      }
    }

    window.addEventListener('resize', resizeHandler)
    const sidebarElm = document.getElementsByClassName('ant-layout-sider')[0]
    sidebarElm && sidebarElm.addEventListener('transitionend', sidebarResizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      sidebarElm && sidebarElm.removeEventListener('transitionend', sidebarResizeHandler)
    }
  }, [])
}

export default useEchartsResize
