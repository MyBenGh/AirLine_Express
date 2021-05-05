const { debug, Console } = require('console');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
var createError = require('http-errors');
const { json } = require('body-parser');
var mailer = require('express-mailer');
var nodemailer = require("nodemailer");
const express = require('express');
const routeur = express.Router();
var logger = require('morgan');
var mongo = require('mongodb');
var alert = require('alert');
var monk = require('monk');
var swig = require('swig');
const { stringify } = require('querystring');
const ObjectID = mongo.ObjectID;
const app = express();
const now = new Date();


const siteTitle = "Airline Express";
var url = "mongodb+srv://db_airline_express:tp3@dbairlineexpress.zokt8.mongodb.net/db_airline_express?retryWrites=true&w=majority";
const URLbase = "http://localhost:5000/";
var db = monk('mongodb+srv://db_airline_express:tp3@dbairlineexpress.zokt8.mongodb.net/db_airline_express?retryWrites=true&w=majority');
const URLreservation = "http://localhost:5000/Reservation/Reserver";
const URLHistReservations = "http://localhost:5000/Reservation";
const URLCompte = "http://localhost:5000/Compte";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
module.exports = app;

/**
 * Variables permettant de mieux gerer Node Js
 */
var sess ;
var courriel;
var password;
var paysorigine = "Canada";
var paysdestination = "Mexique";



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
app.get('/Vols',function (req,res) {
    /*
    Afficher tous les enrégistrements de la table vol
    */
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");
        dbo.collection("vol").find().toArray(function(err, result) {
          if (err) throw err;

          //Affichage du résultat dans la page
          res.render('pages/liste_vols.ejs',{
            siteTitle : siteTitle,
            pageTitle : "Liste des vols offerts",
            items : result
          });

          db.close();
       
        });
    });
});

/*
Page De contact au cas où le client souhaite nous joindre
*/
app.get('/Contacts',function (req,res) {
    res.render('pages/contact.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Page de contact"
    });
});

/*
Consulter l'historique des réservations
*/
app.get('/Reservation',function (req,res) {
    
    mongo.connect(url, function(err, db) { 
        if (err) throw err;
        var dbo = db.db("db_airline_express");
        var query = { courriel: courriel, password: password};
        dbo.collection("client").find(query).toArray(function(err, result) {
            if (err) throw err;
            
            if(result.length > 0){
                dbo.collection('reservation').aggregate([
                    //{$match: { "id_Client": result[0]._id } },
                    { $lookup:
                       {
                        from: 'vol',
                         localField: 'id_Vol',
                         foreignField: '_id',
                         as: 'Vols'
                       }
                     },
                     {
                        $lookup:{
                            from: "client", 
                            localField: "id_Client", 
                            foreignField: "_id",
                            as: "Clients"
                        }
                    },
                   {
                       $match:{
                           $and:[{"id_Client" : result[0]._id}]
                       }
                   }
                    ]).toArray(function(err, resultat2) {
                    if (err) throw err;
                    console.log(JSON.stringify(resultat2));
    
                    if (resultat2.length > 0){
                        res.render('pages/reservation.ejs',{
                            siteTitle : siteTitle,
                            pageTitle : "Historique des réservations",
                            items : resultat2
                        });
                    }else{
                        res.redirect(URLreservation)
                    }
                    
                    db.close();
                });
            }else{
                res.render('pages/reservation.ejs',{
                    siteTitle : siteTitle,
                    pageTitle : "Reservations",
                    items : result
                });
            }
            
            db.close();
        });
    
    });
});



