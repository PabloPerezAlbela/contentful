const contentful = require("contentful");

async function handleContentFul(contentfulid) {
    const client = contentful.createClient({
        // This is the space ID. A space is like a project folder in Contentful terms
        space: "9gfugcn2eshy",
        // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
        accessToken: "Kcdd9ORQEjW4nQ_nU1puMIbEnR8AsJYdId4RcYTYQHk"
    });
    // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
    const response = await client
        .getEntry(contentfulid)
    // .then(entry => console.log(entry))
    // .catch(err => console.log(err));

    console.log("response: ",response);
    return response.fields.answer.content[0].content[0].value;
    

}


module.exports = {
    handleContentFul: handleContentFul,
};