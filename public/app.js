//frontend logic

// 5 stages in order for next stage
const STAGES = ['Lead', 'Contacted', 'Qualified', 'Trial/Demo', 'Closed'];

//when the page loads, fetch the customers then display them
window.addEventListener('load', loadCustomers)

// fetch customers from backend and users filters if there (stage/search)
function loadCustomers(){
    // read values in search and stage from html
    // are empty strings if left empty
    const search = document.getElementById('searchInput').value;
    const stage = document.getElementById('stageFilter').value;

    // build the url with query parameters if they are used
    let url = '/api/customers';
    const params = [];
    // encodeURIComponent to change & in case it is in search
    if (search){
        params.push('search=' + encodeURIComponent(search));
    }
	if (stage){
        params.push('stage=' + encodeURIComponent(stage));
    }
	if (params.length > 0) {
        url = url + '?' + params.join('&');
    }

    // to backend, parse the json, and update the board
    // log error if network or server down
    fetch(url)
        .then(response => response.json())
        .then(customers => {renderBoard(customers);})
        .catch(err => {
            console.error('Failed to load customers', err)
        })
}


// take array of customers and display them in correct stages
function renderBoard(customers){
    //clear all columns to make sure no duplicate cards
    for(let i = 0; i < STAGES.length; i++){
        const columnId = 'cards-' + STAGES[i].replace('/', '-'); // for Trial/Demo
        document.getElementById(columnId).innerHTML = ''; // wipes all elements
    }

    //add card for each customer in stage's column
    for (let i =0; i <  customers.length; i++){
        const customer = customers[i];
        const columnId = 'cards-' + customer.stage.replace('/', '-');  // find the customer's stage
        const column = document.getElementById(columnId);
        if (column){
            column.appendChild(buildCard(customer));  // builds card for the customer inside the stage
        }
    }

}

//build the card element for a customer
function buildCard(customer){
    const card = document.createElement('div')
    card.className = 'card';

    //cutomer name
    const name = document.createElement('div');
    name.className = 'card-name';
	name.textContent = customer.name;
	card.appendChild(name);

    //company
    const company = document.createElement('div');
	company.className = 'card-company';
	company.textContent = customer.company;
	card.appendChild(company);

    // email
    const email = document.createElement('div');
	email.className = 'card-email';
	email.textContent = customer.email;
	card.appendChild(email);

    // buttons to move or delete
    //wrapper div for both buttons
    const actions = document.createElement('div')
    actions.className = 'card-actions';

    // move button for all stages but last one
    const currentIndex = STAGES.indexOf(customer.stage)
    if(currentIndex < STAGES.length -1){  // checks if not last stage
        const nextStage = STAGES[currentIndex + 1];
        const moveButton = document.createElement('button');
        moveButton.className = 'move-button';
        moveButton.textContent = '-> ' + nextStage; // set text to what next stage is
        moveButton.addEventListener('click', () => moveCustomer(customer.id, nextStage));
        // () => is used as arguments need to be passed instead of just calling method
        actions.appendChild(moveButton);
    }

    //delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => deleteCustomer(customer.id));
    actions.appendChild(deleteButton);

    card.appendChild(actions); // put div inside card
    return card; // hands tree back to renderBoard which adds it to column
}


//this is how add customer will be implemented on the backend
//happens from the submit button on the form
document.getElementById('addForm').addEventListener('submit', function(event){
    event.preventDefault(); // stop page from reloading here for control
    // page will reload anytime you press submit without this

    // read all form values
    const name = document.getElementById('addName').value;
	const email = document.getElementById('addEmail').value;
	const company = document.getElementById('addCompany').value;
	const stage = document.getElementById('addStage').value;

    //send to backend
    fetch('/api/customers', {
        method: 'POST',  // post as data is sent
        headers: {'Content-Type': 'application/json'},  // tells server the request is json
        body: JSON.stringify({name,email,company,stage})
    })
    .then(response => response.json())  // parse response as json
    .then(data => {
        const message = document.getElementById('addMessage');
        if(data.error){ // error is in backend when a name/email/company is missing
            message.textContent = 'Error: ' + data.error;
        }
        else{
            message.textContent = '';
            document.getElementById('addForm').reset();
            loadCustomers(); // refresh board with the new card
        }
    })
    .catch(err => {
        document.getElementById('addMessage').textContent = 'Netword error';
    });
});



//move customer to next stage by getting backend's stage endpoint
// hits backend app.post('/api/customers/:id/stage'
function moveCustomer(id, newStage){
    fetch('/api/customers/' + id + '/stage',{  
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({stage: newStage})
        // for backend, req.body.stage becomes the new stage
    })
    .then(response => response.json())
    .then(() => {
        loadCustomers(); // refresh board to show it moved
    });
}


//delete customer and make sure to add step of confirming with user
function deleteCustomer(id) {
    if(!confirm('Delete this customer?')){
        // had to look this up but this makes sure to delete with a message to user
        return;
    }

    fetch('/api/customers/' + id, {  // deletes based on id
        method: 'DELETE'
    })

    .then(response => response.json())
    .then(() => {
        loadCustomers(); //refresh the board to show the customer is deleted
    });
}



// reload customers whenever the user types in seach or changes stage dropdown
// this is a lot of requests but keeps it simple, for later working, add a timer
// to see when they stop typing then reload customers
document.getElementById('searchInput').addEventListener('input', loadCustomers);
document.getElementById('stageFilter').addEventListener('change', loadCustomers);