/*
Choisir une vol à Réserver
*/
app.get('/Reservation/Reserver',function (req,res) {
    /*
    Afficher tous les enrégistrements de la table vol correspondants aux critères du client
    */
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");
        var query = { pays_origine: paysorigine, pays_destination: paysdestination};
        dbo.collection("vol").find(query).toArray(function(err, result) {
          if (err) throw err;

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
Connexion via un serveur en ligne
 */
routeur.get ( '/Compte' , ( req , res ) => {
    sess = req.session ;
    if ( sess.email ) {
        return res.redirect (URLHistReservations) ;
    }
    //res.sendFile(__dirname + '/views/pages/compte.ejs');
    res.render('pages/compte.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Connexion",
    });
} ) ;


/**
 * Ouvre une session au client
 */
routeur.post ( '/Compte' , ( req , res ) => {
    sess = req.session ;
    sess.email = req.body.email ;
    res.end ( 'done' ) ;

    courriel = req.body.email;
    password = req.body.pass;
} ) ;


/**
 * Permet à un client de se déconnecter
 */
routeur.get( '/Compte/Deconnexion' ,(req , res ) => {
    req.session.destroy ( ( err ) => {
        if ( err ) {
           console.log( err ) ;
        }
        courriel = "";
        password = "";
        res.redirect ( '/' ) ;
    } ) ;

} ) ;

app.use ( '/' , routeur ) ;

/*
Facture de la réservation 
*/
app.get('/Reservation/Facture/:id',function (req,res) {
    /*
    Afficher toutes les informations sur le vol à réserver
    */
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");
        var query = { _id : ObjectID(req.params.id)};
        dbo.collection("vol").find(query).toArray(function(err, result) {
          if (err) throw err;
          
          //Affichage du résultat dans la page
            res.render('pages/facture.ejs',{
                siteTitle : siteTitle,
                pageTitle : "Liste des vols à réserver",
                items : result
            });

          db.close();
       
        });
    });
});



// Enregistrer le vol dans la table facture
app.post('/Reservation/Facture/:id',function (req,res) {
    //Réserver le vol en question dans la table réserver
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var mois = 1;
        mois += now.getMonth();
        var dbo = db.db("db_airline_express");
        var query = { courriel: courriel, password: password};
        let date_jour =  now.getFullYear() + "-" + mois + "-" + now.getDate() 
                        + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

        dbo.collection("client").find(query).toArray(function(err, result1) {
            if (err) throw err;
            var InfosVol = { id_Client:result1[0]._id, id_Vol: ObjectID(req.params.id), Date_Reservation: date_jour };
            dbo.collection("reservation").insertOne(InfosVol, function(err, res) {
                if (err) throw err;
                db.close();
            });

            /**
             * Envoyer par mail la facture du client
            */
            var query = { _id : ObjectID(req.params.id)};
            dbo.collection("vol").find(query).toArray(function(err, result2) {
                if (err) throw err;
               
                var tps = result2[0].prix * 0.05;
                var tvq = result2[0].prix * 0.09975;
                var montant = tps +tvq + result2[0].prix;
                
                var transporter = nodemailer.createTransport({
                    service : 'gmail',
                    host: 'smtp.gmail.com', // hostname
                    auth: {
                        user: 'airlineexpresstp3@gmail.com',
                        pass: 'Livrable3'
                    }
                });

                const mailOptions = {
                    from: 'no-reply@example.com', // sender address
                    to: courriel, // list of receivers
                    subject: 'Facture du client', // Subject line
                    html: `<p> Bonjour ${result1[0].nom}, ${result1[0].prenom}</p>
                           <h1>Informations sur le vol réservé:</h1>
                           <p>Pays d'origine: ${result2[0].pays_origine}; </p>
                           <p>Pays de destination: ${result2[0].pays_destination}</p>
                           <p>Siège: ${result2[0].num_siege}</p>
                           <p>Date: ${result2[0].date_vol}</p>
                           <p>Sous Total: ${result2[0].prix}$</p><hr>
                           <p>TPS (5%): ${tps}$</p>
                           <p>TVQ (9.975%): ${tvq}$</p>
                           <p>Montant final: ${montant}$</p><hr>
                           <h1>Merci de nous faire confiance!</h1>`,
                    text: 'mail envoyé!'
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err){
                        console.log(err);
                        alert('Courriel incorrect ou inexistant; Veillez réessayer!');
                    }
                    else{
                        alert('Vous recevrez votre facture par courriel!');
                        console.log(info.response);
                    } 
                });
     
               db.close();
            });

            db.close();
            
        });
    });

    res.redirect(URLbase);
});


/**
 * Permet de créer un compte client
 */
app.get('/Compte/CreerCompte',function (req,res) {
    res.render('pages/creercompte.ejs',{
        siteTitle : siteTitle,
        pageTitle : "Pageclient"
    });
});

/*
Ajouter un compte à la base de données
*/
app.post('/Compte/CreerCompte',function (req,res) {

    var nom = req.body.nom_client;
    var prenom = req.body.prenom_client;
    var adresse = req.body.adresse;
    courriel = req.body.courriel;
    password = req.body.mot_de_passe;
    //Enrégistrer les données du client dans la base de données
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("db_airline_express");
        clientcreation = {nom, prenom, adresse, courriel, password};
        console.log(clientcreation)
        
        dbo.collection("client").insertOne(clientcreation, function(err, res){
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        }); 
    });

    res.redirect(URLreservation);

});


/**
 * Mise à jour du mot de passe client
 */
app.get('/Compte/Reinitialisermdp',function (req,res) {
    //res.end('Vous êtes à l\'accueil');
    res.render('pages/ReinitialiserMdp.ejs',{
        siteTitle : siteTitle,
        pageTitle : "PageUpdate"
    });
});







