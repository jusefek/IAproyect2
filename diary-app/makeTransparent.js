const Jimp = require('jimp');

async function main() {
    try {
        const image = await Jimp.read('public/images/logo.jpg');

        // Config: threshold for lightness (below this is black, above is transparent)
        const THRESHOLD = 130;

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            // x, y is the position of this pixel on the image
            // idx is the position start position of this rgba tuple in the bitmap Buffer
            // this is the image

            var _r = this.bitmap.data[idx + 0];
            var _g = this.bitmap.data[idx + 1];
            var _b = this.bitmap.data[idx + 2];

            if (_r > THRESHOLD && _g > THRESHOLD && _b > THRESHOLD) {
                // transparent
                this.bitmap.data[idx + 3] = 0;
            } else {
                // force solid black
                this.bitmap.data[idx + 0] = 0;
                this.bitmap.data[idx + 1] = 0;
                this.bitmap.data[idx + 2] = 0;
                this.bitmap.data[idx + 3] = 255;
            }
        });

        await image.writeAsync('public/images/logo_transparent.png');
        console.log("Success");
    } catch (err) {
        console.error(err);
    }
}
main();
