import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { InboxOutlined } from '@ant-design/icons'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void | Promise<void>
  disabled?: boolean
}

/**
 * Drag-and-drop file upload zone component
 * Accepts JSON files only, displays visual feedback during drag operations
 */
export function FileUploadZone({ onFileSelect, disabled }: FileUploadZoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      style={{
        padding: 40,
        textAlign: 'center',
        background: isDragActive ? '#e6f7ff' : '#fafafa',
        border: `2px dashed ${isDragActive ? '#1890ff' : '#d9d9d9'}`,
        borderRadius: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />
      <InboxOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
      <p style={{ fontSize: 16, marginBottom: 4 }}>
        {isDragActive ? 'Drop JSON file here' : 'Drag & drop JSON file here'}
      </p>
      <p style={{ fontSize: 14, color: '#8c8c8c' }}>or click to browse</p>
    </div>
  )
}

