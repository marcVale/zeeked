import type { RawContentItem } from './content-types';

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

async function fetchTopStoryIds(): Promise<number[]> {
  const response = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json'
  );
  
  if (!response.ok) {
    throw new Error(`HN API error: ${response.status}`);
  }
  
  const ids = await response.json();
  return ids.slice(0, 30);
}

async function fetchStory(id: number): Promise<HNStory | null> {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
}

export async function fetchHackerNews(): Promise<RawContentItem[]> {
  try {
    const storyIds = await fetchTopStoryIds();
    
    const stories = await Promise.all(
      storyIds.map(id => fetchStory(id))
    );
    
    const validStories = stories.filter((s): s is HNStory => 
      s !== null && s.title !== undefined
    );

    return validStories.map((story): RawContentItem => ({
      id: `hn-${story.id}`,
      title: story.title,
      description: '',
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      publishedAt: new Date(story.time * 1000).toISOString(),
      source: 'Hacker News',
      category: 'tech',
      author: story.by,
      engagement: {
        likes: story.score,
        comments: story.descendants || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}
