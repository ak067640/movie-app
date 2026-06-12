import axios from "axios";
import { useState } from "react";

const useTrailer = () => {
  const API_Key = import.meta.env.VITE_TMDB_KEY;
  const [videoError, setVideoError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const fetchTrailer = async (id, media_type) => {
    try {
      setVideoError(null);

      const response = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${API_Key}`,
      );

      const trailer = response.data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube",
      );

      if (!trailer) {
        setVideoError("Trailer is not available");
        setTimeout(() => setVideoError(null), 3000);
        return;
      }
      setTrailerKey(trailer.key);
    } catch (err) {
      setVideoError(err.message);
    }
  };

  const closeTrailer = () => {
    setTrailerKey(null);
    setVideoError(null);
  };
  return { trailerKey, videoError, fetchTrailer, closeTrailer };
};

export default useTrailer;
