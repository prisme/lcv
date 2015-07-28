<?php 
	require_once("cockpit/bootstrap.php"); 
	if ( strstr('bf5aed9f82.url-de-test.ws', $_SERVER['HTTP_HOST'] ) != false ){
		$api_token = '6f09fab8bab3dfe648b41a09';
	}
	else{
		$api_token = '59770a79e2c9238617d3ff8f';
	}

?>

<!DOCTYPE html>
<html>
<head>
	<title>Les Comédiens Voyageurs</title>
	<meta charset="utf-8" />
	<meta name="google" value="notranslate" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<meta name="description" content="" />
	<meta name="keywords" content="" />

	<meta name="author" content="" />
	<meta name="copyright" content="" />
	<meta name="application-name" content="" />
	      
	<meta property="og:title" content="" />
	<meta property="og:type" content="" />
	<meta property="og:image" content="" />
	<meta property="og:url" content="" />
	<meta property="og:description" content="" />

	<meta name="twitter:card" content="">
	<meta name="twitter:creator" content="">
	<meta name="twitter:title" content="">
	<meta name="twitter:description" content="">
	<meta name="twitter:image:src" content="">

	<link rel="icon" href="assets/img/favicon.ico" />

	<link href="assets/css/style.min.css" rel="stylesheet" media="screen" />

	<script src="assets/js/lib/detection.js"></script>
	<?php cockpit_js_lib($api_token) ?>

	<script>
	  // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  // })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  // ga('create', 'UA-7665229-6', 'auto');
	  // ga('send', 'pageview');

	</script>
</head>
<body>
	<div class="menu-prompt">
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.2" baseProfile="tiny" x="0px" y="0px" width="31px" height="15px" viewBox="0 0 30 15" xml:space="preserve">
		<g><path fill-rule="evenodd" fill="#FFFFFF" d="M0 0h31v1H0V0z"/><path fill-rule="evenodd" fill="#FFFFFF" d="M0 7h31v1H0V7z"/><path fill-rule="evenodd" fill="#FFFFFF" d="M0 14h31v1H0V14z"/></g></svg>
	</div>

	<div class="logo"><img src="assets/img/logo.png" height="23" width="256"></div>

	<div class="menu">
		<a href="/sandbox/lcv/spectacles/">spectacles</a>
		<a href="/sandbox/lcv/spectacles/01">spectacles/01</a>
		<a href="/sandbox/lcv/ateliers/">ateliers</a>
		<a href="/sandbox/lcv/404/">404</a> 
	</div>

	<footer>
		<?php region('footer'); ?>
	</footer>

	<script src="assets/js/bundle.js"></script>
</body>
</html>