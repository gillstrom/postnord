#!/usr/bin/env node
'use strict';
const arrify = require('arrify');
const capitalize = require('capitalize');
const chalk = require('chalk');
const easydate = require('easydate');
const meow = require('meow');
const ora = require('ora');
const fn = require('./');

const cli = meow([`
	Usage
	  $ postnord [ID]

	Options
	  -a, --apikey    PostNord API key
	  -l, --locale    Default is en. Allowed values are en, sv, no, da and fi

	Examples
	  $ postnord 12371563697SE
`], {
	alias: {
		a: 'apikey',
		l: 'locale'
	},
	string: ['_']
});

if (!cli.input[0]) {
	console.error(chalk.red('Expected a shipment or item identifier'));
	process.exit(1);
}

const spinner = ora('Loading shipment information');
spinner.start();

const log = arr => console.log(arrify(arr).map(x => `\t${x}`).join('\n'));

const getEvents = arr => {
	if (!arr || arr.length === 0) {
		return;
	}

	arr.reverse();
	arr.forEach(x => {
		log([
			`${easydate('Y-M-d h:m', {setDate: `${x.eventTime}+0200`, timeZone: 'local'})} - ${x.location.displayName}`,
			`\u00A0\u00A0${chalk.dim(x.eventDescription)}`,
			''
		]);
	});
};

const getMeasurement = obj => {
	for (const x in obj) {
		if (x) {
			log(`${capitalize(x)}:\t\t${obj[x].value} ${obj[x].unit}`);
		}
	}
};

const getItems = arr => arr.forEach(obj => {
	log(['', obj.statusText.body]);

	if (obj.acceptor) {
		log(chalk.dim(`  Signed by: ${obj.acceptor.name}`));
	}

	log(['', '']);
	getEvents(obj.events);
	getMeasurement(obj.statedMeasurement);
});

const print = obj => {
	log(['', `${obj.shipmentId} - ${obj.status.replace('_', '')}`]);

	if (!obj.deliveryDate) {
		log(chalk.dim(`  Estimated delivery: ${easydate('Y-M-d h:m', {setDate: `${obj.estimatedTimeOfArrival}+0200`, timeZone: 'local'})}`));
	}

	getItems(obj.items);
	log(['', `Sender:\t\t${obj.consignor.name}`]);

	if (obj.consignor.address) {
		log([
			`\t\t${obj.consignor.address.postCode || ''} ${obj.consignor.address.city || ''}`,
			`\t\t${obj.consignor.address.country || ''}`
		]);
	}

	log([
		'',
		`Recipient:\t${obj.consignee.address.postCode || ''} ${obj.consignee.address.city || ''}`,
		`\t\t${obj.consignee.address.country || ''}`
	]);
};

fn(cli.input[0], {apikey: cli.flags.apikey, locale: cli.flags.locale}).then(res => {
	spinner.stop();

	if (res.TrackingInformationResponse.shipments.length === 0) {
		console.error(chalk.red('Couldn\'t find any shipments with this ID'));
	}

	res.TrackingInformationResponse.shipments.forEach(x => print(x));
});
