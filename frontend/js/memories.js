// Get search query
$( document ).ready(function() {
		$('#submit').click((e) => {
			query = $('#search').val();
			console.log(query);
			// Make sure they ask something
			if (query.length == 0) {
				javascript:alert('Ask me a darn question!');
			} else {
				// Setup lambda call
				var params = {
					FunctionName: 'getQuip',
					InvocationType: 'RequestResponse',
					LogType: 'Tail',
					Payload: '{"query": ' + JSON.stringify(query.toLowerCase()) + '}' // search terms
				};
				console.log(params);
				triggerLambda(params);
			}
		})
	});

	// Include enters for clicks
    $('#search').keypress((e) => {
    if ( e.which == 13 ) {
        $('#submit').click();
    	}	
	});

// Create modal for response display 
function doModal(content) {
    html =  '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog modal-dialog-centered">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    //html += '<a class="close ml-0" data-dismiss="modal">x</a>';
    html += '<h4 class=" mt-0 m-auto">Uncle Paul says...</h4>'
    html += '</div>'; // header
    html += '<div class="modal-body mr-1">';
    html += '<div class="row">';
    html += '<div class="col-md-6 text-center m-auto" >';
    html += content;
    html += '</div>'; //content
    html += '<div class="col-md-6">';
    html += '<img src="http://unclepaulknowsall.com/css/images/crossed_arms.jpg" class="img-thumbnail rounded float-right" alt="ResponsiveImage">';
    html += '</div>'; // image
    html += '</div>'; // row
    html += '</div>'; // modal
    html += '<div class="modal-footer">';
    html += '<span class="btn btn-primary m-auto" data-dismiss="modal">Close</span>';
    html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $('#dynamicModal').modal();
    $('#dynamicModal').modal('show');

    // exit modal and clear search
    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove()
        $('#search').val('');
    });

}

function triggerLambda(params) {

	// Cognito pool credentials
	AWS.config.update({region: 'us-east-2'});
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-2:c50cc00d-7943-4e8b-b141-518f4a48ff8a',
	});

	// Config lambda
	var lambda = new AWS.Lambda({region: 'us-east-2', apiVersion: '2015-03-31'});
	// Initialize results
	var results;
	// Call lambda
	lambda.invoke(params, function(error, data) {
		if (error) {
            prompt(error);
            window.alert(JSON.parse(error));
        } else {	
			window.message = JSON.parse(data.Payload);
			console.log(message);

			if (message != null) {
				var response = message['body'];
				console.log(response);
				// Display results 
				doModal(response);

			}

		}
	});

}