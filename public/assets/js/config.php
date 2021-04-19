<?php
require_once('vendor/autoload.php');

$stripe = [
  "secret_key"      => "sk_test_51IfdITEOiwnwvfU2NMSbfVF1oEW8Cle8Hcuy6UGtyonCoFgCLnZ8icdGITujL3mzAZ838PuJ6BUCt2nkOlErrhcB0025Qe4UFf",
  "publishable_key" => "pk_test_51IfdITEOiwnwvfU2IPdzwcXxZpsb83hAGYiR6W4KzMYBgnKScBI2XapUOh6VfMvdAfO93fLmX7I34g4gxFtkAhwh00ojN8QYo2",
];

\Stripe\Stripe::setApiKey($stripe['secret_key']);
?>