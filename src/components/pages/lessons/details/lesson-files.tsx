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

// Dosya verisi tipi
interface FileItem {
  id: string
  name: string
  size: string
  type: string
  url: string
  date?: string
}

// Dosya uzantısına göre ikon seçimi
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  const iconMap: Record<string, React.ReactNode> = {
    jpg: <Image className="w-16 h-16 text-purple-500" />,
    jpeg: <Image className="w-16 h-16 text-purple-500" />,
    png: <Image className="w-16 h-16 text-purple-500" />,
    gif: <Image className="w-16 h-16 text-purple-500" />,
    svg: <Image className="w-16 h-16 text-purple-500" />,
    webp: <Image className="w-16 h-16 text-purple-500" />,

    pdf: <FileText className="w-16 h-16 text-red-500" />,
    doc: <FileText className="w-16 h-16 text-blue-600" />,
    docx: <FileText className="w-16 h-16 text-blue-600" />,
    txt: <FileText className="w-16 h-16 text-gray-600" />,
    rtf: <FileText className="w-16 h-16 text-gray-600" />,

    xls: <FileSpreadsheet className="w-16 h-16 text-green-600" />,
    xlsx: <FileSpreadsheet className="w-16 h-16 text-green-600" />,
    csv: <FileSpreadsheet className="w-16 h-16 text-green-600" />,

    js: <FileCode className="w-16 h-16 text-yellow-500" />,
    jsx: <FileCode className="w-16 h-16 text-yellow-500" />,
    ts: <FileCode className="w-16 h-16 text-blue-500" />,
    tsx: <FileCode className="w-16 h-16 text-blue-500" />,
    html: <FileCode className="w-16 h-16 text-orange-500" />,
    css: <FileCode className="w-16 h-16 text-blue-400" />,
    json: <FileCode className="w-16 h-16 text-gray-500" />,

    zip: <FileArchive className="w-16 h-16 text-yellow-600" />,
    rar: <FileArchive className="w-16 h-16 text-yellow-600" />,
    '7z': <FileArchive className="w-16 h-16 text-yellow-600" />,
    tar: <FileArchive className="w-16 h-16 text-yellow-600" />,
    gz: <FileArchive className="w-16 h-16 text-yellow-600" />,

    mp3: <FileAudio className="w-16 h-16 text-pink-500" />,
    wav: <FileAudio className="w-16 h-16 text-pink-500" />,
    ogg: <FileAudio className="w-16 h-16 text-pink-500" />,

    mp4: <FileVideo className="w-16 h-16 text-red-400" />,
    avi: <FileVideo className="w-16 h-16 text-red-400" />,
    mov: <FileVideo className="w-16 h-16 text-red-400" />,
    mkv: <FileVideo className="w-16 h-16 text-red-400" />,
  }

  return iconMap[extension] || <File className="w-16 h-16 text-gray-400" />
}

// Uzantı badge rengi
const getExtensionColor = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  const colorMap: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700 border-red-200',
    doc: 'bg-blue-100 text-blue-700 border-blue-200',
    docx: 'bg-blue-100 text-blue-700 border-blue-200',
    xls: 'bg-green-100 text-green-700 border-green-200',
    xlsx: 'bg-green-100 text-green-700 border-green-200',
    jpg: 'bg-purple-100 text-purple-700 border-purple-200',
    jpeg: 'bg-purple-100 text-purple-700 border-purple-200',
    png: 'bg-purple-100 text-purple-700 border-purple-200',
    zip: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    mp4: 'bg-red-50 text-red-600 border-red-200',
    mp3: 'bg-pink-100 text-pink-700 border-pink-200',
    js: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ts: 'bg-blue-50 text-blue-600 border-blue-200',
  }

  return colorMap[extension] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const FileCard: React.FC<{ file: FileItem }> = ({ file }) => {
  const handleOpen = () => {
    window.open(file.url, '_blank')
  }

  const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300">
      <CardContent>
        <div className="flex items-center gap-1 ">
          <div className="flex-shrink-0  bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
            {getFileIcon(file.name)}
          </div>

          <div className="flex-1 min-w-0 ">
            <span className={`text-xs px-2 py-0.5 mb-2 rounded-full border font-medium `}>
              {extension}
            </span>
            <h3 className="font-semibold text-gray-900 truncate" title={file.name}>
              {file.name}
            </h3>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{file.size}</span>
              {file.date && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{file.date}</span>
                </>
              )}
            </div>
          </div>

          {/* Aç Butonu */}
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpen}
              className="gap-2 hover:bg-gray-900 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Aç
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Dosya Listesi Bileşeni
interface FileListProps {
  files: FileItem[]
  title?: string
}

export const FileList: React.FC<FileListProps> = ({ files, title = 'Dosyalar' }) => {
  // ✅ ÖNLEM: files undefined, null veya boş array ise
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <File className="w-16 h-16 mx-auto mb-4 opacity-40" />
        <p className="text-lg font-medium text-gray-500">Henüz dosya bulunmuyor</p>
        <p className="text-sm mt-1">Dosya eklendikten sonra burada görünecek</p>
      </div>
    )
  }

  return (
    <div className="group relative w-full mt-4 min-h-full transform shadow-2xl rounded-2xl transition-all duration-500">
      <Card className="h-full border">
        <CardHeader className=" relative">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
