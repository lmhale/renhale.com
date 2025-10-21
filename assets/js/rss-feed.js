// RSS Feed Display
class RSSFeed {
  constructor() {
    this.feedUrl = 'feed.xml';
    this.maxItems = 4;
  }

  async loadRSSFeed() {
    try {
      const response = await fetch(this.feedUrl);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const items = xmlDoc.querySelectorAll('item');
      const feedItems = Array.from(items).slice(0, this.maxItems);
      
      return feedItems.map(item => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const category = item.querySelector('category')?.textContent || '';
        
        return {
          title: title,
          description: description,
          link: link,
          pubDate: pubDate,
          category: category
        };
      });
    } catch (error) {
      console.error('Error loading RSS feed:', error);
      return [];
    }
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  getTypeIcon(category) {
    return category === 'Article' ? '📝' : '✏️';
  }

  renderFeedItem(item) {
    const typeIcon = this.getTypeIcon(item.category);
    const formattedDate = this.formatDate(item.pubDate);
    const relativePath = this.getRelativePath(item.link);
    
    return `
      <article class="h-entry feed-item">
        <div class="feed-item-header">
          <span class="feed-item-type">${typeIcon}</span>
          <div class="feed-item-meta">
            <h3 class="p-name">
              <a href="${relativePath}">${item.title}</a>
            </h3>
            <time class="dt-published" datetime="${item.pubDate}">${formattedDate}</time>
          </div>
        </div>
        <div class="e-content">
          <p>${item.description}</p>
          ${item.category === 'Article' ? `<p><a href="${relativePath}">Read more →</a></p>` : ''}
        </div>
      </article>
    `;
  }

  getRelativePath(absoluteUrl) {
    // Convert absolute URL to relative path for local development
    if (absoluteUrl.includes('renhale.dev')) {
      return absoluteUrl.replace('https://renhale.dev/', '');
    }
    return absoluteUrl;
  }

  renderFeed(feedItems) {
    const container = document.getElementById('content-feed');
    if (!container) return;

    const feedHTML = feedItems.map(item => this.renderFeedItem(item)).join('');
    container.innerHTML = feedHTML;
  }

  async init() {
    try {
      const feedItems = await this.loadRSSFeed();
      this.renderFeed(feedItems);
    } catch (error) {
      console.error('Error initializing RSS feed:', error);
      const container = document.getElementById('content-feed');
      if (container) {
        container.innerHTML = '<p>Unable to load recent content. <a href="feed.xml">View RSS feed</a></p>';
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const feed = new RSSFeed();
  feed.init();
});
