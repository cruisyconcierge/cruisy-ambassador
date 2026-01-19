// API Helper for connecting React to WordPress via Vercel Proxy

// 1. PROXY URL (Bypasses CORS)
const WP_API_URL = '/api/wp';

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("API Error (Non-JSON):", text);
    throw new Error("Server returned an HTML error. Check console.");
  }
  if (!response.ok) {
    const error = await response.json();
    console.error("WP API Error:", error);
    // Provide a more specific error message if available
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
  const acfData = {};
  
  // Only add fields if they exist in the data object
  if (data.bio !== undefined) acfData.bio = data.bio;
  
  if (data.featuredActivities && Array.isArray(data.featuredActivities)) {
    // Map full objects back to just IDs for the relationship field
    acfData.featured_itineraries = data.featuredActivities.map(a => a.id);
  }
  
  if (data.gallery) {
    // Convert array back to string for Text Area storage
    acfData.travel_gallery = JSON.stringify(data.gallery);
  }
  
  if (data.plan) acfData.membership_tier = data.plan;

  const payload = { acf: acfData };
  
  // Only send name if explicitly changed
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
    
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: postData.title,
      content: postData.content,
      status: 'pending', // Pending review
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
