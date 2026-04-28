import Link from 'next/link'
import React from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface SectionsProps {
  path: string
  data: any
  name: string
  title: string
  nested?: string
}

const Section = ({ path, data, name, title, nested }: SectionsProps) => {
  const getNestedProperty = (obj: any, path: string): any => {
    try {
      let normalizedPath = path
        .replace(/\?\./g, '')
        .replace(/\["/g, '.')
        .replace(/"\]/g, '')
        .replace(/\[`/g, '.')
        .replace(/`\]/g, '')
        .replace(/^\./g, '')
      const keys = normalizedPath.split('.')
      let result = obj

      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key]
        } else {
          return null
        }
      }

      return result
    } catch (error) {
      return null
    }
  }

  return (
    <div className="w-full mb-4">
      <Card className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className=" relative">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
            <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2.5">
            {data?.length === 0 && (
              <div className="w-full flex items-center justify-center py-4">
                <div className="text-center space-y-1">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 backdrop-blur">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
                      />
                    </svg>
                  </div>

                  <Badge className="rounded-xl border border-dashed border-border/60 bg-transparent px-4 py-1.5 text-muted-foreground font-normal">
                    İçerik bulunamadı
                  </Badge>
                </div>
              </div>
            )}
            {data?.map((item: any, index: number) => {
              const linkPath = nested ? `${nested}.id` : 'id'
              const linkId = getNestedProperty(item, linkPath)

              return (
                <Link
                  key={item?.id || index}
                  href={`${path}${item?.id}`}
                  className="group relative"
                >
                  <div className="absolute inset-0 rounded-xl bg-primary/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Badge
                    variant="secondary"
                    className="
      relative rounded-xl px-4 py-2
      border border-border/50
      
    "
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {item[name] || 'N/A'}
                    </span>
                  </Badge>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Section
