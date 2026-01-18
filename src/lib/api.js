// API Helper for connecting React to WordPress
// REPLACE THIS with your actual domain
const WP_API_URL = 'https://cruisytravel.com/wp-json';

async function handleResponse(response) {
  // Check content type to ensure we are getting JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    // If not JSON (likely an HTML error page from a plugin breaking), throw text to debug
    const text = await response.text();
    console.error("API Error (Non-JSON response):", text);
    throw new Error("Server error: The site returned an invalid response.");
  }

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
  // Prepare ACF Data structure
  const acfData = {};
  if (data.bio !== undefined) acfData.bio = data.bio;
  if (data.featuredActivities) acfData.featured_itineraries = data.featuredActivities.map(a => a.id);
  if (data.gallery) acfData.travel_gallery = data.gallery; // Assuming ACF Gallery field exists
  if (data.plan) acfData.membership_tier = data.plan;

  const payload = { acf: acfData };
  if (data.name) payload.name = data.name;

  const response = await fetch(`${WP_API_URL}/wp/v2/users/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
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
    title: item.title?.rendered || 'Untitled',
    // Assuming you have an ACF field 'location' and 'price' on the itinerary CPT
    location: item.acf?.location || '', 
    price: item.acf?.price || 0,
    image: item.featured_media_url || '', // Requires a plugin to expose media URL, or standard media fetching
    type: 'activity' // You can refine this based on categories if needed
  }));
}

// --- BLOG POSTS ---
export async function getMyPosts(authorId, token) {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts?author=${authorId}&status=any&_fields=id,title,date,status,link,featured_media_url,content`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await handleResponse(response);
  return data.map(post => ({
    id: post.id,
    title: post.title.rendered,
    content: post.content.raw, // For editing
    date: new Date(post.date).toLocaleDateString(),
    status: post.status,
    image: post.featured_media_url || '',
    link: post.link,
    featured: true 
  }));
}

export async function createBlogPost(token, postData) {
  const endpoint = postData.id 
    ? `${WP_API_URL}/wp/v2/posts/${postData.id}` 
    : `${WP_API_URL}/wp/v2/posts`;
    
  const method = postData.id ? 'POST' : 'POST'; // WP uses POST for update as well in some configs, or PUT

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: postData.title,
      content: postData.content,
      status: 'publish', 
    })
  });
  return handleResponse(response);
}

export async function deleteBlogPost(id, token) {
   const response = await fetch(`${WP_API_URL}/wp/v2/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
