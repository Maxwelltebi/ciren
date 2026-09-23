import type { Testimonial } from "../types/content";
import Modal from "./Modal";

export default function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={!!testimonial}
      onClose={onClose}
      labelledBy="testimonial-name"
      closeLabel="Close testimonial"
      className="max-w-lg bg-[#0B0F19] border border-white/20"
    >
      {testimonial && (
        <>
          <div className="relative h-52 sm:h-64">
            <img
              src={testimonial.image}
              alt={testimonial.alt}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-black/20" />
            <span className="absolute left-6 top-6 inline-flex items-center px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#40b830] text-white shadow-sm">
              {testimonial.badge}
            </span>
          </div>
          <div className="relative px-6 pb-7 sm:px-8 sm:pb-8">
            <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-100 mb-6">
              {testimonial.quote}
            </p>
            <div className="border-t border-white/20 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs text-white border border-white/30">
                {testimonial.initials}
              </div>
              <div>
                <h4
                  id="testimonial-name"
                  className="text-sm sm:text-base font-bold text-white leading-tight font-display"
                >
                  {testimonial.name}
                </h4>
                <p className="text-xs text-emerald-300 font-medium">
                  {testimonial.university}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
