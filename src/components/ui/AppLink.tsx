import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { safeLink, isExternal } from '../../utils/links';
export function AppLink({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const destination = href?.startsWith('mailto:') || href?.startsWith('tel:') ? href : safeLink(href);
  if (!destination) return <span className={props.className}>{children}</span>;
  if (isExternal(destination) || /^(mailto|tel):/.test(destination)) {
    return <a {...props} href={destination} rel={props.target === '_blank' ? 'noopener noreferrer' : props.rel}>{children}</a>;
  }
  return <Link {...props} to={destination}>{children}</Link>;
}
