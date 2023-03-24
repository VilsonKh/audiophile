$(document).ready(function () {
  $('.checkout__form').validate();
  $('#checkout').on('click', function() {
    console.log($('.checkout__form').valid())
  })
})