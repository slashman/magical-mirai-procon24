import Animation from "./Animation";

const mikuAnimation = new Animation({
	prefix: 'img/miku2/mikub',
	suffix: '.png',
	startIndex: 1,
	frames: [
		{
			eyeX: 0,
			eyeY: 0
		},
		{
			eyeX: 0,
			eyeY: 0
		},
		{
			eyeX: 0,
			eyeY: 0
		},
		{
			eyeX: 1,
			eyeY: 5
		},
		{
			eyeX: 10,
			eyeY: 1
		},
		{
			eyeX: 11,
			eyeY: 2
		},
		{
			eyeX: 10,
			eyeY: 2
		},
		{
			eyeX: 10,
			eyeY: 0
		},
		{
			eyeX: 4,
			eyeY: 6
		},
		{
			eyeX: -1,
			eyeY: 1
		},
		{
			eyeX: 1,
			eyeY: 2
		}
	]}
);
const animations: Animation[] = [
	mikuAnimation
];

export default animations;