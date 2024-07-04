import Animation from "./Animation";

const mikuAnimation = new Animation({
	prefix: 'img/miku2/mikub',
	suffix: '.png',
	startIndex: 1,
	frames: [
		{
			eyeX: 220,
			eyeY: 176
		},
		{
			eyeX: 220,
			eyeY: 181
		},
		{
			eyeX: 227,
			eyeY: 179
		},
		{
			eyeX: 231,
			eyeY: 177
		},
		{
			eyeX: 233,
			eyeY: 174
		},
		{
			eyeX: 235,
			eyeY: 172
		},
		{
			eyeX: 235,
			eyeY: 173
		},
		{
			eyeX: 230,
			eyeY: 176
		},
		{
			eyeX: 220,
			eyeY: 174
		},
		{
			eyeX: 219,
			eyeY: 176
		},
		{
			eyeX: 219,
			eyeY: 177
		}
	]}
);
const animations: Animation[] = [
	mikuAnimation
];

export default animations;