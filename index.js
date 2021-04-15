const session = require ( 'express-session' ) ;
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
var createError = require('http-errors');
const express = require('express');
const routeur = express.Router();
var logger = require('morgan');
var mongo = require('mongodb');
var monk = require('monk');
var con = require('mysql');
//var path = require('path');
const app = express();
const siteTitle = "Airline Express";
var url = "mongodb://localhost:27017/";
const URLbase = "http://localhost:5000/";
var db = monk('localhost:27017/db_airline_express');
const URLcpt = "http://localhost:5000/compte/creercompte/";
const URLreservation = "http://localhost:5000/Reservation/Reserver";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
module.exports = app;


app.set('view engine', 'ejs');

/**
 * Import all related javascript and css files to inject in our app
 *  */ 
 app.use ( session ( { secret : '1111111' ,saveUninitialized : false , resave : false } ) ) ;
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use ( express.static ( __dirname + '/views/pages' ) ) ;
app.use(express.static(__dirname + "/public"));



//Permet d'afficher les messages d'allerte
// Avant, installer: npm i alert
const alert = require('alert');
const { debug, Console } = require('console');

/*app.listen(process.env.PORT || 3000,() => {​​
    console.log ( 'Application démarrée sur PORT $ {​​ process. env . PORT || 3000 }​​ ' ) ;
}​​ ) ;*/
var server = app.listen(5000, function(){
    console.log("serveur fonctionne sur 5000... ! ");
});


app.set('view engine', 'ejs');

/**
 * Import all related javascript and css files to inject in our app
 *  */ 
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + "/public"));

/**
 * Connexion à la base de données db_airline_express
 */
app.use(function(req,res,next){
    req.db = db;
    next();
  });




/*
Page D'accueil: Explication du but de la compagnie
*/
app.get('/',function (req,res) {
    //res.end('Vous êtes à l\'accueil');
    res.render('pages/index',{
        siteTitle : siteTitle,
        pageTitle : "Page d'accueil"
    });
});



/*
Afficher la liste des vols
*/
/*app.get('/Vols',function (req,res) {
    /*
    Afficher tous les enrégistrements de la table vol
    */
    /*con.query("SELECT * FROM vol ORDER BY id_vol", function (
    err, result){
        res.render('pages/liste_vols.ejs',{
            siteTitle : siteTitle,
            pageTitle : "Liste des vols offerts",
            items : result
        });
    });
});*/

/*
Page De contact au cas où le client souhaite nous joindre
*/
app.get('/Contacts',function (req,res) {
    //res.end('Vous êtes à l\'accueil');
    res.render('pages/contact.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Page de contact"
    });
});

var test;

/*
Effectuer les différentes réservations
*/
app.get('/Reservation',function (req,res) {
    test = req.params.prix; 
    console.log(test);
    res.render('pages/Reserver.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Reserver un vol?"
    });
});



/*
Réserver
*/
/* 
Variables
*/
var paysorigine = "Canada";
var paysdestination = "Mexique";

app.get('/Reservation/Reserver',function (req,res) {
    /*
    Afficher tous les enrégistrements de la table vol correspondants aux critères du client
    */
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");
        var query = { pays_origine: paysorigine, pays_destination: paysdestination};
        console.log("result");
        dbo.collection("vol").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

          //Affichage du résultat dans la page
          res.render('pages/Reserver.ejs',{
            siteTitle : siteTitle,
            pageTitle : "Reserver en ligne",
            items : result
          });

          db.close();
       
        });
    });
    
});


//Verifier si les pays saisi correspondent aux pays de la base de données
app.post('/Reservation/Reserver',function (req,res) {
    /*
    Afficher tous les vols correspondant aux critères
    */

    paysorigine = req.body.pays_origine;
    paysdestination = req.body.pays_destination;

    res.redirect(URLreservation);
    
});


/*
Connexion via u serveur en ligne
 */

var sess ; // session globale, NON recommandée

routeur.get ( '/Compte' , ( req , res ) => {
    sess = req.session ;
    if ( sess.email ) {
        return res.redirect (URLreservation) ;
    }
    //res.sendFile(__dirname + '/views/pages/compte.ejs');
    res.render('pages/compte.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Connexion",
    });
} ) ;


