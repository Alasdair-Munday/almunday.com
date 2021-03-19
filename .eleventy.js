const htmlmin = require("html-minifier");

module.exports = eleventyConfig => {
  eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  eleventyConfig.addPassthroughCopy({
    "./_tmp/static/css/style.css": "./static/css/style.css",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
  });

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });
  
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
}