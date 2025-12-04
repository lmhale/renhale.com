const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Date formatting filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return '';
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL dd, yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return '';
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Note: rssDate filter is provided by @11ty/eleventy-plugin-rss
  
  // XML escaping filter for RSS feed
  eleventyConfig.addFilter("xml", (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  });
  
  // Concat filter for combining arrays
  eleventyConfig.addFilter("concat", (arr1, arr2) => {
    return [...arr1, ...arr2];
  });
  
  // Slice filter for limiting array items
  eleventyConfig.addFilter("slice", (arr, start, end) => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(start, end);
  });

  // Add shortcode for current year
  eleventyConfig.addShortcode("year", () => {
    year = new Date().getFullYear().toString();
    return year;
  })

  // Add filter for current date (for sitemap)
  eleventyConfig.addFilter("nowDate", () => {
    return DateTime.now().toFormat('yyyy-LL-dd');
  })


  // Collections
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("houseofren/articles/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob("houseofren/notes/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("allContent", function(collectionApi) {
    const articles = collectionApi.getFilteredByGlob("houseofren/articles/*.md");
    const notes = collectionApi.getFilteredByGlob("houseofren/notes/*.md");
    const all = [...articles, ...notes];
    return all.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });
  });

  // Ignore layout files - they're templates, not content
  eleventyConfig.ignores.add("_includes/layouts/**");
  
  // Ignore old HTML files (we're using Markdown/Nunjucks now)
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("houseofren/**/*.html");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: "/"
  };
};

