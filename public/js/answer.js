$('#btn_problem_1').click(function() {
  var answer = $('#problem_1').val();
  $.ajax({
    url: '/answer',
    type: 'post',
    dataType: 'json',
    data: { problem_1: answer },
    success: function(data) {
      window.location.reload();
    },
    error: function(XHR, status, err) {
      alert('error');
    }
  });
});