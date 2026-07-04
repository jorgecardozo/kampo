// Libraries
import { useState } from 'react'
import { toast } from 'react-toastify'

// Store
import { useActions } from 'store/actions'

// Utils
import { hasErrorResponse } from 'lib/utils/helpers'
import { BLOB_CSV_TYPE, FILENAMES, UPLOAD_TYPE } from 'lib/utils/constants'

const MAX_SIZE_FILE_UPLOAD = 4

export const useFiles = () => {
  const [files, setFiles] = useState([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [errorFile, setErrorFile] = useState({
    error: false,
    message: '',
    filesNames: [],
  })
  const {
    uploadDocumentPointsOfSales,
    uploadDocumentUsers,
    downloadDocumentPointOfSale,
    downloadDocumentUser,
  } = useActions()

  const addFiles = async (fileList, type) => {
    if (fileList && fileList.length > 0) {
      await uploadFiles(Array.from(fileList), type)
    }
  }

  const onUploadFiles = (filesToUpload, type) => {
    return filesToUpload.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response =
        type === UPLOAD_TYPE.POINTS_OF_SALES
          ? await uploadDocumentPointsOfSales({ data: formData })
          : await uploadDocumentUsers({ data: formData })

      const statusCode = response.statusCode ? response.statusCode : null

      if (statusCode) {
        toast.error('Error al cargar el archivo.', { theme: 'colored' })
      } else {
        toast.success('El archivo se cargó exitosamente.', { theme: 'colored' })
      }

      return {
        file,
        documentId: statusCode,
        error: hasErrorResponse(response) ? true : null,
        isLoading: false,
        isNew: true,
        isChecked: true,
      }
    })
  }

  const filesFilterByError = (filesToFilter) =>
    filesToFilter.filter((item) => !item.error)

  const filesFilterBySize = (filesToFilter) => {
    return filesToFilter.filter((file) => {
      const { size } = file
      const fileMb = size / 1024 ** 2
      if (fileMb <= MAX_SIZE_FILE_UPLOAD) return file

      setErrorFile({
        error: true,
        message: `Los siguientes archivos pesan mas de ${MAX_SIZE_FILE_UPLOAD} mb`,
        filesNames: [...errorFile.filesNames, file.name],
      })
    })
  }

  const uploadFiles = async (fileList, type) => {
    setIsLoadingFiles(true)
    setErrorFile({
      error: false,
      message: '',
      filesNames: [],
    })
    const previusFiles = [...files]

    // Files larger than 4mb are not allowed
    const filteredNewFiles = filesFilterBySize(fileList)

    // Here we show a indicator for each new file
    const newFiles = []
    filteredNewFiles.forEach((file) => {
      newFiles.push({
        file,
        isLoading: true,
        id: null,
        error: null,
        isNew: true,
        isChecked: true,
      })
    })

    setFiles([...previusFiles, ...newFiles])

    const uploadPromises = onUploadFiles(filteredNewFiles, type)

    // Waiting for all files to load until continue
    const uploadedFiles = await Promise.all(uploadPromises)

    const uploadedFilesFiltered = filesFilterByError(uploadedFiles)

    setFiles([...previusFiles, ...uploadedFilesFiltered])

    setIsLoadingFiles(false)
  }

  const downloadFile = async (type) => {
    const blob =
      type === UPLOAD_TYPE.POINTS_OF_SALES
        ? await downloadDocumentPointOfSale()
        : await downloadDocumentUser()

    const url = window.URL.createObjectURL(
      new Blob([blob], { type: BLOB_CSV_TYPE })
    )
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      type === UPLOAD_TYPE.POINTS_OF_SALES
        ? FILENAMES.POINTS_OF_SALES
        : FILENAMES.USERS
    )

    // Append to html link element page
    document.body.appendChild(link)

    // Start download
    link.click()

    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  const downloadBlobFile = async (blob: Blob, type: string, name: string) => {
    try {
      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: type,
        })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)

      // Append to html link element page
      document.body.appendChild(link)

      // Start download
      link.click()

      // Clean up and remove the link
      link.parentNode.removeChild(link)
    } catch (error) {
      console.log('Error', error)
    }
  }

  const downloadCSV = (data, headers, fileName) => {
    const csvData = []

    csvData.push(headers)

    data.forEach((item) => {
      csvData.push([
        item.date,
        item.field,
        item.type,
        item.success,
        item.message,
      ])
    })

    const csvContent = csvData.map((row) => row.join(';')).join('\n')

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()

    URL.revokeObjectURL(url)
  }

  return {
    files,
    addFiles,
    downloadFile,
    setFiles,
    isLoadingFiles,
    errorFile,
    downloadCSV,
    downloadBlobFile,
  }
}
