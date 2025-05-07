'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { API_BASE_URL, getAuthHeader } from '@/lib/utils'

export function KnowledgeUpload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadType, setUploadType] = useState<'text' | 'file' | 'voice'>('text')
  const [textContent, setTextContent] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', uploadType)

    if (uploadType === 'text') {
      formData.append('content', textContent)
    } else if (uploadType === 'file' || uploadType === 'voice') {
      if (!file) {
        setError('Please select a file to upload')
        setIsLoading(false)
        return
      }
      formData.append('file', file)
    }

    try {
      const headers = getAuthHeader() as Record<string, string>
      
      const response = await fetch(`${API_BASE_URL}/knowledge/upload`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload knowledge')
      }

      setSuccess('Knowledge uploaded successfully!')
      // Reset form
      setTitle('')
      setDescription('')
      setFile(null)
      setTextContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Upload Knowledge</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-500 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="text"
                checked={uploadType === 'text'}
                onChange={() => setUploadType('text')}
                className="mr-2"
              />
              Text
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="file"
                checked={uploadType === 'file'}
                onChange={() => setUploadType('file')}
                className="mr-2"
              />
              PDF/Image
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="voice"
                checked={uploadType === 'voice'}
                onChange={() => setUploadType('voice')}
                className="mr-2"
              />
              Voice
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter knowledge title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            required
          />
        </div>

        {uploadType === 'text' ? (
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Text Content
            </label>
            <Textarea
              id="content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter knowledge content"
              required
              className="min-h-[200px]"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-1">
              {uploadType === 'file' ? 'Upload PDF/Image' : 'Upload Voice Recording'}
            </label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept={uploadType === 'file' ? ".pdf,.jpg,.jpeg,.png" : ".mp3,.wav,.ogg"}
              required
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Knowledge'}
        </Button>
      </form>
    </div>
  )
} 