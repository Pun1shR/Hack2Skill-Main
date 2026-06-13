import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const parser = new Parser();

// Array of known stable mental health RSS feeds
const BLOG_FEEDS = [
  'https://medium.com/feed/tag/mental-health',
  'https://medium.com/feed/tag/mindfulness',
  'https://www.psychiatry.org/news-room/news-releases/rss'
];

// Simple in-memory cache to prevent spamming RSS feeds on every single reload
let cachedBlogs: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
  try {
    const now = Date.now();
    if (cachedBlogs && (now - cacheTimestamp < CACHE_DURATION)) {
      return NextResponse.json(cachedBlogs);
    }

    let allArticles: any[] = [];

    // Fetch from all feeds in parallel
    await Promise.all(BLOG_FEEDS.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);
        if (feed.items) {
          // Take top 3 from each
          feed.items.slice(0, 3).forEach(item => {
            allArticles.push({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              source: feed.title || 'Mental Health Blog'
            });
          });
        }
      } catch (err) {
        console.warn('Failed to fetch feed:', feedUrl, err);
      }
    }));

    // Shuffle and pick 4
    allArticles = allArticles.sort(() => 0.5 - Math.random()).slice(0, 4);

    cachedBlogs = allArticles;
    cacheTimestamp = now;

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json([], { status: 500 });
  }
}
