import React from "react";

// Reusable card for both cast (actors) and crew members
// isActor flag switches display between character name and job title
const ProfileCard = ({ name, character, job, isActor, imagePath }) => {
  return (
    <div className="user-card py-4 w-40 sm:w-44 text-primary rounded-xl overflow-hidden flex flex-col gap-2 items-center shrink-0">
      {/* Fallback to placeholder if TMDB profile image is unavailable */}
      <img
        src={
          imagePath
            ? `https://image.tmdb.org/t/p/w185/${imagePath}`
            : `https://placehold.co/185x185?text=N/A`
        }
        alt={name}
        className="rounded-full w-36 object-cover object-center h-36 text-center"
      />
      <div className="flex flex-col items-center px-2">
        <p className="font-bold text-sm text-center w-full px-1 line-clamp-2">
          {name}
        </p>
        <p className="text-sm">{isActor ? character : job}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
