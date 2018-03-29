var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
    todo: [],
    completed: []
};

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

renderRideList();


//document.getElementById('add_ride').addEventListener('click', function () {
//    var value = document.getElementById('ride').value;
//    if (value) {
//        addRide(value);
//    }
//});

//document.getElementById('ride').addEventListener('keydown', function (e) {
//    var value = this.value;
//    if (e.code === 'Enter' && value) {
//        addRide(value);
//    }
//});

function addRide(date, time, dest) {
    addRideToDOM();
    document.getElementById('ride').value = '';

    data.todo.push(value);
    dataObjectUpdated();
}

function renderRideList() {
    document.getElementById('rides').innerHTML = '';
    document.getElementById('claimed').innerHTML = '';

    if (!data.todo.length && !data.completed.length) return;

    for (var i = 0; i < data.todo.length; i++) {
        console.log(i);
        var value = data.todo[i];
        addRideToDOM();
    }

    for (var j = 0; j < data.completed.length; j++) {
        var value = data.completed[j];
        addRideToDOM(true);
    }
}

function dataObjectUpdated() {
    localStorage.setItem('rides', JSON.stringify(data));
}

function removeRide() {


    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;



    $(item).animate({
        left: '250px',
        opacity: '.5',
        minHeight: '0px',
        lineHeight: '0px',
        height: '0px',
        padding: '0px',
        fontSize: '0px',
        margin: '0px',

    }, 200, function () {

        if (id === 'rides') {
            data.todo.splice(data.todo.indexOf(value), 1);
        } else {
            data.completed.splice(data.completed.indexOf(value), 1);
        }
        dataObjectUpdated();

        parent.removeChild(item);
    })
}

function claimRide() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;

    if (id === 'rides') {
        data.todo.splice(data.todo.indexOf(value), 1);
        data.completed.push(value);
    } else {
        data.completed.splice(data.completed.indexOf(value), 1);
        data.todo.push(value);
    }
    dataObjectUpdated();

    // Check if the item should be added to the completed list or to re-added to the todo list
    var target = (id === 'rides') ? document.getElementById('claimed') : document.getElementById('rides');

    var claimedBy = document.createElement('div');
    claimedBy.style.width = '100';
    claimedBy.innerText = 'Jack';
    claimedBy.style.position = 'absolute';
    claimedBy.style.left = '663';
    claimedBy.style.top = '14';

    item.childNodes[1].appendChild(claimedBy);

    $(item).animate({
        opacity: '.5',
        minHeight: '0px',
        lineHeight: '0px',
        height: '0px',
        padding: '0px',
        fontSize: '0px',
        margin: '0px'

    }, 70, function () {

        parent.removeChild(item);
        target.insertBefore(item, target.childNodes[0]);
        $(item).animate({
            opacity: '1',
            minHeight: '50px',
            lineHeight: '22px',
            padding: '14px 100px 14px 14px',
            margin: '0px 0px 4px 0px',
            fontSize: '14px',
            backgroundColor: id == 'rides' ? '#fbfff9' : '#FFF'
        }, 70)
    })
}

// Adds a new item to the todo list
function addRideToDOM(completed) {
    var list = (completed) ? document.getElementById('claimed') : document.getElementById('rides');

    var date;
    var time;
    var dest;
    var claimer;
    switch (document.getElementById('claimed').childElementCount + document.getElementById('rides').childElementCount) {
        case 0:
            date = '3/12/2018';
            time = '8:30am';
            dest = "Dr. Smith's";
            claimer = 'Lucas';
            break;
        case 1:
            date = '3/15/2018';
            time = '10:00am';
            dest = "Paul's house";
            claimer = 'Jack';
            break;
        case 2:
            date = '3/19/2018';
            time = '10:30am';
            dest = "Springfield CVS";
            claimer = 'Austin';
            break;
        case 3:
            date = '3/30/2018';
            time = '7:00am';
            dest = "Concord Dental";
            claimer = "Lucas";
            break;
    }

    var item = document.createElement('li');
    item.innerText = '';

    var text = document.createElement('div');

    var dateText = document.createElement('div');
    dateText.style.width = '100';
    dateText.innerText = date;

    var pickupTime = document.createElement('div');
    pickupTime.style.width = '100';
    pickupTime.innerText = time;
    pickupTime.style.position = 'absolute';
    pickupTime.style.left = '135';
    pickupTime.style.top = '14';

    var event = document.createElement('div');
    event.style.width = '250';
    event.innerText = dest;
    event.style.position = 'absolute';
    event.style.left = '260';
    event.style.top = '14';

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.style.width = '50px';

    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;

    var img = document.createElement('button');
    img.classList.add('remove');
    img.innerText = `Claimed by bertha`;

    // Add click event for removing the item
    remove.addEventListener('click', removeRide);

    var complete = document.createElement('button');
    complete.classList.add('complete');
    complete.innerHTML = completeSVG;

    var claimedBy = document.createElement('div');
    claimedBy.innerText = claimer;
    claimedBy.style.position = 'absolute';
    claimedBy.style.right = '63';
    claimedBy.style.top = '14';

    // Add click event for completing the item
    complete.addEventListener('click', completeRide);

    //buttons.appendChild(remove);
    buttons.appendChild(complete);
    item.appendChild(buttons);
    text.appendChild(dateText);
    if (completed) text.appendChild(claimedBy);
    text.appendChild(pickupTime);
    text.appendChild(event);
    item.appendChild(text);
    if (completed) item.style.backgroundColor = '#fbfff9';

    list.insertBefore(item, list.childNodes[0]);


}
