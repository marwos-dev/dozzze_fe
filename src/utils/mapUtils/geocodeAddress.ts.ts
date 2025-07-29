export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lon: number } | null> {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'DozzzeApp/1.0',
      },
    });
    const data = await res.json();
    if (data?.length) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}
