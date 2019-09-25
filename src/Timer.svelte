<script>
	export let start;
	const INTERVALS = [1000, 60, 60, 24, 7];

	function d2(v) {
			return ('0' + v).substr(-2);
	}


	function plural(n, f) {n %= 100; if (n > 10 && n < 20) return f[2]; n %= 10; return f[n > 1 && n < 5 ? 1 : n === 1 ? 0 : 2]}

	function offset(start, from = new Date()) {
		let offset = (start - from);
		let direction = offset > 0 ? 1 : offset < 0 ? -1 : 0;

		offset = Math.abs(offset);

		let result = INTERVALS.map(function(value) {
			var result = offset % value;

			offset = (offset - result) / value;

			return result;
		});

		return {
			milliseconds: result[0],
			seconds: result[1],
			minutes: result[2],
			hours: result[3],
			days: result[4],
			weeks: offset,
			direction: direction
		};
	}

	let status;	

	function iterate() {
		status = render();

		if (offset(start).direction !== 1) {
			return;
		}

		setTimeout(iterate, 1000);
	}
	iterate()

	function render() {
		const {
			direction,
			weeks,
			days,
			hours,
			minutes,
			seconds
		} = offset(start);


		if (direction === 1) {
			const result = ['@8E>48B5 G5@57'];

			if (weeks) {
				result.push(weeks + ' ' + plural(weeks, ['=545;N', '=545;8', '=545;L']));
			}
			if (days) {
				result.push(days + ' ' + plural(days, ['45=L', '4=O', '4=59']));
			}

			return `${result.join(' ')} ${d2(hours)}G ${d2(minutes)}< ${d2(seconds)}A`;
		} else {
			return '@5<5=8 =5 >AB0;>AL';
		}
	}
</script>

{status}
