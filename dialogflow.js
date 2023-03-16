
//const languageCode = 'es'
//const dialogflow = require('@google-cloud/dialogflow');
//const uuid = require('uuid');

async function handleDialogFlow_old(projectId, query) {
    // A unique identifier for the given session
    const sessionId = uuid.v4();
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({
        //keyFilename: "./scotibot-nitc-4248675601b4.json" //include the JSON file here!
        keyFilename: "./project1-379221-e61cc17cde3b.json" //include the JSON file here!
    });
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: query,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
    };
    // Send request and log result

    let responses;
    try {
        responses = await sessionClient.detectIntent(request);
    } catch (err) {
        console.log(err);
    }


    //return responses;
    //console.log("dialogflow: ",responses[0].queryResult.parameters, responses[0].queryResult.fulfillmentMessages, responses[0].queryResult.intent);
    if (responses) {
        console.log("dialogflow: ", responses);
        console.log("intent: ", responses[0].queryResult.intent.displayName);
    }

    console.log("intent: ", responses[0].queryResult.intent.displayName);



    const result = responses[0].queryResult;

    return result.intent.displayName;

    // const result = responses[0].queryResult;
    // console.log(`  Query: ${result.queryText}`);
    // console.log(`  Response: ${result.fulfillmentText}`);
    // if (result.intent) {
    //     console.log(`  Intent: ${result.intent.displayName}`);
    // } else {
    //     console.log('  No intent matched.');
    // }
}


async function handleDialogFlow(projectId, query, currentPage = '') {

    const location = 'global';
    const agentId = 'ee65a5ce-dca5-4dbb-8874-3ef5919fd538';
    const languageCode = 'es';

    // Imports the Google Cloud Some API library
    const { SessionsClient } = require('@google-cloud/dialogflow-cx');

    /*¿   * Example for regional endpoint:
     *   const location = 'us-central1'
     *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
     */
    const client = new SessionsClient();




    const sessionId = Math.random().toString(36).substring(7);

    const sessionPath = client.projectLocationAgentSessionPath(
        projectId,
        location,
        agentId,
        sessionId
    );
    const request = {
        session: sessionPath,
        queryParams: {
            currentPage: currentPage,
        },
        queryInput: {
            text: {
                text: query,
            },
            languageCode,
        },
    };
    console.log("llega", query, projectId);
    const [response] = await client.detectIntent(request);
    var dialogFlowCXResult;

    //console.log("intenttt: ", response.queryResult.match.intent.displayName);
    //return response;
    
    if(response && response.queryResult.match!=null && response.queryResult.match.intent!=null && response.queryResult.match.intent.displayName!=null){
        console.log("llega if", response.queryResult.match.intent.displayName);
         dialogFlowCXResult = {            
            text: response.queryResult.responseMessages[0].text.text,
            currentPageName: response.queryResult.currentPage.name,
            currentPageDisplayName: response.queryResult.currentPage.displayName,
            intentName: response.queryResult.match.intent.name,
            intentDisplayName: response.queryResult.match.intent.displayName
        }
    }
    else{
        console.log("llega else");
         dialogFlowCXResult = {
            text: response.queryResult.responseMessages[0].text.text,
            currentPageName: response.queryResult.currentPage.name,
            currentPageDisplayName: response.queryResult.currentPage.displayName,
            intentName: "Default Fallback Intent",
            intentDisplayName: "Default Fallback Intent"
        }
    }
    
    

    //console.log("final: ", dialogFlowCXResult);
    return dialogFlowCXResult;

}



module.exports = {
    handleDialogFlow: handleDialogFlow,
};