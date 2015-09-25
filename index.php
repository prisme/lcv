<?php 
	require_once("cockpit/bootstrap.php"); 
	if ( strstr('bf5aed9f82.url-de-test.ws', $_SERVER['HTTP_HOST'] ) != false ){
		$_ROOT = '';
		$api_token = '59770a79e2c9238617d3ff8f';
	}
	else{
		$_ROOT = '/sandbox/lcv';
		$api_token = '5b51f142b64ac58f835bc360';
	}

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Les Comédiens Voyageurs</title>
	<meta name="description" content="" />
	<meta name="google" value="notranslate" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<meta name="author" content="@prisme" />
	<meta name="copyright" content="Les Comédiens Voyageurs" />
	      
	<meta property="og:title" content="Les Comédiens Voyageurs" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="" />
	<meta property="og:description" content="" />

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

	<a href="<?=$_ROOT?>/" class="logo"><img src="assets/img/logo.png" height="23" width="256"></a>
	
	<!-- todo : region -->
	<div class="menu">
		<a href="<?=$_ROOT?>" class="logo"><img src="assets/img/logo.png" height="23" width="256"></a>
		<ul>
			<li><a href="<?=$_ROOT?>" class="home">close</a></li>
			<li>
				<a href="#" class="sub-prompt">les comediens voyageurs</a>
				<ul class="menu-sub">
					<li><a href="<?=$_ROOT?>/lcv/marcel-bozonnet">marcel bozonnet</a></li>
					<li><a href="<?=$_ROOT?>/lcv/edito">edito</a></li>
					<li><a href="<?=$_ROOT?>/lcv/equipe">l'équipe</a></li>
					<li><a href="<?=$_ROOT?>/lcv/partenaires">partenaires</a></li>
				</ul>
			</li>
			<li><a href="<?=$_ROOT?>/spectacles">spectacles</a></li>
			<li><a href="<?=$_ROOT?>/ateliers">ateliers</a></li>
			<li><a href="<?=$_ROOT?>/presse">presse</a></li>
			<li><a href="<?=$_ROOT?>/contact">contact</a></li>
			<li><a href="#" class="close">close</a></li>
		</ul>
	</div>

	<div class="page">
		
		<footer class="menu-hide">
			<?php region('footer'); ?>
		</footer>
	</div>
	
	<!-- Root element of PhotoSwipe. Must have class pswp. -->
	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

	    <!-- Background of PhotoSwipe. 
	         It's a separate element as animating opacity is faster than rgba(). -->
	    <div class="pswp__bg"></div>

	    <!-- Slides wrapper with overflow:hidden. -->
	    <div class="pswp__scroll-wrap">

	        <!-- Container that holds slides. 
	            PhotoSwipe keeps only 3 of them in the DOM to save memory.
	            Don't modify these 3 pswp__item elements, data is added later on. -->
	        <div class="pswp__container">
	            <div class="pswp__item"></div>
	            <div class="pswp__item"></div>
	            <div class="pswp__item"></div>
	        </div>

	        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
	        <div class="pswp__ui pswp__ui--hidden">

	            <div class="pswp__top-bar">

	                <!--  Controls are self-explanatory. Order can be changed. -->

	                <div class="pswp__counter"></div>

	                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

	                <button class="pswp__button pswp__button--share" title="Share"></button>

	                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

	                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

	                <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
	                <div class="pswp__preloader">
	                    <div class="pswp__preloader__icn">
	                      <div class="pswp__preloader__cut">
	                        <div class="pswp__preloader__donut"></div>
	                      </div>
	                    </div>
	                </div>
	            </div>

	            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
	                <div class="pswp__share-tooltip"></div> 
	            </div>

	            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
	            </button>

	            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
	            </button>

	            <div class="pswp__caption">
	                <div class="pswp__caption__center"></div>
	            </div>

	        </div>

	    </div>

	</div>

	<script src="assets/js/bundle.js"></script>
</body>
</html>