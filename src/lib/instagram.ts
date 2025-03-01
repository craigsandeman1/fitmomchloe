interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
}

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts');
    }

    const data = await response.json();
    return data.data.slice(0, 5); // Get latest 5 posts
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}