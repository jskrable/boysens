// global
var memoryMap = {};


$(document).ready(function() {

    checkForMemories()
});

/*// Include enters for clicks
$('#search').keypress((e) => {
    if (e.which == 13) {
        $('#submit').click();
    }
});*/

$('#submit-memory').click((e) => {
    console.log('submit')
    memory = $('#memory-message').val();
    console.log(memory);
    // Make sure they ask something
    if (memory.length == 0) {
        javascript: alert('Please submit something...');
    }
    else {
        // Setup lambda call
        var params = {
            FunctionName: 'saveMemory',
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: '{"memory": ' + JSON.stringify(memory) + '}' // search terms
        };
        console.log(params);
        triggerLambda(params, 'POST');

        // add immediately to list here? need date and memory.
    }
});


// empty full memory modal on close
$('#full-memory-modal').on('hidden.bs.modal', function (e) {
	('#full-memory').empty();
});


function checkForMemories() {
    console.log('Checking storage')
        // display list if loaded already
    var memoryContainer = JSON.parse(sessionStorage.getItem('memoryContainer'));
    if (memoryContainer != null) {
        // write this
        displayMemories(memoryContainer);
        // else fetch jobs and then display
    } else {
        getMemories();
    }
}


function submitModal(response, type) {

    $('#memory-message').val('');
    $('#submit-memory-modal').modal('hide');
    $('#submit-success-modal').modal('show');
}


function triggerLambda(params, type) {

    // Cognito pool credentials
    AWS.config.update({
        region: 'us-east-2'
    });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:c50cc00d-7943-4e8b-b141-518f4a48ff8a',
    });

    // Config lambda
    var lambda = new AWS.Lambda({
        region: 'us-east-2',
        apiVersion: '2015-03-31'
    });
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
                if (type == 'POST') {
                    submitModal(response);
                } else {
                    displayMemories(response);
                }
            }

        }
    });

}


function showFullMemory(id) {
	// create modal here that shows full memory using memoryMap
	console.log('Showing memory id: ' + id)
	entry = memoryMap[id];
	$('#full-memory').append(entry);
	$('#full-memory-modal').modal('show');
}


function generateCard(entry) {
    // console.log(entry.id)
    html = '<div class="card" id="' + entry.id + '">'
    html += '<div class="card-body">'
    // html += '<h5 class="card-title">Card title</h5>'
    html += '<p class="card-text">' + entry.memory.substr(0, 150) + '...</p>'
    html += '<p class="card-text"><small class="text-muted">' + entry.timestamp + '</small></p>'
    html += '</div></div>'
    return html
}


function displayMemories(data) {
    //console.log(data)
    memories = $('#memory-list');
    $('#loading').remove();
    //console.log(JSON.parse(data))
    entries = JSON.parse(data).Items;
    entries.forEach(msg => {
        // create preview cards here, with link to open full text in modal
        // need to limit chars, maybe 150? for looks.
        // link to ID in variable or storage for full text?
        // could create hashmap of ID and fulltext for speed?
        memoryMap[msg.id] = msg.memory;
        card = generateCard(msg);
        memories.append(card);
    });

    // Listener for memory clicks
    memories.on('click', '.card', function() {
        // SHOW/CREATE MODAL WITH FULL TEXT HERE
        id = $(this).attr('id');
        showFullMemory(id);
    });

    // Card hover animations
    memories.on('mouseenter', '.card', function() {
        $(this).removeClass('bg-light');
        $(this).addClass('text-white bg-dark');
        $(this).find('#job-title').addClass('text-white');
    });

    memories.on('mouseleave', '.card', function() {
        $(this).removeClass('text-white bg-dark');
        $(this).find('#job-title').removeClass('text-white');
        $(this).addClass('bg-light');
    });


}



// Function to get the list of file mover jobs to display
function getMemories() {

    var params = {
        FunctionName: 'getMemories',
        InvocationType: 'RequestResponse',
        LogType: 'Tail'
    };
    console.log(params);
    triggerLambda(params, 'GET');

}