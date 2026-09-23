import partners from "../data/partners.json";

export default function PartnersMarquee() {
  return (
    <section
      className="bg-white pt-8 pb-14 border-b border-gray-100"
      aria-labelledby="partners-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2
          id="partners-heading"
          className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-8"
        >
          Partners
        </h2>
        <div className="partners-viewport relative overflow-hidden py-3">
          <div
            aria-hidden="true"
            className="partners-fade pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="partners-fade pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10"
          />
          <div className="partners-track animate-marquee items-center">
            {[false, true].map((duplicate) => (
              <ul
                key={String(duplicate)}
                aria-hidden={duplicate || undefined}
                className={`partners-group${duplicate ? " partners-duplicate" : ""}`}
              >
                {partners.map((partner) => (
                  <li
                    key={partner.name}
                    className="flex items-center justify-center w-56 sm:w-64 h-24 shrink-0"
                  >
                    <img
                      src={partner.logo}
                      alt={duplicate ? "" : partner.name}
                      className="w-full h-20 object-contain"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
