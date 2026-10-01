import type { HeroProps } from '../../components/sections/Hero';
import { sectionHref } from '../../config/navigation';
import { media } from '../../config/media';
import { site } from '../../config/site';
import { localize, t, type Locale } from '../../i18n';
import { backdropImage } from '../image';

/** Keterangan kecil di kanan atas hero: tahun berdiri dan lokasi kantor pusat. */
export function heroMeta(establishedLabel: string, foundingYear: number, location: string) {
  return [`${establishedLabel} ${foundingYear}`, location];
}

export async function loadHero(lang: Locale): Promise<HeroProps> {
  const dict = t(lang);
  const { home } = dict;
  const photo = media.hero;
  return {
    eyebrow: home.heroEyebrow,
    title: home.heroTitle,
    lead: home.heroLead,
    primary: { label: home.heroPrimary, href: sectionHref(lang, 'about') },
    secondary: { label: home.heroSecondary, href: sectionHref(lang, 'business') },
    meta: heroMeta(home.heroEstablished, site.foundingYear, home.heroLocation),
    scrollLabel: dict.common.scrollDown,
    image: photo && (await backdropImage(photo.image)),
    imageCaption: photo?.caption && localize(photo.caption, lang),
  };
}
