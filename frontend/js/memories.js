// global
var memoryMap = {};


$(document).ready(function() {

    checkForMemories();

    $('#scroll-top-button').click((e) => {
        //console.log('back to the dang top')
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
});



$('#submit-memory').click((e) => {
    //console.log('submit')
    memory = $('#memory-message').val();
    //console.log(memory);
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
        //console.log(params);
        triggerLambda(params, 'POST');

        // add immediately to list here? need date and memory.
    }
});


// empty full memory modal on close
$('#full-memory-modal').on('hidden.bs.modal', function(e) {
    $('#full-memory').empty();
});


function checkForMemories() {
    //console.log('Checking storage')
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
            //console.log(message);

            if (message != null) {
                var response = message['body'];
                //console.log(response);
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
    // console.log(entry)
    $('#full-memory').append(entry.memory);
    $('#full-memory-modal').modal('show');
}


function generateCard(id, entry) {
    // //console.log(entry.id)
    var d = new Date(entry.timestamp);
    html = '<div class="card" id="' + id + '">'
    html += '<div class="card-body">'
        // html += '<h5 class="card-title">Card title</h5>'
    html += '<p class="card-text">' + entry.memory.substr(0, 150) + '...</p>'
    html += '<p class="card-text"><small class="text-muted">' + d.toLocaleString() + '</small></p>'
    html += '</div></div>'
    return html
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function displayMemories(data) {
    ////console.log(data)
    
    memories = $('#memory-list');
    $('#loading').remove();
    $('#scroll-top-button').removeClass('invisible');
    $('#scroll-top-button').addClass('visible');
    ////console.log(JSON.parse(data))
    entries = JSON.parse(data).Items;
    toSort = [];

    entries.forEach(msg => {
        memoryMap[msg.id] = {'memory': msg.memory, 'timestamp':msg.timestamp};
        toSort.push([msg.id, msg.timestamp]);
    });

    sorted = toSort.sort(function(a,b) {
    	return new Date(b[1]) - new Date(a[1]);
    })

    //console.log(sorted)

    sorted.forEach(entry => {
    	//console.log(memoryMap[entry[0]])
        card = generateCard(entry[0], memoryMap[entry[0]]);
        memories.append(card);
    });


    //memList.forEach(card => memories.append(card));

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
    //console.log(params);
    triggerLambda(params, 'GET');

}