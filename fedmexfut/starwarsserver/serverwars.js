var http = require('http'); 
const swapi = require('swapi-node');
var express = require('express');
var fs = require('fs');
var sortJsonArray = require('sort-json-array');

var app = express();

var port = process.env.PORT || 8080; 

var peoplexname;
var peoplexheight;
var peoplexmass;
var json;
var data = [];
var info;
var c=1;

function MakeJSON(data)
{
console.log ("Create materialized jsons from REST API SWAPI");

json=(JSON.stringify(data, null, 2)); 
fs.writeFile('./resources/personajes.json', json);

}


function DownloadfromSWAPI()
{
console.log ("Consuming REST API SWAPI from people...");

for(var i = 1; i<51; i++){
    http.get("http://swapi.co/api/people/"+i+"/", function(response){
    var body = '';

    response.on('data', function(chunk){
        body += chunk;
    });
    response.on('end', function() {
        info = JSON.parse(body);
        data.push(info);
        c++;
        if (c==51) MakeJSON(data);
      });
}).on('error', function(e){ console.log('Error: ', e.message); });
}

}

//**********************************************************************************

var obj = JSON.parse(fs.readFileSync('./resources/personajes.json', 'utf8'));

console.log ("+ Create materialized jsons by people-by-name");
peoplexname=sortJsonArray(obj, 'name','asc');

console.log ("+ Create materialized jsons by people-by-height");
peoplexheight=sortJsonArray(obj, 'height','asc');

console.log ("+ Create materialized jsons by people-by-mass");
peoplexmass=sortJsonArray(obj, 'mass','asc');

//************************************************************************************

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.send('TEST REST NODE API- 2007');
});


app.get('/residentes', function (req, res, next) {
 res.send("Residentes");
});


app.get('/personajes', function (req, res, next) {
  console.log('Strings='+req.params.ordernar);
  
  var op=req.query.ordernar;
  

 switch(op)
  {
        case "nombre":
             console.log ("Request swapi x name");
             res.json();
        break;
         
       case "peso":
             console.log ("Request swapi x mass");
             res.json(peoplexmass);
        break;    
        
       case "altura":
             console.log ("Request swapi x height");
             res.json(peoplexheight);
        break;   
           
        default:
            console.log("Sort undefined");
            //res.send("Sort order undefined");
            break;     
  }

  
}); 


app.get('/personaje/:id', function (req, res, next) {

  var person=req.params.id;

  switch(person)
  {
    case ":luke":
    //persona=1
    swapi.getPerson(1).then((result) => {
    console.log(result);
    res.send(result);
    });

    break;
    case ":han":
    //persona=14
    swapi.getPerson(14).then((result) => {
    console.log(result);
    res.send(result);
    });
    
    break;
    
    case ":leia":
    //persona=5;
    swapi.getPerson(5).then((result) => {
    console.log(result);
    res.send(result);
    });
    
    break;
    
    case ":rey":
    //persona=85;
    swapi.getPerson(85).then((result) => {
    console.log(result);
    res.send(result);
    });
    
    break;
  
    default:
      console.log("Esta persona no esta mapeada.");
    break;
  }      

  console.log('ID:'+req.params.id);
}); 



if (fs.existsSync('./resources/personajes.json')) {
    //DO noting;
    console.log("Already sincronized data...from SWAPI");
}
else
 {
   DownloadfromSWAPI();
 }


app.listen(port);
console.log('Servidor node Starwars-API corriendo en puerto:'+port);




