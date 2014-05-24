# node-legendastv
 
Node.js client for popular brazilian subtitle site [legendas.tv](http://www.legendas.tv).

## Install

```sh
$ npm install node-legendastv
```

## API

```js
var legendastv = require('node-legendastv')
```

### search(termo, opts, cb)

- `termo` a string used for find series. This is required. Ex: "game of thrones", "the mentalist S06E01", etc.
- `opts` an object with the following arguments:
  - `idioma` a integer indicating the subtitle language. Could be one of the following:
    - `1`  Portuguese-BR
    - `2`  English
    - `3`  Spanish
    - `4`  French
    - `5`  German
    - `6`  Japanese
    - `7`  Danish
    - `8`  Norwegian
    - `9`  Swedish
    - `10` Portuguese-PT
    - `11` Arabic
    - `12` Czech
    - `13` Chinese
    - `14` Korean
    - `15` Bulgarian
    - `16` Italian
    - `17` Polish
  
  - `tipo_legenda` a string indicating the subtitle type. Could be one of the following:
    - `d` Destaque
    - `p` Pack
  - `proxy` a string representing a HTTP proxy to be used.
  

## Example

```js
var legendastv = require('node-legendastv');

legendastv.search('game of thrones S04E01', function(err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});

```

## License

MIT