var email = "";
var password = "";
routeur.post ( '/login' , ( req , res ) => {
    sess = req.session ;
    sess.email = req.body.email ;
    res.end ( 'done' ) ;

    email = req.body.email;
    password = req.body.pass;
} ) ;
    
routeur.get( '/compte/Deconnexion' ,(req , res ) => {
    req.session.destroy ( ( err ) => {
        if ( err ) {
           console.log( err ) ;
        }
        res.redirect ( '/' ) ;
    } ) ;

} ) ;

app.use ( '/' , routeur ) ;

/*
Facture de la réservation
*/
var num_vol;
app.get('/Reservation/Facturation',function (req,res) {
    /*
    Afficher tous les informations sur le vol à réserver
    */
    num_vol = req.params;
    console.log(num_vol);
    //let sql = "SELECT * FROM vol WHERE _id.toString() = '" + num_vol + "'";
    /*con.query(sql, function (err, result){
        res.render('pages/facture.ejs',{
            siteTitle : siteTitle,
            pageTitle : "Liste des vols à réserver",
            items : result
        });
    });*/
});


// Enregistrer les informations sur la réservation dans la table facture
/*app.post('/Reservation/Facturation/:id_vol',function (req,res) {
    let sql = "SELECT * FROM compte WHERE nom_user = '"+nom_utilisateur+"' AND mot_de_passe = '"+motdepasse+"'";
    con.query(sql, function (err, result, fields) {
        if (err) 
            throw err;
        else
            con.query("SELECT * FROM vol WHERE id_vol = '" + num_vol + "'", function (err, rows){
                if (err) 
                    throw err;

                var query = "INSERT INTO facture (date_fact, prix, client_id_client) VALUES (";
                query += " '2021-03-02',";
                query += " '"+rows[0].prix+"',";
                query += " '"+result[0].id_client+"')"; 
                
                console.log(result);
                console.log(rows);
                console.log(sql);

                con.query(query, function (err, result){
                    if (err) 
                        throw err;
                    res.redirect(URLbase);
                });
            });
    });

});*/


//Creer un client
/*app.get('/compte/creerclient',function (req,res) {
    /*
    Afficher tous les enregistrements de la table vol
    */
    /*con.query("SELECT * FROM client ORDER BY id_client", function (
    err, result){
        res.render('pages/creerclient.ejs',{
            siteTitle : siteTitle,
            pageTitle : "Creation de compte",
            items : result
            
        });
    });
});*/


//Creer un compte client
app.get('/compte/creerclient',function (req,res) {
    //res.end('Vous êtes à l\'accueil');
    res.render('pages/creerclient.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Pageclient"
    });
});

//Déclaration des variables necessaires à la création du compte client 
var nom;
var prenom; 
var addresse;
var courriel;
var password;
/*
Ajouter un client à la base de données 
*/
app.post('/compte/creerclient',function (req,res) {
    nom = req.body.nom_client;
    prenom = req.body.prenom_client;
    addresse = req.body.addresse_client;
    courriel = req.body.courriel_client;
    password = req.body.password_client;

mongo.connect(url,function(err,db) {
    if (err) throw err;
    var dbo = db.db("db_airline_express");

    clientcreation = {nom, prenom, addresse, courriel, password};
    console.log(clientcreation);
    dbo.collection("client").insertOne(clientcreation, function(err, res){
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
    res.redirect("/");
})
});

/*
Ajouter un compte à la base de données
*/
/*app.post('/compte/creercompte',function (req,res) {

    let sql = "SELECT * FROM client WHERE prenom_client = '"+prenom+"' AND nom_client= '"+nom+"'";
    con.query(sql, function (err, result, fields) {
        if (err) 
            throw err;
        else 
            var query = "INSERT INTO compte (nom_user, mot_de_passe, client_id_client) VALUES (";
            query += " '"+req.body.nom_user+"',";
            query += " '"+req.body.mot_de_passe+"',";
            query += " '"+result[0].id_client+"')";

        console.log(result);
        con.query(query, function (err, result){
            if (err) 
                throw err;
            res.redirect(URLreservation);
        });
    });

});
*/