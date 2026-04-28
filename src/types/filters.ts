// types/filters.ts
export interface CommonFilterParams {
  search?: string
  by_generate: string
  status?: string
  sort?: string
  user?: string
  layout: string
  drill_category?: string
  category?: string
  location?: string
  level?: string
  education_level?: string
  dateFrom?: string
  dateTo?: string
  modules?: string
  requiredButNotCompletedModules?: string
  completedModules?: string
  inCompletedModules?: string
  team?: string
  lesson?: string
  group?: string
  page?: number
  limit?: string
}
export interface LessonFilterParams extends CommonFilterParams {}
// Tatbikatlara özel ek filtreler gerekirse
export interface DrillFilterParams extends CommonFilterParams {}
export interface ModuleFilterParams extends CommonFilterParams {}
export interface UsersFilterParams extends CommonFilterParams {}
export interface GroupsFilterParams extends CommonFilterParams {}
export interface TeamsFilterParams extends CommonFilterParams {}

export interface PaginationParams {
  pageParam?: number
}

// API fonksiyonlarına gönderilecek birleşik tip
export type FilterWithPagination = CommonFilterParams & PaginationParams

// Her bir sort objesinin tipi
export interface SortOption {
  value: string
  label: string
}

// Merkezi havuzumuz
export const SORT_REGISTRY = {
  DATE_FROM_DESC: { value: 'date_from', label: 'Başlangıç Tarihi ↓' },
  DATE_FROM_ASC: { value: '-date_from', label: 'Başlangıç Tarihi ↑' },
  LEVEL_DESC: { value: 'level', label: 'Zorluk Seviyesi ↓' },
  LEVEL_ASC: { value: '-level', label: 'Zorluk Seviyesi ↑' },
  CREATED_AT_DESC: { value: 'created_at', label: 'Oluşturulma Tarihi ↓' },
  CREATED_AT_ASC: { value: '-created_at', label: 'Oluşturulma Tarihi ↑' },
  NAME_DESC: { value: 'name', label: 'Tatbikat Adı ↓' },
  NAME_ASC: { value: '-name', label: 'Tatbikat Adı ↑' },
} as const

export type SortKey = keyof typeof SORT_REGISTRY

export const getSortOptions = (keys: SortKey[]): SortOption[] => {
  return keys.map((key) => SORT_REGISTRY[key])
}
