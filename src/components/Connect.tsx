import Newsletter from "./Newsletter";
import Footer from "./Footer";

export default function Connect() {
  return (
    <section className="bg-[#0B0F19] text-white" id="connect-section">
      <div className="site-container pt-14">
        <Newsletter />
        <Footer />
      </div>
    </section>
  );
}
