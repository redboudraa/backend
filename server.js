const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const dashboardRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');
let Dash = require('./dash.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

dashboardRoutes.route('/').get(function(req, res){
    res.send("let's go ");
})

dashboardRoutes.route('/add/:id').post(function(req, res) {
     var d = new Date();
   let dash = new Dash({medid: req.params.id, hour: d.getHours(), day: d.getUTCDate(), month: d.getMonth() ,year: d.getFullYear()  });
   //let dash=new Dash(req.body);
    dash.save()
        .then(dash => {
            res.status(200).json({'dash': 'dash added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
    
});


 dashboardRoutes.route('/list').get(async function(req, res) {
   let i;
    i = await Dash.find({ 'hour': 10 });
console.log("count "+i);
    Dash.find(function(err, dashes) {
        if (err) {
            console.log(err);
        } else {
            res.json(dashes);
        }
    });
});




//med routes 

dashboardRoutes.route('/month/:id').get(async function(req, res) {
   let i=[];
   for(var j=0;j<12;j++)
    i[j] = await Dash.count().where('month').equals(j).where('medid').equals(req.params.id);
console.log("count "+i);
    Dash.count({ 'hour': 5 },function(err, dashes) {
        if (err) {
            console.log(err);
        } else {
            res.json(i);
        }
    });
})



dashboardRoutes.route('/twomonth/:id').get(async function(req, res) {
    var d = new Date();
    var thismonth = d.getMonth();
    var lastmonth = d.getMonth()-1;
if (lastmonth<0)
{
    lastmonth=11;
} 
       let i =[] ;
       let j =[];
 var k=0;      
// while(k<30)
// {
//     i[j] = await Dash.count({ 'month': j });
// }
i[0] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').gte(0).lte(5);
i[1] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').gt(5).lte(10);
i[2] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').gt(10).lte(15);
i[3] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').gt(15).lte(20);
i[4] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').gt(20).lte(25);
i[5] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').gt(25).lte(30);
j[0] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(lastmonth).where('day').gte(0).lte(5);
j[1] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(lastmonth).where('day').gt(5).lte(10);
j[2] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(lastmonth).where('day').gt(10).lte(15);
j[3] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(lastmonth).where('day').gt(15).lte(20);
j[4] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(lastmonth).where('day').gt(20).lte(25);
j[5] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(lastmonth).where('day').gt(25).lte(30)
res.json([i,j]);

});



dashboardRoutes.route('/heur/:id').get(async function(req, res) {
    var d = new Date();
    var thismonth = d.getMonth();
    var thisday = d.getUTCDate();
    var thisyear = d.getFullYear();

       let i =[] ;
      
console.log(thisday);
i[1] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gte(0).lte(3);
i[2] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(3).lte(6);
i[3] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(6).lte(9);
i[4] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(9).lte(13);
i[5] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(13).lte(17);
i[6] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(17).lte(20);
i[7] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(20).lte(24);
i[0] = await Dash.count().where('medid').equals(req.params.id).where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(24).lte(0);
res.json(i);

});


dashboardRoutes.route('/top3').get(async function(req, res) {
 

 var top ;
Dash.aggregate([
        {
            $group: {
                _id: '$medid',  //$region is the column name in collection
                count: {$sum: 1}
            }

        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            result.sort(function(a, b){
  return a.count < b.count;
});
            let names=[];
            let values=[]
            if(result[0])
            {
                names[0]="Med ID = "+result[0]._id;
                values[0]=result[0].count;
            }
            if(result[1])
            {
                names[1]="Med ID = "+result[1]._id;
                values[1]=result[1].count;
            }
            if(result[2])
            {
                names[2]="Med ID = "+result[2]._id;
                values[2]=result[2].count;
            }
            res.json([names,values]);
        }
    });
 

 });













//admin routes

dashboardRoutes.route('/month').get(async function(req, res) {
   let i=[];
   for(var j=0;j<12;j++)
    i[j] = await Dash.count().where('month').equals(j);
console.log("count "+i);
    Dash.count({ 'hour': 5 },function(err, dashes) {
        if (err) {
            console.log(err);
        } else {
            res.json(i);
        }
    });
});


;



dashboardRoutes.route('/twomonth').get(async function(req, res) {
    var d = new Date();
    var thismonth = d.getMonth();
    var lastmonth = d.getMonth()-1;
if (lastmonth<0)
{
    lastmonth=11;
} 
       let i =[] ;
       let j =[];
 var k=0;      
// while(k<30)
// {
//     i[j] = await Dash.count({ 'month': j });
// }
i[0] = await Dash.count().where('month').equals(thismonth).where('day').gte(0).lte(5);
i[1] = await Dash.count().where('month').equals(thismonth).where('day').gt(5).lte(10);
i[2] = await Dash.count().where('month').equals(thismonth).where('day').gt(10).lte(15);
i[3] = await Dash.count().where('month').equals(thismonth).where('day').gt(15).lte(20);
i[4] = await Dash.count().where('month').equals(thismonth).where('day').gt(20).lte(25);
i[5] = await Dash.count().where('month').equals(thismonth).where('day').gt(25).lte(30);
j[0] = await Dash.count().where('month').equals(lastmonth).where('day').gte(0).lte(5);
j[1] = await Dash.count().where('month').equals(lastmonth).where('day').gt(5).lte(10);
j[2] = await Dash.count().where('month').equals(lastmonth).where('day').gt(10).lte(15);
j[3] = await Dash.count().where('month').equals(lastmonth).where('day').gt(15).lte(20);
j[4] = await Dash.count().where('month').equals(lastmonth).where('day').gt(20).lte(25);
j[5] = await Dash.count().where('month').equals(lastmonth).where('day').gt(25).lte(30)
res.json([i,j]);

});



dashboardRoutes.route('/heur').get(async function(req, res) {
    var d = new Date();
    var thismonth = d.getMonth();
    var thisday = d.getUTCDate();
    var thisyear = d.getFullYear();

       let i =[] ;
      
console.log(thisday);
i[1] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gte(0).lte(3);
i[2] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(3).lte(6);
i[3] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(6).lte(9);
i[4] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(9).lte(13);
i[5] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(13).lte(17);
i[6] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(17).lte(20);
i[7] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(20).lte(24);
i[0] = await Dash.count().where('month').equals(thismonth).where('day').equals(thisday).where('year').equals(thisyear).where('hour').gt(24).lte(0);
res.json(i);

});


dashboardRoutes.route('/top3').get(async function(req, res) {
 

 var top ;
Dash.aggregate([
        {
            $group: {
                _id: '$medid',  //$region is the column name in collection
                count: {$sum: 1}
            }

        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            result.sort(function(a, b){
  return a.count < b.count;
});
            let names=[];
            let values=[]
            if(result[0])
            {
                names[0]="Med ID = "+result[0]._id;
                values[0]=result[0].count;
            }
            if(result[1])
            {
                names[1]="Med ID = "+result[1]._id;
                values[1]=result[1].count;
            }
            if(result[2])
            {
                names[2]="Med ID = "+result[2]._id;
                values[2]=result[2].count;
            }
            res.json([names,values]);
        }
    });
 

 });
   







app.use('/todos', todoRoutes);
app.use('/dashboard', dashboardRoutes);
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});