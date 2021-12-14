<?php
require_once('vendor/autoload.php');

$stripe = [
  "secret_key"      => "sk_test_",
  "publishable_key" => "pk_test_",
];

\Stripe\Stripe::setApiKey($stripe['secret_key']);
?>
