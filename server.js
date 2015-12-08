var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);
var fs = require('fs');
var ejs = require('ejs');
var methodOverride = require('method-override');
app.use(methodOverride('_method'))
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');
app.use(express.static(__dirname + '/public'))
app.listen(3000, function() {
	console.log('server up on port 3000!')
})



app.get('/', function(req, res) {
	res.redirect('/posts')
});

//INDEX
app.get('/posts', function(req, res) {
	db.all('select * from posts', function(err, rows) {
		if(err) {
			console.log(err);
		} else {
			var data = rows;
			var template = fs.readFileSync('./public/views/index.html', 'utf8');
			var rendered = ejs.render(template, {data: data});
			res.send(rendered);
		};
	}); 
});

//NEW
app.get('/posts/new', function(req, res) {
	var form = fs.readFileSync('./public/views/new.html', 'utf8');
	res.send(form)
})

//CREATE
app.post('/posts', function(req, res) {
	db.run('insert into posts (title, content) values (?, ?)', req.body.title, req.body.content, function(err) {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/posts')
		}
	})
})

//EDIT
app.get('/posts/:id/edit', function(req, res) {
	// res.send(typeof req.params.id)
	var id = parseInt(req.params.id)
	db.get('select * from posts where id=?', id, function(err, row) {
		if (err) {
			console.log(err)
		} else {
			// console.log(row)
			var data = row;
			var template = fs.readFileSync('./public/views/edit.html', 'utf8');
			var rendered = ejs.render(template, {data: data})
			res.send(rendered);
		}
	})
})

//UPDATE
app.put('/posts/:id', function(req, res) {
	console.log(req.body)
	console.log(req.params)
	db.run('update posts set title=?, content=? where id=?', req.body.title, req.body.content, req.params.id, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log('updated baby!!')
			res.redirect('/posts')
		}
	})
})

//DELETE
app.delete('/posts/:id', function(req, res) {
	db.run('delete from posts where id=?', req.params.id, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log('deleted something?')
			res.redirect('/posts')
		}
	})
})

//SEARCH

app.post('/search', function(req, res) {
	// console.log(req.body)
	db.all('select * from posts', function(err, rows){
		if (err) {
			console.log(err)
		} else {
			// console.log(rows)
			var data = rows;
			var results = [];
			var re = new RegExp(req.body.search, 'i')
			data.forEach(function(e) {
				if(e.title.match(re) || e.content.match(re)) {
					results.push(e)
				}
			})
			var template = fs.readFileSync('./public/views/search.html', 'utf8');
			var rendered = ejs.render(template, {results: results})
			res.send(rendered)
		}
	})
})















