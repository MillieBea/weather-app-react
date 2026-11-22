export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return Response.json(
      { error: "Unsplash API key is missing." },
      { status: 500 },
    );
  }

  try {
    const { downloadLocation } = await request.json();

    if (!downloadLocation) {
      return Response.json(
        { error: "Download location is missing." },
        { status: 400 },
      );
    }

    const downloadUrl = new URL(downloadLocation);

    if (
      downloadUrl.hostname !== "api.unsplash.com" ||
      !/^\/photos\/[^/]+\/download$/.test(downloadUrl.pathname)
    ) {
      return Response.json(
        { error: "Invalid download location." },
        { status: 400 },
      );
    }

    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash returned status ${response.status}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Unsplash download tracking error:", error);

    return Response.json(
      { error: "Unable to track photograph usage." },
      { status: 500 },
    );
  }
};
