import React, { useEffect, useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadRequestOption } from 'rc-upload/lib/interface.d'
import Cropper from '../Cropper'
// import 'antd/es/slider/style'

const getBase64ByFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

type FileItem =
  | {
      uid: string
      name: string
      url: string
      status: string
    }
  | UploadFile<any>
  | File
  | Blob
type Val = FileItem | FileItem[]
type Value = Val | string | string[]
type Props = {
  value?: Value
  onChange?: (value?: Value) => void
  isMultiple?: boolean
  limit?: number
  crop?: boolean
  cropGif?: boolean
}
interface UploadImg {
  (props: Props): JSX.Element | null
}

const UploadImg: UploadImg = ({ value, isMultiple = false, crop = false, cropGif, limit = 4, onChange }) => {
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [preview, setPreview] = useState({
    previewImage: '',
    previewVisible: false,
    previewTitle: ''
  })
  const handleChange = ({ fileList }: UploadChangeParam<UploadFile<any>>) => {
    setFileList(fileList)
    const files = fileList.map((file) => {
      if (Object.prototype.toString.call(file) === '[object String]') {
        return file.url
      } else {
        return file
      }
    })
    if (!isMultiple) {
      onChange && onChange(files[0])
    } else {
      onChange && onChange(files as any[])
    }
  }
  // 预览
  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url) {
      file.url = await getBase64ByFile(file.originFileObj as File)
    }
    setPreview({
      previewImage: file.url,
      previewVisible: true,
      previewTitle: file.name
    })
  }
  // beforeUpload传false,没法更新裁剪的图片，因为beforeUpload检测到false直接引用的源文件，所以修改customRequest
  const customRequest = (opts: UploadRequestOption<any>) => {
    const { onSuccess, file } = opts
    onSuccess && onSuccess({}, file as any)
  }
  useEffect(() => {
    if (!value) return
    let index = 0
    const format = (val: FileItem | string): FileItem => {
      if (typeof val === 'string') {
        const name = val.substring(val.lastIndexOf('/') + 1, val.length)
        return {
          uid: ++index + '',
          url: val,
          name,
          status: 'done'
        }
      } else {
        return val
      }
    }
    if (Array.isArray(value)) {
      setFileList(
        value.map((item: FileItem | string) => {
          return format(item)
        })
      )
    } else {
      setFileList([format(value)])
    }
  }, [value])
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: '8px' }}>Upload</div>
    </div>
  )
  const dom = (
    <Upload
      listType="picture-card"
      fileList={fileList as UploadFile<any>[]}
      onChange={handleChange}
      onPreview={handlePreview}
      maxCount={limit}
      multiple={isMultiple}
      customRequest={customRequest}
    >
      {(!isMultiple && fileList.length === 1) || (isMultiple && fileList.length >= limit) ? null : uploadButton}
    </Upload>
  )
  return (
    <>
      {crop ? (
        <Cropper cropGif={cropGif}>
          {dom}
        </Cropper>
      ) : (
        dom
      )}
      <Modal
        visible={preview.previewVisible}
        title={preview.previewTitle}
        footer={null}
        onCancel={() => setPreview((prev) => ({ ...prev, previewVisible: false }))}
      >
        <img className="preview-img" style={{ width: '100%' }} src={preview.previewImage} />
      </Modal>
    </>
  )
}

export default UploadImg
