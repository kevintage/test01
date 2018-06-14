//remove time code in subtitle file

let fs = require('fs');

fs.readdir(__dirname + '/subtitle/', function (error, filename) {
	for (let i = 0; i < filename.length; i++) {		
		let remaining = ''; 
		let readStream = fs.createReadStream(__dirname + '/subtitle/' + filename[i]);
		let writeStream = fs.createWriteStream('./' + '/subtitle/' + filename[i].slice(0,-3) + 'txt');

    readStream.on('data', function (data) {
    	remaining += data;
   		let indexA = remaining.indexOf('-->');
    	let indexRN = remaining.indexOf('\r\n\r\n', indexA);
    	let last = 0;

    	while (indexA > -1) {	
		  	let sentence = remaining.substring(indexA + 18, indexRN) + "，";
		    writeStream.write(sentence);
				last = indexRN + 1;
				indexA = remaining.indexOf('-->', last);
				indexRN = remaining.indexOf('\r\n\r\n', indexA);
		}

    	remaining = '';

    }).on('end', function () {
    	writeStream.end();
    	console.log(filename[i].slice(0,-4) + ' done');
    })
	}
})
