$('#btn_problem_1').click(function() {
  var answer = $('#problem_1').val();
  $.ajax({
    url: '/answer',
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ "problem_id" : "problem_1", "answer" : answer }),
    success: function(result) {
      if (result.status == "ok") {
        
      }
    },
    error: function(XHR, status, err) {
      alert("NG:" + status.status + err + XHR);
    }
  });
});