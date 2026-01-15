// API Helper for connecting React to WordPress
// REPLACE THIS with your actual domain
const WP_API_URL = 'https://cruisytravel.com/wp-json';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

// 1. Login
export async function loginUser(username, password) {
  const response = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

// 2. Fetch User Profile (Includes ACF Fields)
export async function getUserProfile(token) {
  const response = await fetch(`${WP_API_URL}/wp/v2/users/me?context=edit`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

// 3. Update Profile (Saves Bio, Selected Itineraries, Name)
export async function updateAmbassadorProfile(userId, token, data) {
  const response = await fetch(`${WP_API_URL}/wp/v2/users/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: data.name, // Updates standard WP Display Name
      acf: {
        bio: data.bio,
        // Ensure we send JUST the IDs to the relationship field
        featured_itineraries: data.featuredActivities.map(a => a.id) 
      }
    })
  });
  return handleResponse(response);
}

// 4. Search Itineraries (For the Selector Tool)
export async function searchItineraries(term = '') {
  // Fetches 'itinerary' CPT. 
  // IMPORTANT: Ensure 'itinerary' CPT has "Show in REST API" = true
  const endpoint = `${WP_API_URL}/wp/v2/itinerary?search=${term}&per_page=20&_fields=id,title,acf,featured_media_url`;
  const response = await fetch(endpoint);
  const data = await handleResponse(response);
  
  // Transform WP data to match our App's format
  return data.map(item => ({
    id: item.id,
    title: item.title.rendered,
    // Assuming you have an ACF field 'location' and 'price' on the itinerary CPT
    location: item.acf?.location || '', 
    price: item.acf?.price || 0,
    image: item.featured_media_url || '', // Requires a plugin to expose media URL, or standard media fetching
    type: 'activity' // You can refine this logic later based on categories
  }));
}
