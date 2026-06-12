import { createPortal } from "react-dom";

const Toast = ({ message }) => {
  if (!message) return null;
  return createPortal(
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999
                    bg-zinc-800 text-white text-sm px-4 py-2 rounded-lg
                    shadow-lg border border-zinc-600 animate-fade-in"
    >
      {message}
    </div>,
    document.body,
  );
};

export default Toast;
