export interface SocialLink {
  label: string;
  href: string;
  /**
   * Where long-form content lives. Rendered with primary visual weight in the
   * homepage "Onde acompanhar" block, since leoferraz.dev is the single bio
   * link across every platform and this is the main onward destination.
   */
  primary?: boolean;
  /** Short qualifier shown next to the label in the follow block. */
  note?: string;
}

export const socialLinks: SocialLink[] = [
  { label: 'YouTube', href: 'https://www.youtube.com/@leoferrazdev', primary: true, note: 'vídeos e lives' },
  { label: 'Instagram', href: 'https://www.instagram.com/leoferrazdev' },
  { label: 'X', href: 'https://x.com/leoferrazdev' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/leoferrazdev' },
  { label: 'Substack', href: 'https://substack.com/@leoferrazdev' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/leoferrazdev' },
  { label: 'Facebook', href: 'https://www.facebook.com/leoferrazdev' },
];
