// API Helper for connecting React to WordPress
// CHANGE THIS to your actual domain
const WP_API_URL = 'https://cruisytravel.com/wp-json';

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("API Error:", text);
    throw new Error("Server returned an error. Check console.");
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

// --- AUTHENTICATION ---
export async function loginUser(username, password) {
  const response = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

// --- USER PROFILE ---
export async function getUserProfile(token) {
  const response = await fetch(`${WP_API_URL}/wp/v2/users/me?context=edit`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

export async function updateAmbassadorProfile(userId, token, data) {
  // Prepare ACF Data
  const acfData = {};
  if (data.bio) acfData.bio = data.bio;
  if (data.featuredActivities) acfData.featured_itineraries = data.featuredActivities.map(a => a.id);
  if (data.gallery) acfData.travel_gallery = data.gallery; // Assuming ACF Gallery field

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

// --- ITINERARIES (ACTIVITIES) ---
export async function searchItineraries(term = '') {
  const endpoint = `${WP_API_URL}/wp/v2/itinerary?search=${term}&per_page=20&_fields=id,title,acf,featured_media_url`;
  const response = await fetch(endpoint);
  const data = await handleResponse(response);
  
  return data.map(item => ({
    id: item.id,
    title: item.title?.rendered,
    location: item.acf?.location || '', 
    price: item.acf?.price || 0,
    image: item.featured_media_url || '', 
    type: 'activity' 
  }));
}

// --- BLOG POSTS ---
export async function getMyPosts(authorId, token) {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts?author=${authorId}&status=any&_fields=id,title,date,status,link,featured_media_url`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await handleResponse(response);
  return data.map(post => ({
    id: post.id,
    title: post.title.rendered,
    date: new Date(post.date).toLocaleDateString(),
    status: post.status,
    image: post.featured_media_url || '',
    link: post.link,
    featured: true // You can save "featured" state in a user meta field if needed
  }));
}

export async function createBlogPost(token, postData) {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: postData.title,
      content: postData.content,
      status: 'publish', // or 'draft'
      // featured_media: ID // Uploading images requires a separate media endpoint call
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
