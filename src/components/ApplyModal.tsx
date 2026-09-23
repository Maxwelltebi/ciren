import applyForm from "../data/applyForm.json";
import ContentForm from "./ContentForm";
import Modal from "./Modal";

export default function ApplyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="apply-title"
      closeLabel="Close application form"
    >
      <div className="bg-[#0B0F19] px-6 py-7 sm:px-8">
        <h3
          id="apply-title"
          className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight font-display"
        >
          {applyForm.title}
        </h3>
        <p className="text-sm text-slate-300 font-normal mt-2 max-w-md">
          {applyForm.intro}
        </p>
      </div>
      <ContentForm
        id="apply"
        definition={applyForm}
        successMessage="Thank you. Your application has been received."
        submitClassName="bg-[#40b830] hover:bg-[#329e24]"
      />
    </Modal>
  );
}
