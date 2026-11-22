import { useEffect, useRef, useState } from "react";
import "./CityBackground.css";

export default function CityBackground({ city }) {
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [previousPhoto, setPreviousPhoto] = useState(null);

  const currentPhotoRef = useRef(null);

  useEffect(() => {
    if (!city) return;

    let cancelled = false;

    async function loadCityPhoto() {
      try {
        const response = await fetch(
          `/.netlify/functions/unsplash-photo?city=${encodeURIComponent(city)}`,
        );

        if (!response.ok) {
          throw new Error("Unable to find a city photograph.");
        }

        const photo = await response.json();

        const image = new Image();

        image.onload = async () => {
          if (cancelled) return;

          try {
            const trackingResponse = await fetch(
              "/.netlify/functions/unsplash-download",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  downloadLocation: photo.downloadLocation,
                }),
              },
            );

            if (!trackingResponse.ok) {
              throw new Error("Photograph tracking failed.");
            }

            if (cancelled) return;

            setPreviousPhoto(currentPhotoRef.current);
            currentPhotoRef.current = photo;
            setCurrentPhoto(photo);
          } catch (error) {
            console.error("Photograph tracking error:", error);
          }
        };

        image.onerror = () => {
          if (!cancelled) {
            console.error("Unable to load the city photograph.");
          }
        };

        image.src = photo.imageUrl;
      } catch (error) {
        if (!cancelled) {
          console.error("City background error:", error);
        }
      }
    }

    loadCityPhoto();

    return () => {
      cancelled = true;
    };
  }, [city]);

  useEffect(() => {
    if (!previousPhoto) return;

    const timeout = setTimeout(() => {
      setPreviousPhoto(null);
    }, 1600);

    return () => clearTimeout(timeout);
  }, [currentPhoto, previousPhoto]);

  return (
    <div className="city-background">
      {previousPhoto && (
        <div
          className="city-background-image previous-photo"
          style={{
            backgroundImage: `url("${previousPhoto.imageUrl}")`,
          }}
          aria-hidden="true"
        />
      )}

      {currentPhoto && (
        <div
          key={currentPhoto.photoUrl}
          className="city-background-image current-photo"
          style={{
            backgroundImage: `url("${currentPhoto.imageUrl}")`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="city-background-overlay" />

      {currentPhoto && (
        <div className="photo-attribution">
          Photo by{" "}
          <a
            href={`${currentPhoto.photographerUrl}?utm_source=AppAround&utm_medium=referral`}
            target="_blank"
            rel="noreferrer"
          >
            {currentPhoto.photographer}
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/?utm_source=AppAround&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </div>
      )}
    </div>
  );
}
