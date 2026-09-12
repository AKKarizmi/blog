import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRightIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  MessageCircleIcon,
  SendIcon,
  TwitterIcon,
  UserIcon,
  YoutubeIcon } from
'lucide-react';
import type { ComponentType } from 'react';
import { useForozData } from '../context/ForozDataContext';
import type { BoardMemberData } from '../context/ForozDataContext';
import { Modal } from './ui/Modal';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { handleImageError } from '../utils/imageFallback';
import { truncate } from '../utils/format';

const socialIcons: Record<string, ComponentType<{className?: string;}>> = {
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
  whatsapp: MessageCircleIcon,
  telegram: SendIcon,
  website: GlobeIcon
};

const socialLabel = (platform: string) =>
platform.charAt(0).toUpperCase() + platform.slice(1);

export function BoardMembersSection() {
  const { boardMembers, loading } = useForozData();
  const [active, setActive] = useState<BoardMemberData | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="team" className="relative overflow-hidden bg-foroz-bg py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Team"
          title={
          <>
              The people guiding <span className="text-gradient">FOROZ</span> forward
            </>
          }
          description="Educators, professionals and organizers who make the programs, mentorship and opportunities possible." />
        

        <div className="mt-16">
          {loading && boardMembers.length === 0 ?
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) =>
            <div
              key={`member-skeleton-${index}`}
              className="h-96 animate-pulse rounded-3xl border border-slate-200/70 bg-white" />

            )}
            </div> :
          boardMembers.length === 0 ?
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600">
              Team members coming soon.
            </div> :

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {boardMembers.map((member, index) => {
              const socials = Object.entries(member.socials || {}).filter(
                ([, url]) => Boolean(url)
              );

              return (
                <Reveal key={member.id} delay={Math.min(index, 5) * 0.06} y={24}>
                    <motion.article
                    whileHover={reduceMotion ? undefined : { y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition-shadow duration-500 hover:shadow-lift">
                    
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-foroz-mist">
                        {member.image ?
                      <img
                        src={member.image}
                        alt={member.title}
                        onError={handleImageError}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-premium group-hover:scale-[1.06]" /> :


                      <div className="flex h-full w-full items-center justify-center">
                            <UserIcon className="h-10 w-10 text-slate-300" />
                          </div>
                      }

                        <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                      

                        {socials.length > 0 &&
                      <ul className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                            {socials.map(([platform, url]) => {
                          const Icon = socialIcons[platform] || GlobeIcon;

                          return (
                            <li key={`${member.id}-${platform}`}>
                                  <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${member.title} on ${socialLabel(platform)}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-navy-900">
                                
                                    <Icon className="h-4 w-4" />
                                  </a>
                                </li>);

                        })}
                          </ul>
                      }
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-heading text-lg font-bold tracking-tight text-foroz-ink">
                          {member.title}
                        </h3>
                        {member.role &&
                      <p className="mt-1 text-sm font-semibold text-foroz-indigo">
                            {member.role}
                          </p>
                      }
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                          {truncate(member.short_description, 110)}
                        </p>

                        <button
                        type="button"
                        onClick={() => setActive(member)}
                        className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foroz-blue transition-colors hover:text-foroz-violet">
                        
                          View Full Bio
                          <ArrowUpRightIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.article>
                  </Reveal>);

            })}
            </div>
          }
        </div>
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        eyebrow={active?.role || 'Team'}
        title={active?.title || ''}>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr]">
          {active?.image ?
          <img
            src={active.image}
            alt={active.title}
            onError={handleImageError}
            className="aspect-[4/5] w-full rounded-2xl object-cover object-top" /> :


          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-foroz-mist">
              <UserIcon className="h-8 w-8 text-slate-300" />
            </div>
          }

          <div>
            <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
              {active?.short_description}
            </p>

            {active && Object.entries(active.socials || {}).filter(([, url]) => url).length > 0 &&
            <ul className="mt-6 flex flex-wrap gap-2">
                {Object.entries(active.socials || {}).
              filter(([, url]) => Boolean(url)).
              map(([platform, url]) => {
                const Icon = socialIcons[platform] || GlobeIcon;

                return (
                  <li key={`modal-${platform}`}>
                        <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${active.title} on ${socialLabel(platform)}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-foroz-blue hover:text-foroz-blue">
                      
                          <Icon className="h-4 w-4" />
                        </a>
                      </li>);

              })}
              </ul>
            }
          </div>
        </div>
      </Modal>
    </section>);

}