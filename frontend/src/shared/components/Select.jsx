import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/shared/utils'
import { ChevronDown, Check, Search } from 'lucide-react'

function isValidOption(option) {
  if (option == null) return false
  if (typeof option === 'string') {
    const s = option.trim()
    return s.length > 0 && s.toLowerCase() !== 'undefined'
  }
  const v = option.value
  const label = option.label ?? option.value
  if (v == null || String(v).trim() === '') return false
  const ls = label != null ? String(label).trim() : ''
  return ls.length > 0 && ls.toLowerCase() !== 'undefined'
}

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  searchable = false,
  icon,
  error,
  disabled,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const safeOptions = useMemo(
    () => (Array.isArray(options) ? options.filter(isValidOption) : []),
    [options]
  )

  const getOptionValue = (option) => (typeof option === 'string' ? option : option?.value)
  const getOptionLabel = (option) =>
    typeof option === 'string'
      ? option
      : String(option?.label ?? option?.value ?? '')
  const getOptionIcon = (option) => (typeof option === 'string' ? null : option?.icon)

  const filteredOptions = searchable
    ? safeOptions.filter((opt) =>
        getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
      )
    : safeOptions

  const selectedOption = safeOptions.find((opt) => getOptionValue(opt) === value)
  const selectedLabel = selectedOption
    ? getOptionLabel(selectedOption)
    : value && String(value).trim() && String(value).toLowerCase() !== 'undefined'
      ? String(value)
      : placeholder
  const selectedIcon = selectedOption ? getOptionIcon(selectedOption) : null

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full h-11 rounded-lg bg-secondary/50 border border-border',
          'text-left px-3 flex items-center gap-2',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-destructive focus:ring-destructive',
          icon && 'pl-10'
        )}
        disabled={disabled}
      >
        {icon && (
          <div className="absolute left-3 text-muted-foreground">
            {icon}
          </div>
        )}
        {selectedIcon && (
          <img
            src={selectedIcon}
            alt={selectedLabel}
            className="w-6 h-6 object-contain rounded-sm shrink-0"
          />
        )}
        <span className={cn('flex-1 truncate', !value && 'text-muted-foreground')}>
          {selectedLabel}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 py-1 glass-card rounded-lg border border-border shadow-xl max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-3 rounded-md bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionValue = getOptionValue(option)
                const optionLabel = getOptionLabel(option)
                const optionIcon = getOptionIcon(option)

                return (
                <button
                  key={`${String(optionValue)}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(optionValue)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left flex items-center gap-2',
                    'hover:bg-secondary transition-colors',
                    value === optionValue && 'bg-primary/10 text-primary'
                  )}
                >
                  {optionIcon && (
                    <img
                      src={optionIcon}
                      alt={optionLabel}
                      className="w-6 h-6 object-contain rounded-sm shrink-0"
                    />
                  )}
                  <span className="flex-1">{optionLabel}</span>
                  {value === optionValue && <Check className="w-4 h-4" />}
                </button>
                )
              })
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}
