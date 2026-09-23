import programs from "../data/programs.json";
import Modal from "./Modal";

export default function CaseStudyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const study = programs.inspiration.caseStudy;
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="case-study-title"
      closeLabel="Close case study"
      className="max-w-3xl bg-white"
    >
      <div className="bg-[#0B0F19] px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#40b830] mb-2">
          Case Study
        </p>
        <h3
          id="case-study-title"
          className="text-2xl sm:text-4xl font-bold text-white leading-tight tracking-tight font-display"
        >
          {study.title}
        </h3>
      </div>
      <div className="px-6 py-8 sm:px-10 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
        {study.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Modal>
  );
}
