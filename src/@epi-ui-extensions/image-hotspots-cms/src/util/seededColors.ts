// https://stackoverflow.com/a/8134122
export function generateSeededColor (index: number) {

	if (index < 0) throw Error('Value of index should be 0 or higher');

	const hexFiller = 12759242;

	const color = Math.floor((Math.abs(Math.sin(
		// Make sure this is never 0!
		index + 1
	) * hexFiller)));

	if (color === 0) return '000000';

	let hexColor = color.toString(16);

	// Pad any colors shorter than 6 characters with leading 0s
	while(hexColor.length < 6) {
		hexColor = `0${color}`;
	}

	return hexColor;
}