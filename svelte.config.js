module.exports = {
	preprocess: {
		style: async () => {
			return new Promise((resolve) => {
				resolve({ code: '', map: '' })
			})
		},
	},
}
