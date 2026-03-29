import { googleMapsEmbedSrc, googleMapsPlaceQuery } from '../lib/googleMapsUrl';
import { cn } from './ui/utils';

type GoogleMapsEmbedProps = {
  /** Official listing name (e.g. “Potlatch State Park”); embedded map searches by name in Washington. */
  parkName: string;
  title: string;
  className?: string;
};

export function GoogleMapsEmbed({ parkName, title, className }: GoogleMapsEmbedProps) {
  const src = googleMapsEmbedSrc({ placeQuery: googleMapsPlaceQuery(parkName) });

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm',
        className,
      )}
    >
      <iframe
        title={title}
        src={src}
        className="aspect-video min-h-[220px] w-full md:min-h-[280px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
