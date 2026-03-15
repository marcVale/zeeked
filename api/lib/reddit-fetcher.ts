import type { RawContentItem } from './content-types';

const SUBREDDITS = [
  { name: 'technology', category: 'tech' },
  { name: 'worldnews', category: 'general' },
  { name: 'science', category: 'science' },
  { name: 'sports', category: 'sports' },
  { name: 'movies', category: 'entertainment' },
  { name: 'gaming', category: 'gaming' },
  { name: 'business', category: 'business' },
  { name: 'health', category: 'health' },
  { name: 'space', category: 'science' },
  { name: 'anime', category: 'anime' },
];

interface RedditPost {
  data: {
    title: string;
    selftext?: string;
    url: string;
    permalink: string;
    created_utc: number;
    ups: number;
    num_comments: number;
    thumbnail?: string;
    preview?: {
      images?: Array<{
        source: { url: string };
      }>;
    };
    subreddit: string;
    author: string;
  };
}

export async function fetchRedditPosts(): Promise<RawContentItem[]> {
  const allPosts: RawContentItem[] = [];

  const fetchPromises = SUBREDDITS.map(async (subreddit) => {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit.name}/hot.json?limit=10`,
        {
          headers: {
            'User-Agent': 'ZeekedBot/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      const posts: RedditPost[] = data.data?.children || [];

      const items = posts.map((post): RawContentItem => {
        const imageUrl = post.data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') ||
                        (post.data.thumbnail && post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default' 
                          ? post.data.thumbnail 
                          : undefined);

        return {
          id: post.data.permalink,
          title: post.data.title,
          description: post.data.selftext?.slice(0, 300),
          url: `https://reddit.com${post.data.permalink}`,
          image: imageUrl,
          publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
          source: `r/${subreddit.name}`,
          category: subreddit.category,
          author: post.data.author,
          engagement: {
            likes: post.data.ups,
            comments: post.data.num_comments,
          },
        };
      });

      allPosts.push(...items);
    } catch (error) {
      console.error(`Error fetching r/${subreddit.name}:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return allPosts;
}
