export const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
    address
  )}&limit=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AI-Smart-Job-Portal/1.0',
      'Accept-Language': 'en',
    },
  });

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error('Location not found');
  }

  const item = data[0];

  return {
    lat: Number(item.lat),
    lng: Number(item.lon),
    displayName: item.display_name,
  };
};

export const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AI-Smart-Job-Portal/1.0',
      'Accept-Language': 'en',
    },
  });

  const data = await response.json();

  return {
    address: data.display_name || '',
    city:
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      '',
    state: data.address?.state || '',
    country: data.address?.country || '',
  };
};