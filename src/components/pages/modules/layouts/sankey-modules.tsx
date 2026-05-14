'use client'

import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from '@/components/charts/sankey'
import { NotFoundItem } from '@/components/not-found-item'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useMemo } from 'react'

export interface RawTeam {
  id: number
  name: string
  color?: string
  modules?: number[]
}

export interface RawGroup {
  id: number
  name: string
  team?: number
  modules?: number[]
}

export interface RawModule {
  id: number
  name: string
  teams: { docs: RawTeam[]; hasNextPage: boolean }
  groups: { docs: RawGroup[]; hasNextPage: boolean }
}

export function transformModulesToSankey(modules: RawModule[]) {
  const nodes: Array<{
    name: string
    category: 'source' | 'landing' | 'outcome'
    teamId?: number
  }> = []
  const links: Array<{ source: number; target: number; value: number }> = []
  const nodeMap = new Map<string, number>()
  const teamColors: Record<string, string> = {}
  const teamIdToColor: Record<number, string> = {}
  const groupTeamColors: Record<string, string> = {}

  const addNode = (name: string, category: 'source' | 'landing' | 'outcome', teamId?: number) => {
    const key = `${category}:${name}`
    if (!nodeMap.has(key)) {
      nodeMap.set(key, nodes.length)
      nodes.push({ name, category, teamId })
    }
    return nodeMap.get(key)!
  }

  const connectedModules = new Set<number>()
  const moduleToTeams = new Map<number, Set<string>>()
  const moduleToGroups = new Map<number, Set<string>>()
  const groupsSet = new Set<string>()
  const groupTeamMap = new Map<string, number>()

  for (const mod of modules) {
    const hasTeams = mod.teams.docs.length > 0
    const hasGroups = mod.groups.docs.length > 0
    if (hasTeams || hasGroups) connectedModules.add(mod.id)

    for (const t of mod.teams.docs) {
      teamColors[t.name] = t.color || '#888888'
      teamIdToColor[t.id] = t.color || '#888888'
      ;(moduleToTeams.get(mod.id) || moduleToTeams.set(mod.id, new Set()).get(mod.id))!.add(t.name)
    }
    for (const g of mod.groups.docs) {
      groupsSet.add(g.name)
      groupTeamMap.set(g.name, g.team || 0)
      groupTeamColors[g.name] = g.team ? teamIdToColor[g.team] || '#475569' : '#475569'
      ;(moduleToGroups.get(mod.id) || moduleToGroups.set(mod.id, new Set()).get(mod.id))!.add(
        g.name,
      )
    }
  }

  const filtered = modules.filter((m) => connectedModules.has(m.id))

  ;[...groupsSet].sort().forEach((g) => addNode(g, 'source', groupTeamMap.get(g)))
  filtered.forEach((m) => addNode(m.name, 'landing'))
  Object.keys(teamColors)
    .sort()
    .forEach((t) => addNode(t, 'outcome'))

  for (const mod of filtered) {
    const modIdx = nodeMap.get(`landing:${mod.name}`)!
    for (const g of moduleToGroups.get(mod.id) || []) {
      links.push({ source: nodeMap.get(`source:${g}`)!, target: modIdx, value: 1 })
    }
    for (const t of moduleToTeams.get(mod.id) || []) {
      links.push({ source: modIdx, target: nodeMap.get(`outcome:${t}`)!, value: 1 })
    }
  }

  return { data: { nodes, links }, teamColors, groupTeamColors }
}

function TeamPatterns({ teamColors }: { teamColors: Record<string, string> }) {
  return (
    <>
      {Object.entries(teamColors).map(([teamName, color]) => {
        const patternId = `pattern-${teamName.toLowerCase().replace(/\s+/g, '-')}`
        return (
          <pattern
            key={patternId}
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <rect width="8" height="8" fill={color} opacity="0.15" />
            <line x1="0" y1="0" x2="8" y2="8" stroke={color} strokeWidth="1.5" />
          </pattern>
        )
      })}
    </>
  )
}

export default function ModuleFlowDiagram({ modules }: { modules: RawModule[] }) {
  const { data, teamColors, groupTeamColors } = useMemo(
    () => transformModulesToSankey(modules),
    [modules],
  )

  const hasData = data.nodes.length > 0 && data.links.length > 0
  const validLinks = hasData
    ? data.links.filter(
        (link) =>
          link.source >= 0 &&
          link.source < data.nodes.length &&
          link.target >= 0 &&
          link.target < data.nodes.length &&
          link.value > 0,
      )
    : []

  const safeData = useMemo(() => {
    if (!hasData || validLinks.length === 0) return { nodes: [], links: [] }
    return { nodes: data.nodes, links: validLinks }
  }, [data, hasData, validLinks])

  const getTeamPatternId = (teamName: string) =>
    `pattern-${teamName.toLowerCase().replace(/\s+/g, '-')}`

  const getLinkPattern = (link: any) => {
    let targetName: string | undefined
    if (typeof link.target === 'number') {
      targetName = safeData.nodes[link.target]?.name
    } else if (link.target && typeof link.target === 'object') {
      targetName = link.target.name
    }
    if (targetName && teamColors[targetName]) return getTeamPatternId(targetName)
    return undefined
  }

  const getNodeColor = (node: any, _index: number) => {
    if (node.category === 'outcome') return teamColors[node.name] || '#888888'
    if (node.category === 'source') return groupTeamColors[node.name] || '#475569'
    return '#64748b'
  }

  if (safeData.nodes.length === 0 || safeData.links.length === 0) {
    return <NotFoundItem title="Modül Bulunamadı" description="" />
  }

  return (
    <Card className="w-full p-4 mt-4">
      <CardTitle>Modül Bağlantıları</CardTitle>
      <CardDescription>Modül bağlantılarının sankey diagrami</CardDescription>
      <CardContent>
        <SankeyChart data={safeData} aspectRatio="16 / 6" nodeWidth={12} nodePadding={24}>
          <SankeyLink
            getLinkPattern={getLinkPattern}
            patterns={<TeamPatterns teamColors={teamColors} />}
          />
          <SankeyNode lineCap={4} getNodeColor={getNodeColor} />
          <SankeyTooltip />
        </SankeyChart>
      </CardContent>
    </Card>
  )
}
