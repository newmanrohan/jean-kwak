interface InfoField {
  label: string
  value: string | null | undefined
}

interface ProjectInfoProps {
  location?: string | null
  year?: string | null
  builder?: string | null
  photography?: string | null
  landscape?: string | null
  styling?: string | null
}

export default function ProjectInfo({
  location,
  year,
  builder,
  photography,
  landscape,
  styling,
}: ProjectInfoProps) {
  const fields: InfoField[] = [
    { label: 'Location', value: location },
    { label: 'Year', value: year },
    { label: 'Builder', value: builder },
    { label: 'Photography', value: photography },
    { label: 'Landscape', value: landscape },
    { label: 'Styling', value: styling },
  ]

  const visibleFields = fields.filter((f) => f.value)

  if (visibleFields.length === 0) return null

  return (
    <dl className="space-y-3">
      {visibleFields.map((field) => (
        <div key={field.label}>
          <dt className="text-xs uppercase tracking-widest text-black/50">{field.label}</dt>
          <dd className="text-sm mt-0.5">{field.value}</dd>
        </div>
      ))}
    </dl>
  )
}
