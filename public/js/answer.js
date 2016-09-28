$('#btn_answer').click(function() {
  var answer = $('#problem_1').val();
  $.ajax({
    url: '/answer',
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ "answer" : answer }),
    success: function(result) {
      if (result.status == "ok") {
        window.location.reload();
      } else {
        $('#alert').html('<div class="alert alert-danger" role="alert">' + result.status + '</div>');
      }
    },
    error: function(XHR, status, err) {
      
    }
  });
});