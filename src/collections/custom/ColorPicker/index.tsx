import type { Field } from 'payload'

type ColorPickerFieldOptions = {
  /** Field name — veritabanında saklanacak kolon adı */
  name: string
  /** Alan etiketi */
  label?: string
  /** Açıklama metni */
  description?: string
  /** Zorunlu mu? */
  required?: boolean
  /** Sadece okunabilir mi? */
  readOnly?: boolean
  /** Önceden tanımlı renk paleti (hex string dizisi) */
  colors?: string[]
  /** Varsayılan renk */
  defaultValue?: string
  /** Admin paneli ek ayarları */
  admin?: Record<string, unknown>
}

/**
 * colorPickerField()
 * Payload CMS 3.x için özel renk seçici field factory.
 *
 * Kullanım:
 *   import { colorPickerField } from '@/fields/ColorPicker'
 *
 *   export const Pages: CollectionConfig = {
 *     fields: [
 *       colorPickerField({ name: 'brandColor', label: 'Marka Rengi' }),
 *     ],
 *   }
 */
export const colorPickerField = ({
  name,
  label,
  description,
  required = false,
  readOnly = false,
  colors,
  defaultValue,
  admin = {},
}: ColorPickerFieldOptions): Field => ({
  name,
  type: 'text',
  label,
  required,
  defaultValue,
  // Hex format validation
  validate: (val: unknown) => {
    if (!val) return required ? 'Bu alan zorunludur.' : true
    if (typeof val !== 'string') return 'Geçersiz değer.'
    if (!/^#[0-9a-fA-F]{6}$/.test(val)) {
      return 'Geçerli bir hex renk kodu girin. Örnek: #ff0000'
    }
    return true
  },
  admin: {
    readOnly,
    description,
    // Payload 3.x — custom field component
    components: {
      Field: {
        path: '@/collections/custom/ColorPicker/components/ColorPickerClient',
        exportName: 'ColorPickerClient',
      },
    },
    // extra props forwarded to the client component
    custom: {
      colors,
    },
    ...admin,
  },
  // Forward colors to the client via field metadata (accessed as field.colors in client)
  ...(colors ? ({ colors } as any) : {}),
})
