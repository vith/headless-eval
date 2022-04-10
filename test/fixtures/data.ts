export const harvardSentences = [
	'Oak is strong and also gives shade.',
	'Cats and dogs each hate the other.',
	'The pipe began to rust while new.',
]

export const sentencesQuerySelector = () =>
	[...document.querySelectorAll("ul#harvard-sentences > li")]
		.map(li => {
			if (!(li instanceof HTMLLIElement))
				throw new TypeError
			return li.innerText
		})

export const sentencesQuerySelectorStringified = `(${sentencesQuerySelector})()`
