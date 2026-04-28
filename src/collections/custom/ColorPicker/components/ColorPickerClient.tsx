'use client'

import React, { useCallback, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useField, FieldLabel, FieldDescription, FieldError, fieldBaseClass } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import './ColorPicker.scss'

const baseClass = 'color'

const DEFAULT_COLORS = ['#000000', '#ff003c', '#00f7ff', '#dd00ff', '#14b8a6', '#64748b', '#a3a3a3']

export const ColorPickerClient: React.FC<TextFieldClientProps> = ({ field, path, readOnly }) => {
  const { label, required, admin } = field as any
  const colors: string[] = (field as any).colors ?? DEFAULT_COLORS

  const { value, setValue, showError, errorMessage } = useField<string>({ path })

  const [fieldIsFocused, setFieldIsFocused] = useState(false)
  const lastValueRef = useRef(value)

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value
      if (v && !v.startsWith('#')) v = `#${v}`
      v = v.replace(/[^a-f0-9#]/gi, '').slice(0, 7)
      if (lastValueRef.current !== v) {
        lastValueRef.current = v
        setValue(v || null)
      }
    },
    [setValue],
  )

  const handlePickerChange = useCallback(
    (v: string) => {
      if (v !== value) {
        lastValueRef.current = v
        setValue(v)
      }
    },
    [value, setValue],
  )

  const handleSwatchClick = useCallback(
    (color: string) => {
      if (color !== value) {
        lastValueRef.current = color
        setValue(color)
      }
    },
    [value, setValue],
  )

  return (
    <div
      className={[fieldBaseClass, baseClass, showError && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel label={label} path={path} required={required} />

      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError message={errorMessage} path={path} showError={showError} />

        <div
          className={`${baseClass}__input-container`}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setFieldIsFocused(false)
            }
          }}
          onFocus={() => setFieldIsFocused(true)}
        >
          {/* Renk önizleme kutusu */}
          <div
            className={`${baseClass}__color-preview`}
            style={{ background: value?.length && value.length > 1 ? value : '#fff' }}
          />

          {/* Hex text input */}
          <input
            disabled={readOnly}
            id={`field-${path.replace(/\./g, '__')}`}
            name={path}
            onChange={handleTextChange}
            placeholder="#000000"
            type="text"
            value={value || ''}
          />

          {/* Picker modal — focus olunca açılır */}
          <div
            className={[
              `${baseClass}__color-picker-modal`,
              fieldIsFocused && `${baseClass}__color-picker-modal--focused`,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Sol: predefined renkler */}
            <div className={`${baseClass}__predefined-colors`}>
              {colors.map((color) => (
                <button
                  className={[
                    `${baseClass}__predefined-btn`,
                    value === color && `${baseClass}__predefined-btn--active`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={color}
                  onClick={() => handleSwatchClick(color)}
                  style={{ background: color }}
                  title={color}
                  type="button"
                />
              ))}
            </div>

            {/* Sağ: HexColorPicker */}
            <HexColorPicker color={value || '#000000'} onChange={handlePickerChange} />
          </div>
        </div>

        {admin?.description && <FieldDescription description={admin.description} path={path} />}
      </div>
    </div>
  )
}
