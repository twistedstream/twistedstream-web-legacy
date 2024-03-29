(function () {
  'use strict';

  function scrollTo (ele) {
    $('html, body').animate({ scrollTop: ele.offset().top }, 'slow');
  }

  $(function () {
    console.log('Web app has started!!!');

    $.getJSON('/api/challenge').done(function (data) {
      // load and sytax highlight the challenge code
      $('#challenge-code').text(data.code);
      hljs.initHighlighting();

      $('#resume').on('shown.bs.collapse', function () {
        scrollTo($('#resume-well'));

        var answerTextarea = $('#answer');
        var runButton = $('#run');

        // only enable run button if answer isn't empty
        answerTextarea.bind('input propertychange', function () {
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

            $('#personal-resume-resource').text(window.location + 'api/personal_resume');
            $('#stackoverflow-resume-resource').text(window.location + 'api/stackoverflow_resume');

            $('#token-block').show();
            // scroll down so user can see results
            scrollTo($('#token-block'));
          });
        });
      });
    });
  });
})();
