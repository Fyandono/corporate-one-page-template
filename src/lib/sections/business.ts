import { getCollection, type CollectionEntry } from 'astro:content';
import type {
  BusinessLayout,
  BusinessSectionProps,
} from '../../components/sections/BusinessSection';
import { localize, t, type Locale } from '../../i18n';
import { responsiveImage } from '../image';
import { byOrder, type SectionData } from './shared';

type Card = BusinessSectionProps['cards'][number];

/**
 * Tata letak section: 3–4 lini → satu lini utama + baris ringkas (`featured`);
 * selain itu grid rata, agar kolom ringkas tidak terlalu pendek/panjang.
 */
export const businessLayout = (count: number): BusinessLayout =>
  count >= 3 && count <= 4 ? 'featured' : 'grid';

/** `sizes` & lebar gambar sesuai posisi kartu dalam tata letak. */
export function cardImageSpec(layout: BusinessLayout, index: number) {
  if (layout === 'grid') {
    return {
      sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
      widths: [400, 800],
    };
  }
  return index === 0
    ? {
        sizes: '(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 100vw',
        widths: [640, 960, 1400],
      }
    : { sizes: '(min-width: 1024px) 200px, 40vw', widths: [320, 480] };
}

/** Ubah entri koleksi `business` menjadi props polos untuk BusinessCard. */
export async function businessCardProps(
  entry: Pick<CollectionEntry<'business'>, 'data'>,
  lang: Locale,
  index: number,
  layout: BusinessLayout = 'grid',
  href?: string,
): Promise<Card> {
  const { data } = entry;
  const { sizes, widths } = cardImageSpec(layout, index);
  return {
    title: localize(data.title, lang),
    summary: localize(data.summary, lang),
    description: localize(data.description, lang),
    image: await responsiveImage(data.image, localize(data.imageAlt, lang), sizes, widths),
    index,
    href,
  };
}

export async function loadBusiness(lang: Locale): Promise<SectionData<BusinessSectionProps>> {
  const dict = t(lang);
  const entries = (await getCollection('business')).sort(byOrder);
  const layout = businessLayout(entries.length);
  return {
    layout,
    eyebrow: dict.nav.business,
    title: dict.business.title,
    lead: dict.business.lead,
    cards: await Promise.all(entries.map((entry, i) => businessCardProps(entry, lang, i, layout))),
  };
}
