<?php 
	require_once("cockpit/bootstrap.php"); 

	echo "spectacles";
	echo "\n\n\n";
	$spectacles = collection("spectacles")->find()->toArray();
	$json = json_encode($spectacles);
	var_dump($json);

	echo "\n\n\n";
	echo "presse";
	echo "\n\n\n";
	$presse = collection("presse")->find()->toArray();
	$json = json_encode($presse);
	var_dump($json);

	echo "\n\n\n";
	echo "ateliers";
	echo "\n\n\n";
	$ateliers = collection("ateliers")->find()->toArray();
	$json = json_encode($ateliers);
	var_dump($json);

	echo "\n\n\n";
	echo "lcv";
	echo "\n\n\n";
	$lcv = collection("lcv")->find()->toArray();
	$json = json_encode($lcv);
	var_dump($json);
?>