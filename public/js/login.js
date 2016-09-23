$(function() {
  $('#btn_login').click(function() {
    $.ajax({
      type: 'post',
      url: '/auth/local',
      data: {
        username: $('#username'),
        password: $('#password')
      },
      success: function(data) {
        
      }
  });
});