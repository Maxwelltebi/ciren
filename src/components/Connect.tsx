import Newsletter from "./Newsletter";
import Footer from "./Footer";

export default function Connect() {
  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-white"
        id="connect-section"
      >
        <div className="w-full overflow-hidden leading-none bg-transparent">
          <svg
            className="w-full h-16 sm:h-24 lg:h-32 block text-[#0B0F19]"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 Q720,120 1440,0 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        <div className="bg-[#0B0F19] text-white pt-6 pb-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Newsletter />
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
}
