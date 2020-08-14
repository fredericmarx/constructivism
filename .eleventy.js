module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/fonts");

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
