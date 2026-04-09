import { PortableText } from 'next-sanity'
import { client, infoQuery } from '@/lib/sanity'

export const revalidate = 60

interface Info {
  bio?: unknown[] | null
  phone?: string | null
  email?: string | null
  instagram?: string | null
  facebook?: string | null
}

export default async function InformationPage() {
  const info: Info | null = await client.fetch(infoQuery)

  return (
    <main className="pt-24 px-6 pb-16 max-w-2xl">
      <div className="space-y-12">
        {info?.bio && info.bio.length > 0 && (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none">
            <PortableText value={info.bio as Parameters<typeof PortableText>[0]['value']} />
          </div>
        )}

        <div className="space-y-3">
          {info?.phone && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-black/50">Phone</dt>
              <dd className="text-sm mt-0.5">
                <a href={`tel:${info.phone}`} className="hover:text-black/50 transition-colors">
                  {info.phone}
                </a>
              </dd>
            </div>
          )}
          {info?.email && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-black/50">Email</dt>
              <dd className="text-sm mt-0.5">
                <a href={`mailto:${info.email}`} className="hover:text-black/50 transition-colors">
                  {info.email}
                </a>
              </dd>
            </div>
          )}
          {info?.instagram && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-black/50">Instagram</dt>
              <dd className="text-sm mt-0.5">
                <a
                  href={info.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black/50 transition-colors"
                >
                  Instagram
                </a>
              </dd>
            </div>
          )}
          {info?.facebook && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-black/50">Facebook</dt>
              <dd className="text-sm mt-0.5">
                <a
                  href={info.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black/50 transition-colors"
                >
                  Facebook
                </a>
              </dd>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
