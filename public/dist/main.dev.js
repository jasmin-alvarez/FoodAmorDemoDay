"use strict";

var trash = document.getElementsByClassName("fa fa-trash");
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    var postId = this.getAttribute('name');
    console.log(postId, 'postid');
    fetch('/deletePost', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 'user': userName,
        'postId': postId
      })
    }).then(function (response) {
      window.location.reload();
    });
  });
});