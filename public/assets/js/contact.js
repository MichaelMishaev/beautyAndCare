$(function () {
  $('#contact-form').on('submit', function (e) {
    e.preventDefault(); 

    $.ajax({
      type: "POST",
      url: "assets/php/contact-form.php", // PHP file ka path
      data: $(this).serialize(),
      dataType: "json",
      success: function (response) {
        var alertClass = response.class; // alert-success ya alert-danger
        var message = response.message;

        var alertBox = '<div class="' + alertClass + '">' + message + '</div>';

        $('.messages').html(alertBox);

        if (response.class === 'alert alert-success') {
          $('#contact-form')[0].reset(); // form reset karo success par
        }
      }
    });
  });
});