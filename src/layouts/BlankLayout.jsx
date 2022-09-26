import React, { useEffect } from 'react'
import { Inspector } from 'react-dev-inspector'
import { initTheme } from '@/utils/utils'

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment

const Layout = ({ children }) => {
  useEffect(() => {
    initTheme()
  }, [])

  return <InspectorWrapper>{children}</InspectorWrapper>
}

export default Layout
