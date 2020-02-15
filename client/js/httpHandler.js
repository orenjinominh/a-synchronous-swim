(function() {

  const serverUrl = 'http://127.0.0.1:5000';

  //
  // TODO: build the swim command fetcher here
  //

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const getRandom = () => {
    $.ajax({
      url: serverUrl + '/random',
      type: 'GET',
      success: (data) => {
        SwimTeam.move(data);
        console.log('GET REQUEST SUCCEEDED');
        setTimeout(function(){ getRandom() }, 3000);
      },
      error: () => {
        console.log('GET REQUEST FAILED');
      }
    });
  };

  $('#randomswim').on('click', function(){
    console.log('click');
    getRandom();
  });


  const getArrow = () => {
    $.ajax({
      url: serverUrl + '/',
      type: 'GET',
      success: (data) => {
        SwimTeam.move(data);
        console.log('GET REQUEST SUCCEEDED');
      },
      error: () => {
        console.log('GET REQUEST FAILED');
      }
    });
  };

  setInterval(function(){getArrow()}, 3000);

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl + '/uploadedPic',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;data
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();

