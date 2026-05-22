import { useState } from 'react';
import { AnnouncementPlacementBanner } from './AnnouncementBanner';

interface HomepageProps {
  onSignIn: () => void;
  onExploreNews: () => void;
}

const HERO_DRONE_ASSET = '/home/hero-drone.png';
const PUBLIC_ANNOUNCEMENT_CLASSNAME = '!border-white/10 !bg-[rgba(16,19,26,0.46)] shadow-public-glass backdrop-blur-2xl';

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="ff-public-feature-card">
      <div className="ff-public-feature-icon">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-[1.45rem] text-slate-200/78">{description}</p>
    </div>
  );
}

function HeroDroneArtwork({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 720 460" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ff-drone-frame" x1="139" y1="121" x2="555" y2="344" gradientUnits="userSpaceOnUse">
          <stop stopColor="#111827" />
          <stop offset="0.45" stopColor="#1E293B" />
          <stop offset="1" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="ff-drone-panel" x1="290" y1="162" x2="418" y2="271" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="0.55" stopColor="#1F2937" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="ff-drone-accent" x1="323" y1="136" x2="420" y2="214" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
        <radialGradient id="ff-drone-halo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(393 194) rotate(177.082) scale(238.981 126.889)">
          <stop stopColor="#60A5FA" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#4F46E5" stopOpacity="0.26" />
          <stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
        </radialGradient>
        <filter id="ff-drone-shadow" x="76" y="56" width="579" height="358" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="24" stdDeviation="20" floodColor="#020617" floodOpacity="0.5" />
        </filter>
      </defs>

      <ellipse cx="402" cy="214" rx="248" ry="126" fill="url(#ff-drone-halo)" />

      <g filter="url(#ff-drone-shadow)" transform="rotate(-9 372 220)">
        <ellipse cx="217" cy="162" rx="112" ry="20" fill="#C7D2FE" fillOpacity="0.18" />
        <ellipse cx="531" cy="160" rx="118" ry="18" fill="#E2E8F0" fillOpacity="0.22" />
        <ellipse cx="202" cy="308" rx="106" ry="20" fill="#C7D2FE" fillOpacity="0.16" />
        <ellipse cx="534" cy="314" rx="122" ry="20" fill="#E2E8F0" fillOpacity="0.2" />

        <path d="M289 214L215 169" stroke="#111827" strokeWidth="16" strokeLinecap="round" />
        <path d="M441 194L528 165" stroke="#111827" strokeWidth="16" strokeLinecap="round" />
        <path d="M294 258L204 306" stroke="#111827" strokeWidth="16" strokeLinecap="round" />
        <path d="M434 250L526 309" stroke="#111827" strokeWidth="16" strokeLinecap="round" />

        <circle cx="215" cy="169" r="23" fill="#0F172A" />
        <circle cx="528" cy="165" r="23" fill="#111827" />
        <circle cx="204" cy="306" r="23" fill="#0F172A" />
        <circle cx="526" cy="309" r="23" fill="#111827" />

        <circle cx="215" cy="169" r="9" fill="#A78BFA" opacity="0.95" />
        <circle cx="528" cy="165" r="9" fill="#F8FAFC" opacity="0.7" />
        <circle cx="204" cy="306" r="9" fill="#60A5FA" opacity="0.95" />
        <circle cx="526" cy="309" r="9" fill="#60A5FA" opacity="0.9" />

        <path d="M279 182L421 168L469 220L352 286L244 248L279 182Z" fill="url(#ff-drone-frame)" />
        <path d="M295 194L411 182L446 221L347 271L266 241L295 194Z" fill="url(#ff-drone-panel)" stroke="#64748B" strokeOpacity="0.35" />

        <path d="M342 130L404 132L419 192L352 198L342 130Z" fill="#111827" stroke="#A78BFA" strokeOpacity="0.9" strokeWidth="5" />
        <rect x="352" y="144" width="39" height="35" rx="7" fill="#0F172A" />
        <circle cx="372" cy="161" r="12" fill="#111827" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="372" cy="161" r="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />

        <path d="M286 224L324 219L341 260L286 274L254 242L286 224Z" fill="#0F172A" stroke="#60A5FA" strokeOpacity="0.45" strokeWidth="3" />
        <rect x="289" y="232" width="30" height="24" rx="5" fill="#020617" />
        <circle cx="304" cy="244" r="8" fill="#111827" stroke="#94A3B8" strokeWidth="2.5" />

        <path d="M322 182L387 176" stroke="url(#ff-drone-accent)" strokeWidth="6" strokeLinecap="round" />
        <path d="M308 243L430 227" stroke="#334155" strokeWidth="10" strokeLinecap="round" opacity="0.75" />
        <path d="M347 185L333 245" stroke="#64748B" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
        <path d="M388 177L419 221" stroke="#64748B" strokeWidth="5" strokeLinecap="round" opacity="0.55" />

        <rect x="398" y="158" width="50" height="56" rx="10" fill="#111827" stroke="#8B5CF6" strokeOpacity="0.7" strokeWidth="4" />
        <rect x="406" y="171" width="34" height="24" rx="5" fill="#1F2937" />
        <path d="M430 144L445 96" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
        <path d="M449 150L469 105" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
        <path d="M470 156L506 128" stroke="#111827" strokeWidth="5" strokeLinecap="round" />

        <rect x="433" y="83" width="18" height="20" rx="4" fill="#FCD34D" />
        <rect x="461" y="91" width="17" height="18" rx="4" fill="#334155" />
      </g>
    </svg>
  );
}

