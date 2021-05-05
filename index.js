const session = require ( 'express-session' ) ;
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
var createError = require('http-errors');
const express = require('express');
swig = require('swig');
mailer = require('express-mailer');
var nodemailer = require("nodemailer");
const routeur = express.Router();
var logger = require('morgan');
var mongo = require('mongodb');
var monk = require('monk');
var con = require('mysql');
var path = require('path');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const app = express();
var logger = require('morgan');
const siteTitle = "Airline Express";
var url = "mongodb+srv://db_airline_express:tp3@dbairlineexpress.zokt8.mongodb.net/db_airline_express?retryWrites=true&w=majority";
const URLbase = "http://localhost:5000/";
var db = monk('mongodb+srv://db_airline_express:tp3@dbairlineexpress.zokt8.mongodb.net/db_airline_express?retryWrites=true&w=majority');
const URLcpt = "http://localhost:5000/compte/creercompte/";
const URLreservation = "http://localhost:5000/Reservation/Reserver";

app.use(bodyParser());
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
const { domainToASCII } = require('url');
const { userInfo } = require('os');
const { Recoverable } = require('repl');

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

routeur.get ( '/compte/motdepasse' , ( req , res ) => {
    sess = req.session ;
    if ( sess.email ) {
        return res.redirect (URLreservation) ;
    }
    res.render('pages/motdepasse.ejs',{
        siteTitle : siteTitle,
        pageTitle : "oublié",
    });
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
});

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
app.post('/compte/creerclient', function (req,res) {

    var nomUser = req.body.nom_client;
    var prenomUser = req.body.prenom_client;
    var addresseUser = req.body.addresse_client;
    var username = req.body.courriel_client;
    var passwordUser = req.body.password_client;

    mongo.connect(url,function(err,db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");

        dbo.collection("client").find({courriel : username}).toArray(function(err,result){
            if(result[0].courriel === username){
                console.log("Le courriel existe deja.");
                db.close();
                res.redirect("/");

    }else{

        if (err) throw err;
        var dbo = db.db("db_airline_express");

        clientcreation = {nomUser, prenomUser, addresseUser, courrielUser, passwordUser};
        console.log(clientcreation);
        dbo.collection("client").insertOne(clientcreation, function(err, res){
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
        res.redirect("/");
        }
        });
       
            
});
})

app.post( '/compte/motdepasse', function(req, res){

    var username = req.body.courriel_client;

       mongo.connect(url,function(err,db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");

        dbo.collection("client").find({courriel : username}).toArray(function(err,result){
            if(result[0].courriel === username){
                console.log("in");

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'airlineexpresstp3@gmail.com  ',
                        pass: 'Livrable3'
                    }
                   });
        
                   const mailOptions = {
                    from: 'airlineexpresstp3@gmail.com  ', // sender address
                    to: username, // list of receivers
                    subject: 'Mot de passe oublié', // Subject line
                    html: '<p>Bonjour, ' + prenom  + '</p> <br> <p> Votre mot de passe est : ' + 
                    password// plain text body
                  };
                
                  transporter.sendMail(mailOptions, function (err, info) {
                    if(err)
                        alert("Courriel pas envoyé");
                    else
                        alert("Courriel envoyé");
                      res.redirect('/');
                    
                 });

            }
            else{
                console.log("Courriel non trouver");
                res.redirect('..');
            }
        db.close();
});
})
});