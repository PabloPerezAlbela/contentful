const dialogflow = require('./dialogflow');
const contentful = require('./contentful');
const cors = require('cors');
const knex = require('knex');

const express = require('express');

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'admin',
        database: 'pablo',
    },
});

const app = express();

app.use(cors());

app.use(express.json());

app.post('/query', async function (req, res) {
    const query = req.body.text;
    const currentPage = req.body.currentPage;
    
    console.log(req.body);

    if (!query) {
        return res.status(400).json('incorrect form submission');
    }

    //const projectId = 'scotibot-nitc';
    const projectId = 'project1-379221';
    console.log("query: ",query);


    const dialogFlowResult = await dialogflow.handleDialogFlow(projectId, query, currentPage);
    console.log("query post: ",dialogFlowResult.intentDisplayName);
    const page = dialogFlowResult.currentPageName;
    const intentResult = dialogFlowResult.intentDisplayName;

    const queryResult = await db.select('contentfulid')
        .where({
            dfintent: dialogFlowResult.intentDisplayName,
        })
        .from('df_contentfull');

    //console.log(queryResult);

    if (queryResult && queryResult[0] && queryResult[0].contentfulid) {
        const response = await contentful.handleContentFul(queryResult[0].contentfulid);
        //console.log("intent:    ",intentResult);
        return res.status(200).json({ response, currentPage: page, intentResult });
    }
    else{
        const response = "<<Se recononció Intent: "+intentResult+", pero no respuesta>>";
        //console.log("intent:    ",intentResult);
        return res.status(200).json({ response, currentPage: page, intentResult});
    }

    
    return null;

    // console.log(intent);
    // console.log(response);

})

app.listen(3000, () => {
    console.log('app is running on port 3000');
});




