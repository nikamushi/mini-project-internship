import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import { Upload, X } from 'lucide-react'
import { ALLOWED_IMAGE_TYPES, IMAGE_MAX_SIZE_MB } from '@/config/env'
import './FileUpload.css'

export interface FileUploadProps {
  id: string
  label: string
  hint?: string
  accept?: string
  multiple?: boolean
  files: File[]
  onChange: (files: File[]) => void
  maxSizeMB?: number
  error?: string
  disabled?: boolean
  className?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  id,
  label,
  hint,
  accept,
  multiple = false,
  files,
  onChange,
  maxSizeMB = IMAGE_MAX_SIZE_MB,
  error,
  disabled = false,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalError, setInternalError] = useState<string | null>(null)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInternalError(null)
      const selected = Array.from(event.target.files ?? [])
      event.target.value = ''
      if (selected.length === 0) return

      const tooLarge = selected.find((file) => file.size > maxSizeMB * 1024 * 1024)
      if (tooLarge) {
        setInternalError(`Ukuran file melebihi batas maksimum ${maxSizeMB} MB.`)
        return
      }

      const wrongType = selected.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type))
      if (wrongType) {
        setInternalError(`Tipe file tidak didukung: ${wrongType.name}.`)
        return
      }

      onChange(multiple ? [...files, ...selected] : selected)
    },
    [files, maxSizeMB, multiple, onChange],
  )

  const removeFile = useCallback(
    (index: number) => {
      const next = files.filter((_, i) => i !== index)
      onChange(next)
    },
    [files, onChange],
  )

  return (
    <div className={['lc-upload', className ?? ''].join(' ').trim()}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="visually-hidden"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
      />
      <button
        type="button"
        className="lc-upload__dropzone"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <span className="lc-upload__icon" aria-hidden="true">
          <Upload size={20} />
        </span>
        <span className="lc-upload__label">{label}</span>
        {hint ? <span className="lc-upload__hint">{hint}</span> : null}
      </button>
      {internalError ? <p className="lc-upload__error">{internalError}</p> : null}
      {error ? <p className="lc-upload__error">{error}</p> : null}
      {files.length > 0 ? (
        <ul className="lc-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="lc-upload__item">
              <span className="lc-upload__name">{file.name}</span>
              <span className="lc-upload__size">{formatSize(file.size)}</span>
              <button
                type="button"
                className="lc-upload__remove"
                aria-label={`Hapus ${file.name}`}
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
