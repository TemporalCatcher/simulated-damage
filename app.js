var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

// determine information about the type advantage
function getType(req, res, next) {
    req.type = {};
    let t1 = req.type.t1 = parseFloat(req.query.type1);
    let t2 = req.type.t2 = parseFloat(req.query.type2);
    // think rock = 0, scissors = 1, paper = 2
    if ((t1 == 0 && t2 == 1) || 
        (t1 == 1 && t2 == 2) || 
        (t1 == 2 && t2 == 0)) {
        req.type.adv = 2;
    }
    else if ((t1 == 1 && t2 == 0) || 
        (t1 == 2 && t2 == 1) || 
        (t1 == 0 && t2 == 2)) {
        req.type.adv = 0.5;
    }
    else {
        req.type.adv = 1;
    }
    next();
}

// determine the full buff stats of attacker
function getAttack(req, res, next) {
    req.atk = {};
    let atk = req.atk.base = parseFloat(req.query.atk);
    let buff = req.atk.buff = parseFloat(req.query.buff1);
    let debuff = req.atk.debuff = parseFloat(req.query.debuff1);
    req.atk.atk = atk * (1 + (buff - debuff) / 100);
    next();
}

// determine the full buff stats of defender
function getDefense(req, res, next) {
    req.def = {};
    let def = req.def.base = parseFloat(req.query.def);
    let buff = req.def.buff = parseFloat(req.query.buff2);
    let debuff = req.def.debuff = parseFloat(req.query.debuff2);
    req.def.def = def * (1 + (buff - debuff) / 100);
    next();
}

// determine whether an attack has did a critical hit
function getCritical(req, res, next) {
    req.crit = {};
    let chance = req.crit.chance = parseFloat(req.query.chance);
    let rand = req.crit.rand = Math.round(Math.random() * 100);
    if (chance >= rand) {
        req.crit.mult = 2;
    }
    else {
        req.crit.mult = 1;
    }
    next();
}

// get information relevant to type adventage
app.get('/type', getType, (req, res) => {
    let jFile = {
        "attack": req.type.t1,
        "defend": req.type.t2,
        "advantage": req.type.adv
    }
    res.status(200);
    res.json(jFile);
    res.end();
});

// get information relevant to attacker's attack output
app.get('/attack', getAttack, (req, res) => {
    let jFile = {
        'base': req.atk.base,
        'buff': req.atk.buff,
        'debuff': req.atk.debuff,
        'attack': req.atk.atk
    };
    res.status(200);
    res.json(jFile);
    res.end();
});

// get infromation relevant to defender's defense output
app.get('/defense', getDefense, (req, res) => {
    let jFile = {
        'base': req.def.base,
        'buff': req.def.buff,
        'debuff': req.def.debuff,
        'def': req.def.def
    };
    res.status(200);
    res.json(jFile);
    res.end();
});

// get information about how critical hit is determined
app.get('/critical', getCritical, (req, res) => {
    let jFile = {
        "chance": req.crit.chance,
        "result": req.crit.rand,
        "multiplier": req.crit.mult
    };
    res.status(200);
    res.json(jFile);
    res.end();
});

// get the damage output from a simulated attack
app.get('/damage', getType, getAttack, getDefense, getCritical, (req, res) => {
    let adv = req.type.adv;
    let atk = req.atk.atk;
    let def = req.def.def;
    let crit = req.crit.mult;
    let random = Math.round(Math.random() * 20) - 10;
    let damage = (atk * (1 + random / 100) - def) * crit * adv;
    if (damage < 0) {
        damage = 0;
    }
    obj = {
        "type": req.type,
        "attack": req.atk,
        "defense": req.def,
        "multiplier": req.crit,
        "attack-mod": random,
        "damage": damage
    }
    res.status(200);
    res.json(obj);
    res.end();
});

// enable a port to listen to incoming HTTP requests
app.listen(3000, function() {
    console.log("API version 1.0.0 is running on port 3000");
});