export function Homepage({ onSignIn, onExploreNews }: HomepageProps) {
  const [droneAssetFailed, setDroneAssetFailed] = useState(false);

  const heroDroneClassName = 'pointer-events-none relative z-10 w-full max-w-[800px] translate-x-6 select-none drop-shadow-[0_34px_70px_rgba(2,6,23,0.58)] xl:max-w-[860px]';

  return (
    <div className="ff-public-shell flex-1 overflow-y-auto bg-transparent text-white">
      <section className="relative isolate min-h-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,18,0.62)_0%,rgba(6,10,18,0.46)_24%,rgba(6,10,18,0.20)_48%,rgba(6,10,18,0.08)_74%,rgba(6,10,18,0.14)_100%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.02)_20%,rgba(2,6,23,0.04)_42%,rgba(2,6,23,0.16)_68%,rgba(2,6,23,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(101,99,255,0.12),transparent_22%),radial-gradient(circle_at_72%_34%,rgba(59,130,246,0.08),transparent_24%),radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.06),transparent_20%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[30rem] bg-[linear-gradient(180deg,rgba(16,19,26,0)_0%,rgba(16,19,26,0.03)_24%,rgba(16,19,26,0.18)_58%,rgba(16,19,26,0.72)_100%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1440px] flex-col px-6 pb-8 pt-8 md:px-10 lg:px-14 lg:pb-10 lg:pt-10">
          <AnnouncementPlacementBanner placement="home" className={`mb-5 max-w-2xl ${PUBLIC_ANNOUNCEMENT_CLASSNAME}`} />

          <div className="flex flex-1 flex-col gap-6 lg:gap-8">
            <div className="grid items-center gap-8 lg:min-h-[420px] lg:grid-cols-[minmax(0,0.88fr)_minmax(480px,1.12fr)] lg:gap-4 xl:min-h-[450px] xl:gap-8">
              <div className="max-w-3xl lg:pt-2 xl:pt-4">
                <p className="mb-5 text-[0.8rem] font-medium uppercase tracking-[0.38em] text-slate-200/72 md:text-[0.82rem]">
                  The modern home base for FPV and RC pilots
                </p>
                <h1 className="text-[4rem] font-black italic leading-[0.9] tracking-[-0.08em] text-white drop-shadow-[0_18px_34px_rgba(2,6,23,0.46)] sm:text-[4.8rem] lg:text-[5.35rem] xl:text-[6.05rem]">
                  <span className="block whitespace-nowrap">Build it.</span>
                  <span className="block whitespace-nowrap">Fly it.</span>
                  <span className="block whitespace-nowrap">Share it.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-200/84 sm:text-[1.03rem] lg:max-w-xl lg:pr-6">
                  Track aircraft, organize gear, follow the news, and keep every bench session moving inside one polished workspace.
                </p>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="ff-public-cta-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                  >
                    Get Started
                  </button>
                  <button
                    type="button"
                    onClick={onExploreNews}
                    className="ff-public-cta-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                  >
                    Explore News Feed
                  </button>
                </div>
              </div>

              <div className="relative hidden min-h-[400px] items-center justify-end lg:flex xl:min-h-[430px]">
                <div className="absolute right-[3%] top-[4%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(91,77,255,0.30)_0%,rgba(91,77,255,0.10)_44%,transparent_72%)] blur-[96px]" />
                <div className="absolute bottom-[14%] right-[18%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.20)_0%,rgba(59,130,246,0.05)_46%,transparent_72%)] blur-[84px]" />
                {droneAssetFailed ? (
                  <HeroDroneArtwork className={heroDroneClassName} />
                ) : (
                  <img
                    src={HERO_DRONE_ASSET}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="eager"
                    onError={() => setDroneAssetFailed(true)}
                    className={heroDroneClassName}
                  />
                )}
              </div>
            </div>

            <div className="lg:hidden">
              {droneAssetFailed ? (
                <HeroDroneArtwork className="mx-auto w-full max-w-[460px] drop-shadow-[0_26px_40px_rgba(2,6,23,0.38)]" />
              ) : (
                <img
                  src={HERO_DRONE_ASSET}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="eager"
                  onError={() => setDroneAssetFailed(true)}
                  className="mx-auto w-full max-w-[500px] select-none drop-shadow-[0_28px_48px_rgba(2,6,23,0.48)]"
                />
              )}
            </div>

            <div className="relative pb-2">
              <div className="mb-5">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.3rem]">
                  Everything you need for the hobby
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300/76 sm:text-[0.98rem]">
                  Move from build planning to gear management and community discovery without juggling five different tools.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3 xl:gap-6">
                <FeatureCard
                  icon={(
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  title="Track Your Aircraft"
                  description="Keep specs, ownership history, setup notes, and photos ready before the next trip to the field."
                />
                <FeatureCard
                  icon={(
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-6h-2M6 12H4m11.314 5.657l-1.414-1.414M8.1 8.1 6.686 6.686m10.628 0L15.9 8.1M8.1 15.9l-1.414 1.414" />
                      <circle cx="12" cy="12" r="3.5" strokeWidth={2} />
                    </svg>
                  )}
                  title="Manage Your Gear"
                  description="Organize frames, radios, batteries, and bench inventory so the right parts are always within reach."
                />
                <FeatureCard
                  icon={(
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  title="Connect with Pilots"
                  description="Jump from curated news into builds, profiles, and shared discoveries from pilots across the hobby."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
