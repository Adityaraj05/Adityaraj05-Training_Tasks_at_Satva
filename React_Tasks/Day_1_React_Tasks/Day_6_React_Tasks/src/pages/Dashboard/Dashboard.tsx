import React from 'react'
import App from '../../components/Layout'
import styles from "./Dashboard.module.css"
export const Dashboard = () => {
    console.log(styles)
  return (
    <div className={styles.layoutWrapper}>
        <App/>
    </div>
  )
}
