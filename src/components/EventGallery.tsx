import { useCallback, useState } from "react";
import gallery from "../data/gallery.json";
import type { GalleryEvent } from "../types/gallery";
import EventPhotoStack from "./EventPhotoStack";

export default function EventGallery() {
  const [selected, setSelected] = useState<GalleryEvent | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const events: GalleryEvent[] = gallery.events;

  return (
    <section className="py-20 lg:py-24 bg-white" id="gallery">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mb-4 text-slate-800 font-bold font-display">{gallery.heading}</h2>
          <div className="h-1 w-12 bg-[#40b830] rounded-full mx-auto mb-5" />
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">{gallery.intro}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map(event => (
            <button key={event.id} type="button" onClick={() => setSelected(event)} aria-haspopup="dialog" aria-label={`View photos from ${event.name}`} className="event-gallery-card group text-left rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#40b830]/60 focus-visible:ring-offset-8">
              <span className="relative block aspect-[4/3] mx-3 mb-7">
                <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-[#E8F8E5] border border-[#40b830]/25 rotate-6 translate-y-2 transition-transform group-hover:rotate-[8deg]" />
                <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-slate-100 border border-slate-200 -rotate-3 translate-y-1" />
                <span className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0B0F19] shadow-xl border border-white/20">
                  {event.photos[0] ? <img src={event.photos[0].src} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-center px-8"><span className="font-display text-3xl text-white leading-tight">CIReN<br /><span className="text-[#68e053] text-lg font-sans">Mini Hackathon x MLH</span></span></span>}
                  <span className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#046e00]">{event.photos.length ? `${event.photos.length} ${event.photos.length === 1 ? "photo" : "photos"}` : "Photos coming soon"}</span>
                </span>
              </span>
              <span className="block text-xl font-bold text-[#0B0F19] font-display mb-2">{event.name}</span>
              <span className="text-sm font-semibold text-[#046e00]">View gallery <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
      </div>
      {selected && <EventPhotoStack key={selected.id} event={selected} onClose={close} />}
    </section>
  );
}
