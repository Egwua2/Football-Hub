import { useState } from "react";

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

    if (!urls.includes(httpsUrl)) {
      urls.push(httpsUrl);
    }

    if (httpsUrl.includes("www.thesportsdb.com/images/media/")) {
      const r2Url = httpsUrl.replace(
        "www.thesportsdb.com/images/media/",
        "r2.thesportsdb.com/images/media/"
      );

      if (!urls.includes(r2Url)) {
        urls.push(r2Url);
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
      setImageIndex(imageIndex + 1);
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
        src={imageUrl}
        alt={player?.name || player?.strPlayer || "Football player"}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
}

export default PlayerAvatar;