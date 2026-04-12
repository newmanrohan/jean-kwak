import { PortableText } from 'next-sanity'
import { client, infoQuery, urlFor } from '@/lib/sanity'

export const revalidate = 60

interface Info {
  portrait?: { asset: { _ref: string; _type: string }; _type: string } | null
  bio?: unknown[] | null
  phone?: string | null
  email?: string | null
  instagram?: string | null
  facebook?: string | null
}

const mono: React.CSSProperties = {
  fontFamily: 'QuadrantTextMono',
  fontWeight: 400,
  fontSize: 'var(--font-label)',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  lineHeight: '1.18',
  color: '#000',
  whiteSpace: 'pre-line',
}

export default async function InformationPage() {
  const info: Info | null = await client.fetch(infoQuery)

  const portraitUrl = info?.portrait
    ? urlFor(info.portrait).width(670).url()
    : null

  const contactRows = [
    info?.phone ? { label: '(Phone)', value: info.phone } : null,
    info?.email ? { label: '(Email)', value: info.email } : null,
    info?.instagram ? { label: '(Ig)', value: '@jeanarchitects' } : null,
    info?.facebook ? { label: '(Fb)', value: 'facebook.com/jeanarchitects' } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <main
      className="min-h-screen"
      style={{ background: '#F7F2E9', paddingTop: '58px' }}
    >
      <div className="px-5 pb-16">

        {/*
          Desktop: [portrait ~24%] [gap ~27%] [right: label ~21% | content flex-1]
          Mobile:  stacked vertically
          Labels (profile) and (contact) sit to the LEFT of their content on desktop.
        */}
        <div className="flex flex-col lg:flex-row mt-8 lg:mt-[99px]">

          {/* Portrait */}
          {portraitUrl && (
            <div className="shrink-0 mb-10 lg:mb-0 lg:w-[24%]">
              <img
                src={portraitUrl}
                alt="Portrait"
                style={{ width: '100%', maxWidth: '335px', display: 'block' }}
              />
            </div>
          )}

          {/* Gap — desktop only */}
          <div
            className="hidden lg:block shrink-0"
            style={{ width: '27%' }}
          />

          {/* Right content column */}
          <div className="flex-1 min-w-0">

            {/* Profile section: (profile) label LEFT of bio */}
            <div className="flex flex-col lg:flex-row gap-[40px]">
              <div className="shrink-0 lg:w-[22%]" style={mono}>
                (profile)
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontFamily: 'QuadrantText',
                    fontWeight: 200,
                    fontSize: 'var(--font-body)',
                    lineHeight: '1.278',
                    color: '#141414',
                  }}
                >
                  {info?.bio && info.bio.length > 0 && (
                    <PortableText
                      value={info.bio as Parameters<typeof PortableText>[0]['value']}
                      components={{
                        block: {
                          normal: ({ children }) => (
                            <p style={{ margin: 0, marginBottom: '1.2em' }}>{children}</p>
                          ),
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Contact section: (contact) label LEFT of contact rows */}
            {contactRows.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-[40px]" style={{ marginTop: '48px' }}>
                <div className="shrink-0 lg:w-[22%]" style={mono}>
                  (contact)
                </div>
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-[144px_1fr] gap-x-[40px]">
                    <div style={mono}>
                      {contactRows.map(r => r.label).join('\n')}
                    </div>
                    <div style={mono}>
                      {contactRows.map(r => r.value).join('\n')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="lg:ml-[22%]" style={{ ...mono, marginTop: '48px' }}>
              {'ACT Architects Registration No 2752\nJean Architects © All rights reserved 2023'}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
