import { FileWithPreview } from '@/app/components/dropzone/types'
import Icon from '@/app/components/Icon'
import { FILE_ICON_SVG, UPLOAD_CLOUD_SVG, X_SVG } from '@/app/components/icons'
import { Button } from '@mantine/core'
import React, { useCallback, useState } from 'react'

interface DropzoneProps {
  onFilesSelected: (files: FileWithPreview[]) => void
  maxFiles?: number
  maxFileSizeMB?: number
  acceptedFileTypes?: string
}

const FileDropzone: React.FC<DropzoneProps> = ({ onFilesSelected, maxFileSizeMB = 200 }) => {
  const [isOver, setIsOver] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(false)
  }, [])

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const files = Array.from(fileList)
    let error = null

    const validFiles = files.filter((file) => {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        error = `File "${file.name}" (${formatBytes(file.size)}) exceeds ${maxFileSizeMB}MB limit.`
        return false
      }
      return true
    })

    console.log(validFiles)

    setError(error)

    if (validFiles.length > 0) {
      // const updatedFiles = [...selectedFiles, ...validFiles].slice(0, 10) // limit to 10 files
      setSelectedFiles(validFiles)
      onFilesSelected(validFiles)
    }
  }

  const removeFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter((f) => f.name !== fileName)
    setSelectedFiles(updatedFiles)
    onFilesSelected(updatedFiles)
    if (updatedFiles.length === 0) setError(null)
  }

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsOver(false)
      processFiles(event.dataTransfer.files)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFilesSelected, processFiles],
  )

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes == 0) return '0 bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files)
    event.target.value = ''
  }

  return (
    <div className="mb-6 md:w-9/12 px-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full p-6 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-150 ease-in-out ${isOver ? `border-primary bg-primary/10` : `border-border-base hover:border-secondary bg-slate-50 hover:bg-slate-100`}`}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          aria-label="File upload input"
        />
        <label htmlFor="file-upload" className="w-full text-center cursor-pointer">
          <Icon
            svgContent={UPLOAD_CLOUD_SVG}
            className={`mx-auto mb-4 ${isOver ? `text-primary` : `text-secondary`}`}
            size={48}
          />
          <p className={`text-lg font-semibold ${isOver ? `text-primary` : `text-text-base`}`}>
            Drag & drop files here, or click to select
          </p>
          <p className={`text-sm text-textMuted mt-1`}>Max 200MB per file.</p>
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-bases font-medium text-textMuted">Selected files:</h3>
          <ul className="divide-y divide-border-base border border-border-base rounded-lg overflow-hidden">
            {selectedFiles.map((file) => (
              <li
                key={file.name}
                className="px-3 py-2.5 flex items-center justify-between text-sm bg-cardBg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center min-w-0 space-x-2">
                  <Icon
                    svgContent={FILE_ICON_SVG}
                    className="text-primary flex-shrink-0"
                    size={18}
                  />
                  <span className="truncate text-text-base font-medium" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-textMuted flex-shrink-0">{formatBytes(file.size)}</span>
                </div>
                <Button
                  variant="transparent"
                  className="font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focusRing transition-all duration-150 ease-in-out inline-flex items-center justify-center whitespace-nowrap p-2.5 hover:bg-red-200"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(file.name)}
                >
                  <Icon svgContent={X_SVG} size={14} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FileDropzone
