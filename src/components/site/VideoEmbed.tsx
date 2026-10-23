import { useState } from "react";
import { Play } from "lucide-react";
import "./video-embed.css";

/**
 * A YouTube video shown as a locally stored poster. Nothing loads from YouTube until the
 * visitor presses play, and the player then uses the privacy-enhanced domain.
 */
export function VideoEmbed({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title: string;
  poster: string;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-embed">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          <img src={poster} alt="" loading="lazy" width="1280" height="720" />
          <span className="video-embed-play" aria-hidden="true">
            <Play size={28} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
