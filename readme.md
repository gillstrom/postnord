# postnord [![Build Status](https://travis-ci.org/gillstrom/postnord.svg?branch=master)](https://travis-ci.org/gillstrom/postnord)

> Track PostNord letters, parcels and pallets by their item ID number


## CLI

```
$ npm install --global postnord
```

```
$ postnord --help

  Usage
    $ postnord [ID]

  Options
    -a, --apikey    PostNord API key
    -l, --locale    Default is en. Allowed values are en, sv, no, da and fi

  Example
    $ postnord 12371563697SE
```


## Install

```
$ npm install --save postnord
```


## Usage

```js
const postnord = require('postnord');

postnord('12371563697SE', {apikey: 'aa956a2d13a54a152dba849b76288cf4'}).then(result => {
	console.log(result);
	//=> {'TrackingInformationResponse': {'shipments': [ ...}
});
```


## API

### postnord(ID, [options])

Returns a promise that resolves in to an object.

#### ID

*Required*<br>
Type: `string`

The item ID to track.

#### options

##### apikey

Type: `string`<br>
Default: My own, [please use your own.](https://developer.postnord.com)

The unique PostNord API key.

##### locale

Type: `string`<br>
Default: `'en'`

Returns the result in different languages. Allowed values are `'en'`, `'sv'`, `'no'`, `'da'` and `'fi'`.


## License

MIT © [Andreas Gillström](http://github.com/gillstrom)
