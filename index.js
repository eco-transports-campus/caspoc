var express = require('express');
var ConnectCas = require('connect-cas2');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemoryStore = require('session-memory-store')(session);

var app = express();

app.use(cookieParser());
app.use(session({
    name: 'NSESSIONID',
    secret: 'Hello I am a long long long secret',
    store: new MemoryStore()  // or other session store 
}));

// CAS instanciation
var casClient = new ConnectCas({
    debug: true, // remove in production
    ignore: [   // path where no auth is required
        /\/$/
    ],
    match: [],
    servicePrefix: 'http://localhost:1234', // our site URL
    serverPath: 'https://sso.u-psud.fr',    // U-PSUD CAS base URL
    paths: {                                // U-PSUD CAS paths
        validate: '/cas/validate',
        serviceValidate: '/cas/serviceValidate',
        proxy: '/cas/proxy',
        login: '/cas/login',
        logout: '/cas/logout',
        proxyCallback: ''
    },
    redirect: false,
    gateway: false,
    renew: false,
    slo: true,
    cache: {
        enable: false,
        ttl: 5 * 60 * 1000,
        filter: []
    },
    fromAjax: {
        header: 'x-client-ajax',
        status: 418
    }
});

app.use(casClient.core());  // link CAS to Express

// NOTICE: If you want to enable single sign logout, you must use casClient middleware before bodyParser. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/logout', casClient.logout());

app.get('/app', function(req, res) {
    res.send('Should be logged-in : <br/>' + JSON.stringify(req.session.cas));
});

app.get('/', function(req, res) {
    let message = 'INDEX PAGE<br/>';
    if(req.session.cas && req.session.cas.user)
        message += 'You are authenticated as ' + req.session.cas.attributes.cn + '.';
    else
        message += 'You are not authenticated.';
    res.send(message);
})

var server = require('http').Server(app);
server.listen(1234);