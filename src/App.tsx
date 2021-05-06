import { useState } from 'react'
import { Switch } from 'antd'
import UploadImg from './components/UploadImg'
import './App.css'

function App() {
  const [value] = useState()
  const [query, setQuery] = useState({
    crop: false,
    cropGif: false
  })
  const onChange = (value: any) => {
    console.log(value)
  }
  const onChangeSwitch = (attr: 'crop' | 'cropGif' , value: boolean) => {
    setQuery((prev) => ({
      ...prev,
      [attr]: value
    }))
  }
  return (
    <div className="container">
      <Switch className="option" defaultChecked={query.crop} onChange={(val) => onChangeSwitch('crop', val)} checkedChildren="关闭裁剪" unCheckedChildren="开启裁剪"></Switch>
      <Switch className="option" defaultChecked={query.cropGif} onChange={(val) => onChangeSwitch('cropGif', val)} checkedChildren="关闭GIF裁剪" unCheckedChildren="开启GIF裁剪"></Switch>
      <UploadImg value={value} onChange={onChange} crop={query.crop} cropGif={query.cropGif} />
    </div>
  )
}

export default App
