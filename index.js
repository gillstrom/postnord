'use strict';
const condenseKeys = require('condense-keys');
const got = require('got');
const queryString = require('query-string');

module.exports = (id, opts) => {
	opts = Object.assign({
		apikey: 'bb956a2d13a54a152dba849b76288cf4',
		locale: 'en'
	}, condenseKeys(opts), {id});

	if (!opts.apikey) {
		throw new Error('Expected an API key');
	}

	if (typeof id === 'undefined') {
		throw new TypeError('Expected a shipment or item identifier');
	}

	return got(`https://api2.postnord.com/rest/shipment/v1/trackandtrace/findByIdentifier.json?${queryString.stringify(opts)}`, {json: true}).then(res => res.body);
};
