import type { ResponsiveImage } from '../types';
import Backdrop from '../ui/Backdrop';
import ColumnLines from '../ui/ColumnLines';
import Eyebrow from '../ui/Eyebrow';
import Grain from '../ui/Grain';
import NusantaraPattern from '../ui/NusantaraPattern';
import Section from '../ui/Section';

export type VisionMissionProps = {
  /** Anchor untuk navigasi one-page. */
  id?: string;
  /** id judul untuk `aria-labelledby`; unik per halaman. Default: `${id}-title`. */
  titleId?: string;
  visionTitle: string;
  vision: string;
  missionTitle: string;
  mission: string[];
  /** Foto latar (dekoratif). Tanpa foto, section memakai motif kawung + grain. */
  image?: ResponsiveImage;
};

/**
 * Section gelap sinematik: pernyataan visi besar di kiri, daftar misi bernomor di kanan,
 * di atas foto latar ber-vignette (atau motif kawung), garis kolom, dan grain.
 */
export default function VisionMission({
  visionTitle,
  vision,
  missionTitle,
  mission,
  image,
  id,
  titleId = `${id ?? 'vision'}-title`,
}: VisionMissionProps) {
  return (
    <Section
      tone="dark"
      spacing="compact"
      id={id}
      labelledBy={titleId}
      className="relative isolate overflow-hidden"
      containerClassName="grid gap-16 lg:grid-cols-2"
    >
      {image ? (
        <Backdrop image={image} vignette="center" />
      ) : (
        <>
          <NusantaraPattern fade="left" />
          <Grain />
        </>
      )}
      <ColumnLines />
      <div data-reveal>
        <Eyebrow as="h2" id={titleId} tone="dark">
          {visionTitle}
        </Eyebrow>
        <p className="mt-6 font-serif text-statement font-light text-balance text-white">
          {vision}
        </p>
      </div>
      <div data-reveal>
        <Eyebrow as="h2" tone="dark">
          {missionTitle}
        </Eyebrow>
        <ol className="mt-6 space-y-6">
          {mission.map((item, i) => (
            <li key={item} className="flex gap-5 border-t border-white/15 pt-6">
              <span className="text-small font-semibold text-accent-400" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-body-lg leading-relaxed text-primary-100">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
