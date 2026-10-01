import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';
import BusinessCard, { type BusinessCardProps } from './BusinessCard';

export type BusinessLayout = 'featured' | 'grid';

export type BusinessSectionProps = {
  /** Anchor untuk navigasi one-page. */
  id?: string;
  /** id judul untuk `aria-labelledby`; unik per halaman. Default: `${id}-title`. */
  titleId?: string;
  index?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  cards: Omit<BusinessCardProps, 'variant' | 'className'>[];
  /**
   * `featured` (default): lini pertama tampil besar di kiri, sisanya baris ringkas di kanan —
   * cocok untuk 3–4 lini. `grid`: semua kartu sama besar, untuk portofolio yang lebih banyak.
   */
  layout?: BusinessLayout;
};

/** Lini bisnis / portofolio: satu lini utama + daftar ringkas, atau grid rata. */
export default function BusinessSection({
  id,
  titleId = `${id ?? 'business'}-title`,
  index,
  eyebrow,
  title,
  lead,
  cards,
  layout = 'featured',
}: BusinessSectionProps) {
  const [first, ...rest] = cards;
  return (
    <Section id={id} tone="muted" labelledBy={titleId}>
      <SectionHeading id={titleId} index={index} eyebrow={eyebrow} title={title} lead={lead} />
      {layout === 'featured' && first ? (
        <div className="mt-16 grid gap-x-16 gap-y-10 lg:grid-cols-12" data-reveal-group>
          <BusinessCard {...first} variant="featured" className="lg:col-span-7" />
          <div className="divide-y divide-neutral-200 border-y border-neutral-200 lg:col-span-5 lg:self-start">
            {rest.map((card) => (
              <BusinessCard key={card.title} {...card} variant="compact" />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
          data-reveal-group
        >
          {cards.map((card) => (
            <BusinessCard key={card.title} {...card} />
          ))}
        </div>
      )}
    </Section>
  );
}
