export default `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
	<style>
		body {
			margin: 0;
		}

		#reader {
			height: 100vh;
			width: 100vw;
			overflow: hidden !important;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	</style>
</head>

<body>
	<div id="reader"></div>
</body>
<script>
	window.book = ePub('https://cevativo-hosting-mobilehub-306309057.s3-sa-east-1.amazonaws.com/Knight_Withou_Armour.epub');
	window.rendition = window.book.renderTo(document.getElementById('reader'), {
		width: '100%',
		height: '100%',
	});

	if (window.LOCATIONS) {
		window.book.locations.load(window.LOCATIONS);
	} else {
		window.book.ready.then(() => {
			window.book.locations.generate(1650).then(() => {
				window.ReactNativeWebView.postMessage(
					JSON.stringify({ type: 'locations', locations: window.book.locations.save() })
				);
			});
		});
	}

	window.rendition.on('started', (e) => {
		window.rendition.display(window.BOOK_LOCATION)

		window.rendition.themes.register({ theme: window.THEME });
		window.rendition.themes.select('theme');
	});

	rendition.on('relocated', function (e) {
		window.ReactNativeWebView.postMessage(JSON.stringify({
			type: 'loc',
			cfi: e.start.cfi,
			progress: e.start.location,
			totalPages: window.book.locations.length()
		}));
	});

</script>

</html>
`;