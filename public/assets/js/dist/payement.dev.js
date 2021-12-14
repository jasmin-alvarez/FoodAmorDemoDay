// STRIPE API 

"use strict";

var stripe = Stripe('pk_test_key');
var elements = stripe.elements();
var card = elements.create('card', {
  hidePostalCode: true,
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',
      '::placeholder': {
        color: '#CFD7E0'
      }
    }
  }
});
card.mount('#card-element');

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
    // In this example, we're simply displaying the token
    successElement.querySelector('.token').textContent = result.token.id.substring(4);
    successElement.classList.add('visible');
    
    // var form = document.querySelector('form');
    // form.querySelector('input[name="token"]').setAttribute('value', result.token.id);
    // form.submit();
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}

card.on('change', function (event) {
  setOutcome(event);
});
document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();
  var options = {
    name: document.getElementById('first-name').value + " " + document.getElementById('last-name').value,
    address_line1: document.getElementById('address-line1').value,
    address_line2: document.getElementById('address-line2').value,
    address_city: document.getElementById('address-city').value,
    address_state: document.getElementById('address-state').value,
    address_zip: document.getElementById('address-zip').value,
    address_country: document.getElementById('address-country').value
  };
  stripe.createToken(card, options).then(setOutcome);
});
