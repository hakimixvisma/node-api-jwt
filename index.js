const express = require('express');
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var jwt    = require('jsonwebtoken');
var config = require('./configuration/config');
const  ProtectedRoutes = express.Router(); 
var app = express(); 

// Set Secret
app.set('Secret', config.secret);

// log requests to console
app.use(morgan('dev'));

// parse JSON
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

ProtectedRoutes.use((req, res, next) => {
    // check header for the token
    var token = req.headers['access-token'];
    // decode token
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token, app.get('Secret'), (err, decoded) => {
            if (err) {
                return res.json({ message: 'invalid token' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token  
        res.send({
            message: 'No token provided.'
        });
    }
});


// Every route under API will be protected
app.use('/api', ProtectedRoutes);

app.get('/', function(req, res) {
    res.send('App is working')
});

ProtectedRoutes.get('/data', (req, res) => {
    let cars = [
        {id: 1, name: 'Ferrari'},
        {id: 2, name: 'Lamborghini'}
    ]
    
    res.json(cars)
});

app.post('/authenticate', (req, res) => {
    if (req.body.username === "mustafa") {
        if (req.body.password === 123) {
            //if eveything is okey let's create our token 

            const payload = {
                check: true
            };

            var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440 // expires in 24 hours
            });

            res.json({
                message: 'authentication done ',
                token: token
            });

        } else {
            res.json({ message: "please check your password !" })
        }
    } else {
        res.json({ message: "user not found !" })
    }
})
