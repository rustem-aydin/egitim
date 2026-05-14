'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Image,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileAudio,
  FileVideo,
  File,
  ExternalLink,
} from 'lucide-react'
import { Media } from '@/payload-types'
import { formatFileSize } from '@/lib/helpers'

// Dosya uzantısına göre ikon seçimi
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  const iconMap: Record<string, React.ReactNode> = {
    jpg: <Image className="w-10 h-10 text-purple-500" />,
    jpeg: <Image className="w-10 h-10 text-purple-500" />,
    png: <Image className="w-10 h-10 text-purple-500" />,
    gif: <Image className="w-10 h-10 text-purple-500" />,
    svg: <Image className="w-10 h-10 text-purple-500" />,
    webp: <Image className="w-10 h-10 text-purple-500" />,

    pdf: <FileText className="w-10 h-10 text-red-500" />,
    doc: <FileText className="w-10 h-10 text-blue-600" />,
    docx: <FileText className="w-10 h-10 text-blue-600" />,
    txt: <FileText className="w-10 h-10 text-gray-600" />,
    rtf: <FileText className="w-10 h-10 text-gray-600" />,

    xls: <FileSpreadsheet className="w-10 h-10 text-green-600" />,
    xlsx: <FileSpreadsheet className="w-10 h-10 text-green-600" />,
    csv: <FileSpreadsheet className="w-10 h-10 text-green-600" />,

    js: <FileCode className="w-10 h-10 text-yellow-500" />,
    jsx: <FileCode className="w-10 h-10 text-yellow-500" />,
    ts: <FileCode className="w-10 h-10 text-blue-500" />,
    tsx: <FileCode className="w-10 h-10 text-blue-500" />,
    html: <FileCode className="w-10 h-10 text-orange-500" />,
    css: <FileCode className="w-10 h-10 text-blue-400" />,
    json: <FileCode className="w-10 h-10 text-gray-500" />,

    zip: <FileArchive className="w-10 h-10 text-yellow-600" />,
    rar: <FileArchive className="w-10 h-10 text-yellow-600" />,
    '7z': <FileArchive className="w-10 h-10 text-yellow-600" />,
    tar: <FileArchive className="w-10 h-10 text-yellow-600" />,
    gz: <FileArchive className="w-10 h-10 text-yellow-600" />,

    mp3: <FileAudio className="w-10 h-10 text-pink-500" />,
    wav: <FileAudio className="w-10 h-10 text-pink-500" />,
    ogg: <FileAudio className="w-10 h-10 text-pink-500" />,

    mp4: <FileVideo className="w-10 h-10 text-red-400" />,
    avi: <FileVideo className="w-10 h-10 text-red-400" />,
    mov: <FileVideo className="w-10 h-10 text-red-400" />,
    mkv: <FileVideo className="w-10 h-10 text-red-400" />,
  }

  return iconMap[extension] || <File className="w-10 h-10 text-gray-400" />
}

const FileCard = ({ file }: { file: Media }) => {
  const handleOpen = () => {
    window.open(file.url as string, '_blank')
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200 p-2 px-0 border border-border hover:border-gray-300">
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{getFileIcon(file.filename as string)}</div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate" title={file.filename as string}>
              {file.filename as string}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{formatFileSize(file?.filesize || 0)}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpen}
            className="flex-shrink-0 h-8 w-8 hover:bg-gray-100"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface FileListProps {
  files: Media[]
  title?: string
}

export const FileList: React.FC<FileListProps> = ({ files, title = 'Dosyalar' }) => {
  if (!files || files.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
            <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <File className="w-10 h-10  opacity-40" />
          <p className="text-sm font-medium text-gray-500">Henüz dosya bulunmuyor</p>
          <p className="text-xs text-gray-400 mt-1">Dosya eklendikten sonra burada görünecek</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 ">
        <div className="flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0">
        <div className="grid gap-2">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
