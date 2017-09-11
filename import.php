<?php 
	require('cockpit/bootstrap.php'); // load cockpit api

	$data = json_decode(file_get_contents('import/spectacles.json'), true);
	collection('spectacles')->insert($data);

	$data = json_decode(file_get_contents('import/ateliers.json'), true);
	collection('ateliers')->insert($data);

	$data = json_decode(file_get_contents('import/lcv.json'), true);
	collection('lcv')->insert($data);

	$data = json_decode(file_get_contents('import/presse.json'), true);
	collection('presse')->insert($data);
?>