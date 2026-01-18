// API Helper for connecting React to WordPress via Vercel Proxy

// 1. PROXY URL (Bypasses CORS)
const WP_API_URL = '/api/wp';

async function handleResponse(response) {
  // Check content type to ensure we are getting JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    // If not JSON (likely an HTML error page from a plugin breaking), throw text to debug
    const text = await response.text();
    console.error("API Error (Non-JSON):", text);
    throw new Error("Server connection failed. Check console for details.");
  }
  if (!response.ok) {
    const error = await response.json();
    console.error("WP API Error:", error);
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
  const response = await fetch(`${WP_API_URL}/wp/v2/users/me?context=edit&_fields=id,name,email,slug,acf,link,roles`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

export async function updateAmbassadorProfile(userId, token, data) {
  // We strictly separate ACF data to ensure it saves even if 'name' fails permissions
  const acfData = {};
  
  if (data.bio !== undefined) acfData.bio = data.bio;
  
  // Handle Relationship field (Array of IDs)
  if (data.featuredActivities && Array.isArray(data.featuredActivities)) {
    acfData.featured_itineraries = data.featuredActivities.map(a => a.id);
  }
  
  // Handle Gallery (Stringified JSON for Text Area compatibility)
  if (data.gallery) {
    acfData.travel_gallery = JSON.stringify(data.gallery);
  }
  
  if (data.plan) acfData.membership_tier = data.plan;

  const payload = { acf: acfData };
  
  // Only send name if it's actually different/present
  if (data.name) payload.name = data.name;

  const response = await fetch(`${WP_API_URL}/wp/v2/users/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

// --- ITINERARIES ---
export async function searchItineraries(term = '') {
  // Search itineraries via the proxy
  const endpoint = `${WP_API_URL}/wp/v2/itinerary?search=${term}&per_page=20&_fields=id,title,acf,featured_media_url`;
  const response = await fetch(endpoint);
  const data = await handleResponse(response);
  
  return data.map(item => ({
    id: item.id,
    title: item.title?.rendered || 'Untitled',
    location: item.acf?.location || '', 
    price: item.acf?.price || 0,
    image: item.featured_media_url || '', 
    type: 'activity'
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
    content: post.content.raw, 
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
    
  // Use 'pending' status so Subscribers can submit
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: postData.title,
      content: postData.content,
      status: 'pending', 
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
