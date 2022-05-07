var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var request = require('request');
const axios = require('axios'); 

var ensureLoggedIn = ensureLogIn();

const getToken = async () => {
  const body = {
    "client_id":process.env.API_EXPLORER_CLIENT_ID,
    "client_secret":process.env.API_EXPLORER_SECRET,
    "audience":process.env.MANAGEMENT_API_URL,
    "grant_type":"client_credentials"}  
  try{
    const response = await axios.post(process.env.TOKEN_URL, body)    
    return response.data.access_token   
  } catch (err){
    console.log('ERROR GETTING TOKEN', err)
  }
}

const getAppName = rule => {
  const testString = "clientName"  
  let {script} = rule 
      let startIndex = script.indexOf(testString)+testString.length+6
      let start = script.slice(startIndex)
      let endIndex = start.indexOf("'")
      const name = start.slice(0, endIndex)
      return {...rule, appName: name}
}

async function getClients(req, res, next){

  const token = await getToken()
  
  try {
  
    const get_clients = { 
      method: "GET",
      url: process.env.CLIENTS_URL,
      headers: { "authorization": "Bearer "+ token },
    };
    
    const get_rules = {
      method: "GET",
      url: process.env.RULES_URL,
      headers: { "authorization": "Bearer "+ token },
      
    }  
    const clientsResponse = await axios(get_clients)
    const rulesResponse = await axios(get_rules)
    const clients = clientsResponse.data
    const rules = rulesResponse.data
        
    const testString = "clientName"
    
    const rulesWithAppNames = rules
      .filter(rule => rule.script.includes(testString))
      .map( rule => getAppName(rule) )    
    
    const globalRules = rules.filter(rule => !rule.script.includes(testString))  
    
    const clientsWithRules = clients.map( client => {
      let rules = [...globalRules.map(r => r.name), 
        ...rulesWithAppNames.filter(r => r.appName === client.name).map(r => r.name)]
      return {...client, rules}

    })

    res.locals.clients = clientsWithRules.filter(client => client.name !== "All Applications")
    res.locals.rulesWithAppNames = rulesWithAppNames 
    res.locals.globalRules = globalRules

    next()
  } catch (error) {
    console.log('ERROR GETTING CLIENTS', error)
  }  
}
var router = express.Router();
/* GET home page. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  if (!req.user) { return res.render('home'); }
   next();
}, getClients, function(req, res, next) {     
     res.render('index', { user: req.user });
   } 
 
);


module.exports = router;
