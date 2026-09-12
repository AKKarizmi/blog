import { useState } from 'react';
import type { ChangeEvent, ComponentType, FormEvent } from 'react';
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  SendIcon,
  TwitterIcon,
  YoutubeIcon } from
'lucide-react';
import { useForozData } from '../context/ForozDataContext';
import { postJson } from '../services/api';
import { Reveal } from './ui/Reveal';
import { SpecularButton } from './ui/SpecularButton';

const socialIcons: Record<string, ComponentType<{className?: string;}>> = {
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: MessageCircleIcon,
  youtube: YoutubeIcon
};

export function ContactSection() {
  const { contact, blogPage } = useForozData();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { id, value } = event.target;
    setFormState((previous) => ({ ...previous, [id]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await postJson(contact.endpoint, {
        ...formState,
        full_name: formState.name
      });

      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = blogPage.contactEmail || contact.email;
  const phone = blogPage.contactPhone || contact.phone;
  const address = blogPage.contactAddress || contact.address;
  const socials = Object.entries(blogPage.socialLinks || {}).filter(([, url]) =>
  Boolean(url)
  );

  const fieldClasses =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-foroz-ink placeholder:text-slate-400 transition-all duration-300 focus:border-foroz-blue focus:outline-none focus:ring-4 focus:ring-foroz-blue/12';

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-slate-100 bg-white py-24 sm:py-28">
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8">
        {/* Left: get in touch */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-foroz-bg px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foroz-indigo">
              <span className="h-1.5 w-1.5 rounded-full bg-foroz-blue" />
              Contact
            </span>

            <h2 className="mt-6 font-heading text-3xl font-extrabold leading-[1.08] tracking-tighter2 text-foroz-ink sm:text-4xl lg:text-[2.9rem]">
              {contact.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
              {contact.description}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 space-y-3">
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:border-foroz-blue/40 hover:shadow-soft">
              
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-foroz-mist text-foroz-blue">
                <MailIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </span>
                <span className="block font-medium text-foroz-ink">{email}</span>
              </span>
            </a>

            {phone &&
            <a
              href={`tel:${phone}`}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:border-foroz-blue/40 hover:shadow-soft">
              
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-foroz-mist text-foroz-indigo">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Phone
                  </span>
                  <span className="block font-medium text-foroz-ink">{phone}</span>
                </span>
              </a>
            }

            {address &&
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-foroz-mist text-foroz-violet">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Address
                  </span>
                  <span className="block font-medium text-foroz-ink">{address}</span>
                </span>
              </div>
            }
          </Reveal>

          {socials.length > 0 &&
          <Reveal delay={0.16} className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Follow FOROZ
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map(([platform, url]) => {
                const Icon = socialIcons[platform] || GlobeIcon;

                return (
                  <li key={`contact-${platform}`}>
                      <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={platform}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-foroz-blue hover:text-foroz-blue">
                      
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>);

              })}
              </ul>
            </Reveal>
          }
        </div>

        {/* Right: form */}
        <Reveal delay={0.08} y={30}>
          <div className="gradient-border relative overflow-hidden rounded-3xl bg-foroz-bg p-7 sm:p-10">
            <form onSubmit={handleSubmit} noValidate={false} className="relative">
              <h3 className="font-heading text-xl font-bold tracking-tight text-foroz-ink">
                Send us a message
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                We usually reply within a few working days.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-foroz-ink">
                    
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="full_name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={fieldClasses} />
                  
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-foroz-ink">
                    
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClasses} />
                  
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-foroz-ink">
                    
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={`${fieldClasses} resize-y`} />
                  
                </div>
              </div>

              {errorMessage &&
              <p
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  {errorMessage}
                </p>
              }

              <div aria-live="polite" className="mt-7">
                <SpecularButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto">
                  
                  {isSubmitting ?
                  <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Sending…
                    </> :
                  isSuccess ?
                  <>
                      <CheckCircle2Icon className="h-4 w-4" />
                      Message Sent!
                    </> :

                  <>
                      Send Message
                      <SendIcon className="h-4 w-4" />
                    </>
                  }
                </SpecularButton>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>);

}