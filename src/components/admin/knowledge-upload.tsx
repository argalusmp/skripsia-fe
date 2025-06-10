'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { API_BASE_URL, getAuthHeader } from '@/lib/utils'

const MAX_FILE_SIZE_MB = 10;

export function KnowledgeUpload() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'document' | 'image' | 'audio'>('document')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size should not exceed ${MAX_FILE_SIZE_MB}MB`)
        setFile(null)
        return
      }
      setFile(selectedFile)
      
      // Auto-detect file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || ''
      if (['pdf', 'docx', 'doc', 'txt'].includes(fileExtension)) {
        setFileType('document')
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        setFileType('image')
      } else if (['mp3', 'wav', 'm4a'].includes(fileExtension)) {
        setFileType('audio')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!file) {
      setError('Please select a file to upload')
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    try {
      const headers = getAuthHeader() as Record<string, string>
      // Remove Content-Type and let the browser set it with the correct boundary for FormData
      delete headers['Content-Type']
      
      const response = await fetch(`${API_BASE_URL}/knowledge/upload`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to upload knowledge')
      }

      const data = await response.json()
      setSuccess(`Knowledge uploaded successfully! Status: ${data.status}`)
      
      // Reset form
      setTitle('')
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Upload Knowledge</h2>

      {error && (
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-destructive/10 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter knowledge title"
            className="text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
            Upload File (PDF, DOCX, JPG, PNG, MP3, WAV, M4A)
          </label>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Maximum file size: 10MB</p>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.jpg,.jpeg,.png,.mp3,.wav,.ogg,.m4a"
            className="text-sm"
            required
          />
          {file && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full text-xs sm:text-sm mt-2" 
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Knowledge'}
        </Button>
      </form>
    </div>
  )
} 