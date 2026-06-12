import { X } from "lucide-react";
import React from "react";

// Renders a fullscreen YouTube trailer modal via React Portal (called from parent)
// Returns null when no trailerKey — keeps DOM clean when modal is closed
const TrailerModal = ({ trailerKey, onClose }) => {
  if (!trailerKey) return;

  return (
    // Fixed overlay — covers full viewport with dark backdrop
    <div className="fixed inset-0 z-999 bg-black/80 flex items-center justify-center">
      <div className="relative w-[90vw] max-w-4xl aspect-video bg-overlay rounded-xl p-1">
        {/* autoplay=1 starts trailer immediately, rel=0 hides YouTube recommendations */}
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&rel=0`}
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-overlay rounded-full p-1 cursor-pointer z-50"
        >
          <X size={20} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;
