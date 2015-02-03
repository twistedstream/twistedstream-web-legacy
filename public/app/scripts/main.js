(function () {
  'use strict';

  $(function () {
    console.log('Web app has started!!!');

    $.getJSON('/api/challenge').done(function (data) {
      // load and sytax highlight the challenge code
      $('#challenge-code').text(data.code);
      hljs.initHighlighting();

      $('#resume').on('shown.bs.collapse', function () {
        var answerTextarea = $('#answer');
        answerTextarea.focus();

        var runButton = $('#run');

        // only enable run button if answer isn't empty
        answerTextarea.bind('input propertychange', function () {
          console.log('CHANGE');

          runButton.prop('disabled', $(this).val() === '');
        });

        // run workflow
        runButton.click(function () {
          // disable controls while checking answer
          answerTextarea.prop('disabled', true);
          runButton.prop('disabled', true);
          var answerGroup = $('#answer-group');
          var answerLabel = $('#answer-label');

          $.ajax({
            type: 'POST',
            url: '/api/answer',
            data: JSON.stringify({ code: answerTextarea.val() }),
            contentType: 'application/json'
          }).fail(function (err) {
            answerGroup.addClass('has-error');
            // re-enable controls
            answerTextarea.prop('disabled', false);
            runButton.prop('disabled', false);

            answerLabel.text(err.responseJSON.message);
          }).done(function (data) {
            answerGroup.removeClass('has-error');
            answerLabel.text('');

            $('#access-token').text(data.access_token);

            // get personal resume formats and fill in other dynamic data
            $.getJSON('/api/personal_resume/formats').done(function (data) {
              $.each(data, function (i, format) {
                var li = '<li>' + format.description + ': <code>' + format.contentType + '</code></li>';
                $('#personal-resume-formats').append(li);
              });

              $('#personal-resume-resource').text(window.location + 'api/personal_resume');
              $('#stackoverflow-resume-resource').text(window.location + 'api/stackoverflow_resume');

              $('#token-block').show();
              $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
            });
          });
        });
      });
    });
  });
})();
