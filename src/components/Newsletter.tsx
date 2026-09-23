import RichText from "./RichText";
import home from "../data/home.json";

export default function Newsletter() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16 border-b border-white/10">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-1 bg-white/90 rounded-full"></div>
          </div>
          <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#40b830]">
            <RichText html={home.newsletter.eyebrow} />
          </span>
          <h3
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight tracking-tight pt-1"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: "700",
            }}
          >
            <RichText html={home.newsletter.heading} />
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-normal pt-1 max-w-lg">
            <RichText html={home.newsletter.body} />
          </p>
        </div>

        <div className="lg:col-span-6 w-full max-w-xl lg:ml-auto space-y-5 pt-2">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              window.alert("Thank you for subscribing to CIReN Newsletter!");
            }}
          >
            <div>
              <label
                htmlFor="newsletter-name"
                className="block text-xs sm:text-sm font-semibold text-white mb-2 tracking-wide"
              >
                <RichText html={home.newsletter.nameLabel} />
              </label>
              <input
                id="newsletter-name"
                name="name"
                autoComplete="name"
                type="text"
                required
                placeholder={`${home.newsletter.namePlaceholder}`}
                className="w-full h-11 px-4 rounded-none bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#40b830] border-none shadow-inner text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="newsletter-email"
                className="block text-xs sm:text-sm font-semibold text-white mb-2 tracking-wide"
              >
                <RichText html={home.newsletter.emailLabel} />
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <input
                  id="newsletter-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder={`${home.newsletter.emailPlaceholder}`}
                  className="flex-1 h-11 px-4 rounded-none bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#40b830] border-none shadow-inner text-sm"
                />
                <button
                  type="submit"
                  className="h-11 px-6 bg-[#40b830] hover:bg-[#329e24] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                >
                  <span className="">
                    <RichText html={home.newsletter.submitLabel} />
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
