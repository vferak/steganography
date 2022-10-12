## Description

Steganography CLI app.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run build
$ node dist/main
```

## Examples

**Files for encoding/decoding must be inside /public folder!**

### Encoding string into image
```bash
$ node dist/main encode -s "Hello world" -t "photo.png"
```

### Encoding file into image
```bash
$ node dist/main encode -f "image.png" -t "photo.png"
```

### Decoding data from image
```bash
$ node dist/main decode "encoded-photo.png"
```
