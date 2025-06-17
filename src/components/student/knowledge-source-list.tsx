'use client'

import { useState, useEffect } from 'react'
import { API_BASE_URL, getAuthHeader } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Eye, Download } from 'lucide-react'

type KnowledgeItem = {
  id: number
  title: string
  file_type: 'document' | 'image' | 'audio'
  file_name?: string
  file_url?: string
  status: 'processing' | 'completed' | 'failed'
  created_at: string
}

type KnowledgeResponse = {
  items: KnowledgeItem[]
  total: number
}

export function KnowledgeSourceList() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const limit = 10
  const [isPreviewLoading, setIsPreviewLoading] = useState<number | null>(null)

  const fetchKnowledgeItems = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const headers = getAuthHeader() as Record<string, string>
      
      const response = await fetch(`${API_BASE_URL}/knowledge/?skip=${page * limit}&limit=${limit}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch knowledge items')
      }

      const data = await response.json() as KnowledgeResponse
      setKnowledgeItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviewKnowledge = async (id: number) => {
    setIsPreviewLoading(id)
    setError(null)

    try {
      const headers = getAuthHeader() as Record<string, string>
      
      // Pertama ambil metadata file
      const response = await fetch(`${API_BASE_URL}/knowledge/preview/${id}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to preview knowledge item')
      }

      const data = await response.json()
      
      // Kemudian unduh file secara langsung
      const fileResponse = await fetch(`${API_BASE_URL}/knowledge/file/${id}`, {
        headers,
      })
      
      if (!fileResponse.ok) {
        throw new Error('Failed to download file for preview')
      }
      
      // Dapatkan blob dari file
      const fileBlob = await fileResponse.blob()
      const fileUrl = URL.createObjectURL(fileBlob)
      
      // Open preview in new tab
      const previewWindow = window.open('', '_blank')
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head>
              <title>${data.title} - Preview</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f8f9fa;
                  padding: 0;
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  min-height: 100vh;
                  overflow-x: hidden;
                }

                .header {
                  background-color: #4338ca;
                  color: white;
                  padding: 1rem;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  position: sticky;
                  top: 0;
                  z-index: 10;
                  width: 100%;
                }

                .container {
                  max-width: 100%;
                  margin: 0 auto;
                  padding: 0.75rem;
                  width: 100%;
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                }

                .header h1 {
                  margin: 0;
                  font-size: 1.25rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .header-info {
                  font-size: 0.75rem;
                  opacity: 0.9;
                }

                .info-card {
                  background-color: white;
                  border-radius: 8px;
                  padding: 0.75rem;
                  margin-bottom: 0.75rem;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                  width: 100%;
                }

                .info-item {
                  flex: 1;
                  min-width: 100%;
                }

                .info-label {
                  font-weight: 500;
                  color: #6b7280;
                  font-size: 0.75rem;
                  margin-bottom: 0.125rem;
                }

                .info-value {
                  font-size: 0.875rem;
                  word-break: break-word;
                }

                .preview-container {
                  flex: 1;
                  background-color: white;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                  display: flex;
                  flex-direction: column;
                  height: calc(100vh - 180px);
                  min-height: 300px;
                  width: 100%;
                }

                .preview-container img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                  margin: auto;
                  display: block;
                }

                .preview-container embed, 
                .preview-container iframe {
                  width: 100%;
                  height: 100%;
                  border: none;
                }

                .preview-container audio {
                  width: 90%;
                  margin: 2rem auto;
                  display: block;
                }

                .download-btn {
                  display: inline-block;
                  background-color: #4338ca;
                  color: white;
                  padding: 0.5rem 1rem;
                  border-radius: 4px;
                  text-decoration: none;
                  font-weight: 500;
                  margin-top: 1rem;
                  border: none;
                  cursor: pointer;
                  font-size: 0.875rem;
                  text-align: center;
                  width: auto;
                  max-width: 100%;
                }

                .download-btn:hover {
                  background-color: #3730a3;
                }

                /* Message for unsupported files */
                .unsupported-message {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                  padding: 1rem;
                  text-align: center;
                }

                .file-icon {
                  font-size: 3rem;
                  margin-bottom: 0.75rem;
                }

                @media (prefers-color-scheme: dark) {
                  body {
                    background-color: #111827;
                    color: #e5e7eb;
                  }
                  
                  .header {
                    background-color: #312e81;
                  }
                  
                  .info-card {
                    background-color: #1f2937;
                  }
                  
                  .preview-container {
                    background-color: #1f2937;
                  }
                  
                  .info-label {
                    color: #9ca3af;
                  }
                  
                  .download-btn {
                    background-color: #4f46e5;
                  }
                  
                  .download-btn:hover {
                    background-color: #4338ca;
                  }
                }

                @media (min-width: 640px) {
                  .container {
                    max-width: 1200px;
                    padding: 1rem;
                  }
                  
                  .header h1 {
                    font-size: 1.5rem;
                  }
                  
                  .header-info {
                    font-size: 0.875rem;
                  }
                  
                  .info-card {
                    padding: 1rem;
                    margin-bottom: 1rem;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 1rem;
                  }
                  
                  .info-item {
                    min-width: 200px;
                  }
                  
                  .info-label {
                    font-size: 0.875rem;
                    margin-bottom: 0.25rem;
                  }
                  
                  .info-value {
                    font-size: 1rem;
                  }
                  
                  .preview-container {
                    height: calc(100vh - 200px);
                    min-height: 400px;
                  }
                  
                  .download-btn {
                    font-size: 1rem;
                  }
                  
                  .file-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                  }
                  
                  .unsupported-message {
                    padding: 2rem;
                  }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${data.title}</h1>
                <div class="header-info">Knowledge Preview</div>
              </div>
              
              <div class="container">
                <div class="info-card">
                  <div class="info-item">
                    <div class="info-label">File Name</div>
                    <div class="info-value">${data.file_name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">File Type</div>
                    <div class="info-value">${data.file_type}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Created At</div>
                    <div class="info-value">${new Date(data.created_at).toLocaleString()}</div>
                  </div>
                </div>
                
                <div class="preview-container">
                  ${data.file_type === 'document' && data.file_name.toLowerCase().endsWith('.pdf') 
                    ? `<embed src="${fileUrl}" type="application/pdf" />`
                    : data.file_type === 'document' && (data.file_name.toLowerCase().endsWith('.docx') || data.file_name.toLowerCase().endsWith('.doc'))
                      ? `<div id="docx-preview" style="padding: 1rem; height: 100%; overflow-y: auto; background-color: white; color: black;">
                          <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 1.2rem; margin-bottom: 1rem;">Loading DOCX preview...</div>
                            <div style="font-size: 0.9rem; color: #666;">Please wait while we process your document</div>
                          </div>
                        </div>`
                      : data.file_type === 'document' && data.file_name.toLowerCase().endsWith('.txt')
                        ? `<div id="txt-preview" style="padding: 1rem; height: 100%; overflow-y: auto; background-color: white; color: black;">
                            <div style="text-align: center; padding: 2rem;">
                              <div style="font-size: 1.2rem; margin-bottom: 1rem;">Loading TXT preview...</div>
                              <div style="font-size: 0.9rem; color: #666;">Please wait while we load your text file</div>
                            </div>
                          </div>`
                        : data.file_type === 'image' 
                          ? `<img src="${fileUrl}" alt="${data.title}" />`
                          : data.file_type === 'audio' 
                            ? `<div style="display:flex; align-items:center; justify-content:center; height:100%;">
                                <audio controls src="${fileUrl}">Your browser does not support audio playback.</audio>
                               </div>`
                            : `<div class="unsupported-message">
                                <div class="file-icon">📄</div>
                                <p>Preview is not available for this file type.</p>
                                <a href="${fileUrl}" download="${data.file_name}" class="download-btn">Download File</a>
                               </div>`
                  }
                </div>
              </div>
              
              <script src="https://unpkg.com/mammoth@1.4.2/mammoth.browser.min.js"></script>
              <script>
                // Handle DOCX preview
                async function loadDocxPreview() {
                  const docxContainer = document.getElementById('docx-preview');
                  if (docxContainer && '${data.file_name}'.toLowerCase().match(/\\.(docx|doc)$/)) {
                    try {
                      const response = await fetch('${fileUrl}');
                      const arrayBuffer = await response.arrayBuffer();
                      
                      const result = await mammoth.convertToHtml({arrayBuffer: arrayBuffer});
                      docxContainer.innerHTML = \`
                        <div style="max-width: 800px; margin: 0 auto; padding: 1rem; line-height: 1.6; font-family: 'Times New Roman', serif; background-color: white; color: black;">
                          \${result.value}
                        </div>
                      \`;
                      
                      if (result.messages && result.messages.length > 0) {
                        console.warn('DOCX conversion warnings:', result.messages);
                      }
                    } catch (error) {
                      console.error('Error loading DOCX:', error);
                      docxContainer.innerHTML = \`
                        <div style="text-align: center; padding: 2rem;">
                          <div style="font-size: 1.2rem; margin-bottom: 1rem; color: #dc3545;">Failed to load DOCX preview</div>
                          <div style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">The document format may not be supported or the file may be corrupted.</div>
                          <a href="${fileUrl}" download="${data.file_name}" style="display: inline-block; background-color: #4338ca; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-weight: 500;">Download File</a>
                        </div>
                      \`;
                    }
                  }
                }

                // Handle TXT preview
                async function loadTxtPreview() {
                  const txtContainer = document.getElementById('txt-preview');
                  if (txtContainer && '${data.file_name}'.toLowerCase().endsWith('.txt')) {
                    try {
                      const response = await fetch('${fileUrl}');
                      const text = await response.text();
                      
                      txtContainer.innerHTML = \`
                        <div style="max-width: 800px; margin: 0 auto; padding: 1rem; font-family: 'Courier New', monospace; white-space: pre-wrap; line-height: 1.5; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; color: black;">
                          \${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                        </div>
                      \`;
                    } catch (error) {
                      console.error('Error loading TXT:', error);
                      txtContainer.innerHTML = \`
                        <div style="text-align: center; padding: 2rem;">
                          <div style="font-size: 1.2rem; margin-bottom: 1rem; color: #dc3545;">Failed to load TXT preview</div>
                          <div style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">The text file may not be accessible or the file may be corrupted.</div>
                          <a href="${fileUrl}" download="${data.file_name}" style="display: inline-block; background-color: #4338ca; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-weight: 500;">Download File</a>
                        </div>
                      \`;
                    }
                  }
                }

                // Handle window resize for PDF viewers
                function adjustPdfHeight() {
                  const container = document.querySelector('.preview-container');
                  if (container) {
                    const viewportHeight = window.innerHeight;
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const infoCardHeight = document.querySelector('.info-card').offsetHeight;
                    const containerPadding = 32; // 1rem top + 1rem bottom on desktop
                    
                    // Adjust height calculation based on screen size
                    const isMobile = window.innerWidth < 640;
                    const paddingValue = isMobile ? 24 : 32; // 0.75rem vs 1rem padding
                    
                    container.style.height = (viewportHeight - headerHeight - infoCardHeight - paddingValue) + 'px';
                  }
                }
                
                // Make sure audio controls are visible on mobile
                function adjustAudioControls() {
                  const audioElement = document.querySelector('audio');
                  if (audioElement) {
                    if (window.innerWidth < 640) {
                      audioElement.style.width = '90%';
                    } else {
                      audioElement.style.width = '100%';
                    }
                  }
                }
                
                // Adjust document title to prevent overflow on small screens
                function adjustDocTitle() {
                  const titleElement = document.querySelector('.header h1');
                  if (titleElement && window.innerWidth < 640) {
                    const title = titleElement.textContent;
                    if (title && title.length > 30) {
                      titleElement.textContent = title.substring(0, 27) + '...';
                      titleElement.title = title; // Add full title as tooltip
                    }
                  }
                }
                
                // Run all adjustments
                function handleResize() {
                  adjustPdfHeight();
                  adjustAudioControls();
                  adjustDocTitle();
                }
                
                window.addEventListener('resize', handleResize);
                window.addEventListener('load', function() {
                  handleResize();
                  loadDocxPreview();
                  loadTxtPreview();
                });
                
                // Initial run
                handleResize();
                loadDocxPreview();
                loadTxtPreview();
              </script>
            </body>
          </html>
        `)
        previewWindow.document.close()
        
        // Cleanup the blob URL when window is closed
        previewWindow.onunload = () => {
          URL.revokeObjectURL(fileUrl)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview knowledge item')
    } finally {
      setIsPreviewLoading(null)
    }
  }

  const handleDownloadKnowledge = async (id: number, title: string) => {
    try {
      const headers = getAuthHeader() as Record<string, string>
      
      // Create a temporary anchor element
      const link = document.createElement('a')
      link.href = `${API_BASE_URL}/knowledge/file/${id}`
      link.target = '_blank'
      link.download = title
      
      // Append required headers to the download URL
      if (headers.Authorization) {
        // Use fetch with blob response for proper authorized download
        const response = await fetch(`${API_BASE_URL}/knowledge/file/${id}`, {
          headers,
        })
        
        if (!response.ok) {
          throw new Error('Failed to download file')
        }
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url)
      } else {
        link.click()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download knowledge item')
    }
  }

  useEffect(() => {
    fetchKnowledgeItems()
  }, [page])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return '📄'
      case 'image':
        return '🖼️'
      case 'audio':
        return '🎤'
      default:
        return '📄'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-[10px] sm:text-xs">Processing</span>
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-[10px] sm:text-xs">Completed</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-[10px] sm:text-xs">Failed</span>
      default:
        return <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-[10px] sm:text-xs">{status}</span>
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold">Knowledge Sources</h2>
        <Button 
          onClick={fetchKnowledgeItems} 
          disabled={isLoading}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-destructive/10 text-destructive text-xs sm:text-sm rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-foreground">Loading knowledge sources...</div>
      ) : knowledgeItems.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground">
          No knowledge sources found.
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {knowledgeItems.map((item) => (
            <div 
              key={item.id} 
              className="border border-border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="text-xl sm:text-2xl">{getTypeIcon(item.file_type)}</div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base text-foreground truncate max-w-[180px] sm:max-w-md">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                      <span>Type: {item.file_type}</span>
                      <span>Created: {formatDate(item.created_at)}</span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handlePreviewKnowledge(item.id)}
                    disabled={isPreviewLoading === item.id}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    title="Preview knowledge"
                  >
                    {isPreviewLoading === item.id ? (
                      <span className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDownloadKnowledge(item.id, item.title)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    title="Download knowledge"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-between items-center mt-4 sm:mt-6 text-xs sm:text-sm">
          <Button 
            onClick={() => setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0 || isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm text-foreground">
            Page {page + 1} of {Math.ceil(total / limit)}
          </span>
          <Button 
            onClick={() => setPage(p => p + 1)} 
            disabled={(page + 1) * limit >= total || isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 