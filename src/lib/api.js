// API Helper for connecting React to WordPress

const WP_API_URL = 'https://cruisytravel.com/wp-json';

// Helper to handle response errors
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

// 1. Authenticate User (Get JWT Token)
export async function loginUser(username, password) {
  const response = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

// 2. Register User (Requires custom endpoint or WP REST User plugin)
// For V1 MVP: We will simulate registration success or require manual WP creation
// To make this real, install "WP REST User" plugin to allow public registration via REST
export async function registerUser(email, name, password) {
  const response = await fetch(`${WP_API_URL}/wp/v2/users/register`, { // Requires plugin
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, email, password, name }),
  });
  return handleResponse(response);
}

// 3. Fetch Itineraries (CPT)
export async function getItineraries(search = '') {
  const endpoint = `${WP_API_URL}/wp/v2/itinerary?per_page=20&search=${search}&_fields=id,title,acf,featured_media_url`;
  const response = await fetch(endpoint);
  return handleResponse(response);
}

// 4. Update Ambassador Profile (ACF Fields on User)
export async function updateAmbassadorProfile(userId, token, data) {
  const response = await fetch(`${WP_API_URL}/wp/v2/users/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: data.name,
      acf: {
        bio: data.bio,
        featured_itineraries: data.featuredActivities.map(a => a.id) // Sending IDs to relationship field
      }
    })
  });
  return handleResponse(response);
}
