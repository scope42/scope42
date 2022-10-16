import 'antd/dist/antd.css'
import 'antd-button-color/dist/css/style.css'
import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')
const root = createRoot(container!)

// We can re-enable strict mode once this is resolved:
// https://github.com/plotly/react-cytoscapejs/issues/106

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
