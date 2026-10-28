import { useState } from "react";
import { getPlayerImageUrl } from "../services/api";

function makeImageUrls(player) {
  const sources = [
    player?.photo,
    player?.image,
    player?.strThumb,
    player?.strCutout,
    player?.strRender,
  ];

  const urls = [];

  sources.forEach((source) => {
    if (!source || typeof source !== "string") return;

    const httpsUrl = source.replace(/^http:\/\//i, "https://");
    const imageUrl = getPlayerImageUrl(httpsUrl);

    if (imageUrl && !urls.includes(imageUrl)) {
      urls.push(imageUrl);
    }

    // Try the alternate SportsDB image host as a fallback for older pictures.
    if (httpsUrl.includes("www.thesportsdb.com/images/media/")) {
      const r2Url = httpsUrl.replace(
        "www.thesportsdb.com/images/media/",
        "r2.thesportsdb.com/images/media/"
      );
      const proxiedR2Url = getPlayerImageUrl(r2Url);

      if (proxiedR2Url && !urls.includes(proxiedR2Url)) {
        urls.push(proxiedR2Url);
      }
    }
  });

  return urls;
}

function PlayerAvatar({ player, small = false }) {
  const imageUrls = makeImageUrls(player);
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrl = imageUrls[imageIndex];

  function handleImageError() {
    if (imageIndex < imageUrls.length - 1) {
      setImageIndex((current) => current + 1);
    }
  }

  if (!imageUrl) {
    return (
      <div
        className={
          small
            ? "player-avatar-placeholder small"
            : "player-avatar-placeholder"
        }
      >
        ⚽
      </div>
    );
  }

  return (
    <div className="player-avatar-wrap">
      <img
        className={small ? "player-avatar small" : "player-avatar"}
        crossOrigin="anonymous"
        src={imageUrl}
        alt={player?.name || player?.strPlayer || "Football player"}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
}

export default PlayerAvatar;
