export default async (request) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return Response.json(
      { error: "Unsplash API key is missing." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const city = url.searchParams.get("city")?.trim();

  if (!city) {
    return Response.json({ error: "Please provide a city." }, { status: 400 });
  }

  try {
    const searchUrl = new URL("https://api.unsplash.com/search/photos");

    searchUrl.searchParams.set(
      "query",
      `${city} city landmarks architecture streets`,
    );
    searchUrl.searchParams.set("orientation", "landscape");
    searchUrl.searchParams.set("per_page", "10");
    searchUrl.searchParams.set("content_filter", "high");

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.results?.length) {
      return Response.json(
        { error: "No photographs found for this city." },
        { status: 404 },
      );
    }

    const photos = data.results;
    const photo = photos[Math.floor(Math.random() * photos.length)];

    return Response.json({
      imageUrl: photo.urls.regular,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      photoUrl: photo.links.html,
      downloadLocation: photo.links.download_location,
    });
  } catch (error) {
    console.error("Unsplash function error:", error);

    return Response.json(
      { error: "Unable to retrieve a city photograph." },
      { status: 500 },
    );
  }
};
