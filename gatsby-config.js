module.exports = {
	plugins: [
		{
			resolve: "gatsby-theme-portfolio-minimal",
			options: {
				siteUrl: "https://gatsby-starter-portfolio-minimal-theme.netlify.app/", // Used for sitemap generation
				manifestSettings: {
					favicon: "./content/images/nhlogopro.jpg", // Path is relative to the root
					siteName: "Noah Heraud's Portfolio", // Used in manifest.json
					shortName: "Noah's Portfolio", // Used in manifest.json
					startUrl: "/", // Used in manifest.json
					backgroundColor: "#251C66", // Used in manifest.json
					themeColor: "#7062DE", // Used in manifest.json
					display: "minimal-ui", // Used in manifest.json
				},
				contentDirectory: "./content",
				blogSettings: {
					path: "/portfolio", // Defines the slug for the blog listing page
					usePathPrefixForArticles: false, // Default true (i.e. path will be /blog/first-article)
				},
				// googleAnalytics: {
				//     trackingId: "UA-XXXXXX-X",
				//     anonymize: true, // Default true
				//     environments: ["production", "development"] // Default ["production"]
				// }
			},
		},
	],
};
