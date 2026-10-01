import { getCollection, type CollectionEntry } from 'astro:content';
import type { AboutIntroProps } from '../../components/sections/AboutIntro';
import type { StatsBandProps } from '../../components/sections/StatsBand';
import type { Milestone, TimelineProps } from '../../components/sections/Timeline';
import type { ValueItem, ValuesGridProps } from '../../components/sections/ValuesGrid';
import type { VisionMissionProps } from '../../components/sections/VisionMission';
import { media, type Photo } from '../../config/media';
import { site } from '../../config/site';
import { localize, t, type Locale, type LocalizedString } from '../../i18n';
import { backdropImage, responsiveImage } from '../image';
import { byOrder, type SectionData } from './shared';

type SiteStat = { value: number; suffix?: LocalizedString; label: LocalizedString };

export function mapStats(stats: readonly SiteStat[], lang: Locale): StatsBandProps['stats'] {
  return stats.map((stat) => ({
    value: stat.value,
    label: localize(stat.label, lang),
    suffix: stat.suffix && localize(stat.suffix, lang),
  }));
}

export function mapValues(
  entries: Pick<CollectionEntry<'values'>, 'data'>[],
  lang: Locale,
): ValueItem[] {
  return [...entries].sort(byOrder).map(({ data }) => ({
    title: localize(data.title, lang),
    description: localize(data.description, lang),
  }));
}

export function mapMilestones(
  entries: Pick<CollectionEntry<'milestones'>, 'data'>[],
  lang: Locale,
): Milestone[] {
  return [...entries]
    .sort((a, b) => a.data.year - b.data.year)
    .map(({ data }) => ({
      year: data.year,
      title: localize(data.title, lang),
      description: localize(data.description, lang),
    }));
}

/** Teks foto (keterangan & alt) dalam satu bahasa; alt jatuh ke keterangan bila tidak diisi. */
export function photoText(photo: Pick<Photo, 'caption' | 'alt'>, lang: Locale) {
  const caption = photo.caption && localize(photo.caption, lang);
  return { caption, alt: photo.alt ? localize(photo.alt, lang) : (caption ?? '') };
}

async function loadFigure(photo: Photo, lang: Locale): Promise<AboutIntroProps['figure']> {
  const { caption, alt } = photoText(photo, lang);
  return {
    image: await responsiveImage(
      photo.image,
      alt,
      '(min-width: 1280px) 1216px, 100vw',
      [640, 960, 1280, 1920, 2400],
    ),
    caption,
  };
}

/** Semua props untuk rangkaian section "Tentang Kami". */
export async function loadAbout(lang: Locale) {
  const dict = t(lang);
  const { about, home } = dict;
  return {
    intro: {
      eyebrow: dict.nav.about,
      title: about.title,
      lead: about.lead,
      body: about.body,
      figure: media.about && (await loadFigure(media.about, lang)),
    } satisfies SectionData<AboutIntroProps>,
    stats: {
      title: home.statsTitle,
      note: home.statsNote,
      stats: mapStats(site.stats, lang),
      locale: lang,
      map: media.map && (await responsiveImage(media.map.image, '', '100vw')),
    } satisfies SectionData<StatsBandProps>,
    visionMission: {
      visionTitle: about.visionTitle,
      vision: about.vision,
      missionTitle: about.missionTitle,
      mission: about.mission,
      image: media.vision && (await backdropImage(media.vision.image)),
    } satisfies SectionData<VisionMissionProps>,
    values: {
      eyebrow: about.valuesEyebrow,
      title: about.valuesTitle,
      values: mapValues(await getCollection('values'), lang),
    } satisfies SectionData<ValuesGridProps>,
    timeline: {
      eyebrow: about.historyEyebrow,
      title: about.historyTitle,
      milestones: mapMilestones(await getCollection('milestones'), lang),
    } satisfies SectionData<TimelineProps>,
  };
}
