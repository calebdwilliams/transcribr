(function($) {
	$('#upload-btn').on('click', function(event) {
		event.preventDefault();

		$('#upload-btn').attr('disabled', 'disabled');

		var data = new FormData();
		$.each($('#file')[0].files, function(i, file) {
			data.append('file', file);
		});

		$.ajax({
			url: $('#uploadForm').attr('action'),
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			type: 'POST',
			success: function(data) {
				console.log(data);
				console.log(typeof data);
				$('#text').text(data._text);
			}
		});
	});
}(jQuery));