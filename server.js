// file system for reading and writing data
const fs = require('fs');

// set up express
const express = require('express');
const app = express();
const PORT = 3000;




// open data.json and convert json string to array
function readCustomers(){
    const data = fs.readFileSync('data.json', 'utf8');
    return JSON.parse(data);
}

// takes array and convert to json string and saves it to data file
// stringify for nice formatting
function writeCustomers(customers){
    fs.writeFileSync('data.json', JSON.stringify(customers, null, 2))
}



//express parses data to req.body
app.use(express.json());

// for frontend file from public folder
app.use(express.static('public'))






//get /api/customers and returns list of customers to json
// 2 filters for stage and name/company in the search if present
app.get('/api/customers', (req, res) => {
    let customers = readCustomers();
    
    // if url included ?stage=something, filter by the stage
    //stages are lead, contacted, qualified, trial/demo, closed
    if(req.query.stage){
        customers = customers.filter(c => c.stage === req.query.stage)
    }

    // if url had ?search=something, filter by name or company
    if (req.query.search){
        const term = req.query.search.toLowerCase();
        customers = customers.filter(c => c.name.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term));
    }

    // send filtered list to json file
    res.json(customers);
})






// post /api/customers
// creates a new customer with json body: 
// name, email, company, and optional stage if not new customer
// if no stage, it defaults to lead
// returns new customer with a generated id
app.post('/api/customers', (req,res) => {
    const { name, email, company, stage } = req.body;

    // make sure the required fields present
    if(!name || !email || !company){
        return res.status(400).json({ error: 'name, email, and company are required'});
    }

    // use lead if a stage isn't provided
    const startingStage = stage || 'Lead';

    // Make sure the stage is one of the 5 from spec
    const validStages = ['Lead', 'Contacted', 'Qualified', 'Trial/Demo', 'Closed'];
    if (!validStages.includes(startingStage)){
        return res.status(400).json({ error: 'Invalid stage' });
        //send error if unvalid
    }

    // load existing customers
    const customers = readCustomers()

    // build customer object and create id through the unique date
    // adds the customer into json
    // keeps track of user history using date and the changing stages
    // send 201 status code for success with added resource
    const now = new Date().toISOString(); // change date object to string
    const newCustomer = {
        id: Date.now().toString(),
        name:name,
        email:email,
        company:company,
        stage:startingStage,
        createdAt:now, // useful for seeing new and old customers
        updatedAt:now,  // good to see if customers change stages frequently
        stageHistory: [{stage:startingStage, changedAt:now}]  // to see stage changes over time
    }

    // add the customer
    customers.push(newCustomer);
    writeCustomers(customers);

    // send the new customer back for the frontend to display it
    res.status(201).json(newCustomer);

})






// POST /api/customers/:id/stage
    // Moves customer to next stage
    // Updates customer's stage and and updates stageHistory
    app.post('/api/customers/:id/stage', (req,res) => {
        const {id} = req.params;
        const {stage} = req.body; // nbew stage from request

        // make sure this is a valid stage
        const validStages = ['Lead', 'Contacted', 'Qualified', 'Trial/Demo', 'Closed'];
        if (!stage || !validStages.includes(stage)){
            return res.status(400).json({ error: 'Valid stage is required' });
            //error for null stage or stage isn't valid
        }

        // load all customers and find one that matches the id
        const customers = readCustomers();
        const customer = customers.find(c => c.id === id); // js method to find id

        if (!customer){
            return res.status(404).json({ error: 'Customer not found' });
            //error for no customer with that id
        }

        const now = new Date().toISOString();
        customer.stage = stage;
        customer.updatedAt = now;
        customer.stageHistory.push({stage: stage, changedAt: now});

        //save back to the file
        writeCustomers(customers);

        // send updated customer back
        res.json(customer);

    })


    // get /api/customers/:id
    //returns a customer by id
    // good for looking into a customer details like their stage history
    app.get('/api/customers/:id', (req, res) => {
        const {id} = req.params;
        const customers = readCustomers();
        const customer = customers.find(c => c.id === id);

        if (!customer){
            return res.status(404).json({ error: 'Customer not found' });
            //error for no customer with that id
        }

        res.json(customer);
    })



    // put /api/customers/:id
    // updates customer name, email, or company
    // this is not where stage is changed
    app.put('/api/customers/:id', (req,res) => {
        const { id } = req.params;
        const {name, email, company } = req.body;
        const customers = readCustomers();
        const customer = customers.find(c => c.id === id);

        if(!customer){
            return res.status(404).json({ error: 'Customer not found' });
        }

        // update only fields in request and update updatedAt time
        if(name) customer.name = name;
        if (email) customer.email = email;
	    if (company) customer.company = company;
	    customer.updatedAt = new Date().toISOString();

        writeCustomers(customers);
        res.json(customer)
    })



    //delete /api/customers/:id
    // remove the customer
    app.delete('/api/customers/:id', (req,res) => {
        const {id} = req.params;
        const customers = readCustomers();
        //want index this time, so i know where to get rid of in the array
        const index = customers.findIndex(c => c.id === id);

        if(index === -1){
            return res.status(404).json({ error: 'Customer not found' });
        }

        //remove from array
        customers.splice(index,1)  // remove 1 item at index
        writeCustomers(customers);

        res.json({message: 'Customer deleted'})

    })




//for testing
app.get('/api/hello', (req,res) => {
    res.send('CRM server is working');
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

