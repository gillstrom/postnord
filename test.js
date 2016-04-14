import test from 'ava';
import fn from './';

test('postnord', async t => {
	t.is(typeof await fn('12324790034SE', {apikey: 'bb956a2d13a54a152dba849b76288cf4'}), 'object');
});
