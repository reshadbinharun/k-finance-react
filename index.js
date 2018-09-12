require('dotenv').config()
var express = require('express'),
bodyParser = require('body-parser'),
app = express();
app.use(bodyParser.json())
const util = require('util') //to inspect full arrays in console.log
var async = require('async')

//requirements for scraping:
var request = require('request'),
cheerio = require('cheerio')

const mongo = require('mongodb').MongoClient,
url = process.env.mongo_url;
var db; //setting var with global scope


mongo.connect(url, (err, database) => {
  // ... start the server
  if (err) console.log("Could not start db");
  else {
    console.log("DB connection opened");
    db = database.db('users_kfinance'); //setting db to k-finance
  }
})
// var h1 = "<!DOCTYPE html><html><head><title> KFinance </title><meta charset = \"utf-8\" /><link rel=\"stylesheet\" href=\"style.css\" type=\"text/css\" /></head><body>";
// var h2 = "</body></html>";

app.post('/getPortfolio', function(req,res){
  console.log("portfolio fetch request made")
  var user = req.body.user;
  var cursor = db.collection('portfolios').find({user: user});
  var db_data = cursor.toArray(function(err,dat){
    //console.log(dat[0].stocks)
    console.log(dat)
    res.send(dat);
  });
})

// app.post('/addUser', function(req, res){
//   console.log("add user route hit")
//   var user = req.body.user;
//   //using upsert: https://stackoverflow.com/questions/19974216/is-there-an-upsert-option-in-the-mongodb-insert-command
//   db.collection('portfolios').updateOne({user: user}, {$set : {stocks:[]}}, {upsert: true}); //updates only if no document found
//   //USE ASYNC library:
//   //https://stackoverflow.com/questions/16660956/multiple-async-mongo-request-in-nodejs
// })

//path to only update exist stocks
app.post('/updatePortfolio', function(req,res){
  console.log("portfolio change request made")
  var user = req.body.user, stock = req.body.stock, buy = req.body.buy, quantity = parseInt(req.body.quantity);
  var change = (buy == 'BUY'?1:-1)
  console.log(change, quantity)
  //MAKE CHANGE TO USER PORTFOLIO
  db.collection('portfolios').updateOne({user: user, "stocks.stock": stock}, {$inc : {"stocks.$.quantity" : change*quantity}}, {upsert: true});
})

app.post('/newStock', function(req,res){
  console.log("new stock request")
  var user = req.body.user, stock = req.body.stock, quantity = parseInt(req.body.quantity);
  //MAKE CHANGE TO USER PORTFOLIO
  db.collection('portfolios').updateOne({user: user}, {$push : {stocks : {stock: stock, quantity: quantity}}}, {upsert: true});
})


app.post('/komb', function(req,res){
  console.log('in komb');
  
  var stock = req.body.ticker;
  var stock_url1 = 'https://finance.yahoo.com/quote/'+stock+'/financials?p=\''+stock;
  var stock_url2 = 'https://finance.yahoo.com/quote/'+stock+'/balance-sheet?p='+stock;

  var elems1 = [];
  var elems2 = [];
  var kombs1 = [];
  var kombs2 = [];
  //from income statement
  request(stock_url1, function (error1, response1, html1) {
      if (!error1 && response1.statusCode == 200) {
        var $ = cheerio.load(html1);
        
        var a = $('td').each(function(i, elem1){
          elems1[i] = $(this).text();
        });
        elems1.join(' ,'); 
        //request within request so all data is retrieved in same function call: AJAX
          request(stock_url2, function (error2, response2, html2) {
            if (!error2 && response2.statusCode == 200) {
              var $ = cheerio.load(html2);
            
              var a = $('td').each(function(i, elem2){
                elems2[i] = $(this).text();
              });   
              elems2.join(' ,');
        
              //ALL KOMBS
              // console.log(util.inspect(elems1,{ maxArrayLength: null }))
              // console.log(util.inspect(elems2,{ maxArrayLength: null }))
            kombs1 = {data_past : elems1[4], rev_n : elems1[6], rev_p: elems1[9], net_income_n : elems1[110], net_income_p: elems1[113], net_assets_p : elems2[75],
            net_assets_n : elems2[72], ltdebt_p: elems2[101], ltdebt : elems2[98], tclia_p: elems2[96], tclia : elems2[93], tcasset_p : elems2[35], tcasset : elems2[32],
            num_stock_mil_p : elems2[172], num_stock : elems2[169]};
            //sending data
            //Building html

            var html2send = "";
            html2send+="<h1>"+stock+"'s journey between now and "+kombs1.data_past+" looked like ...</h1>";
            html2send+="<h2> Balance Sheet </h2>";
            //ASSET
            html2send+="<p> Net Assets (past): $"+kombs1.net_assets_p+"K --> Net Assets (now): $"+ kombs1.net_assets_n+"K";
            var ass_change = (((parseFloat(kombs1.net_assets_n)-parseFloat(kombs1.net_assets_p))/parseFloat(kombs1.net_assets_p))*100).toFixed(2);
            var ass_dir = "";
            if (ass_change<0) ass_dir+="drop";
            else ass_dir+="growth";
            html2send+=", therefore, a "+ ass_change+ " % "+ ass_dir+"</p>";
            //Long-term Debt
            html2send+="<p> Long-term debt (past): $"+kombs1.ltdebt_p+"K --> Long-term debt (now): $"+ kombs1.ltdebt+"K";
            var debt_change = (((parseFloat(kombs1.ltdebt)-parseFloat(kombs1.ltdebt_p))/parseFloat(kombs1.ltdebt_p))*100).toFixed(2);
            var debt_dir = "";
            if (debt_change<0) debt_dir+="drop";
            else debt_dir+="growth";
            html2send+=", therefore, a "+ debt_change+ " % "+ debt_dir+"</p>";
            //Revenue
            html2send+="</p> Income Statement <p>";
            html2send+="<p> Revenue (past): $"+kombs1.rev_p+"K --> Revenue (now): $"+ kombs1.rev_n+"K";
            var rev_change = (((parseFloat(kombs1.rev_n)-parseFloat(kombs1.rev_p))/parseFloat(kombs1.rev_p))*100).toFixed(2);
            var rev_dir = "";
            if (rev_change<0) rev_dir+="drop";
            else rev_dir+="growth";
            html2send+=", therefore, a "+ rev_change+ " % "+ rev_dir+"</p>";
            //Net Income
            html2send+="<p> Net Income (past): $"+kombs1.net_income_p+"K --> Net Income (now): $"+ kombs1.net_income_n+"K";
            var ni_change = (((parseFloat(kombs1.net_income_n)-parseFloat(kombs1.net_income_p))/parseFloat(kombs1.net_income_p))*100).toFixed(2);
            var ni_dir = "";
            if (ni_change<0) ni_dir+="drop";
            else ni_dir+="growth";
            html2send+=", therefore, a "+ ni_change+ " % "+ ni_dir+"</p>";

            //Metrics
            html2send+="<h1>Here are the historical metrics for "+stock+ " for "+ kombs1.data_past+ ". Find the next "+ stock+ " ?</h1>";
            var eps = (parseFloat(kombs1.net_income_p)/parseFloat(kombs1.num_stock_mil_p)).toFixed(2);
            html2send+="<p> EPS: $"+eps+"/share...<p>";
            var roa = (parseFloat(kombs1.net_income_p)/parseFloat(kombs1.net_assets_p)).toFixed(2);
            html2send+="<p> ROA (Asset Efficiency): "+roa+"...<p>";
            var cr = (parseFloat(kombs1.tcasset_p)/parseFloat(kombs1.tclia_p)).toFixed(2);
            html2send+="<p> Current Ratio (Short-term Assets vs. Short-term Debt): "+cr+"...<p>";
            //html2send+="</form><a href=\"index.html\"><button>Return Home</button></a></form>";
            var dat2send = {date_past : elems1[4], rev_n : elems1[6], rev_p: elems1[9], net_income_n : elems1[110], net_income_p: elems1[113], net_assets_p : elems2[75],
            net_assets_n : elems2[72], ltdebt_p: elems2[101], ltdebt : elems2[98], tclia_p: elems2[96], tclia : elems2[93], tcasset_p : elems2[35], tcasset : elems2[32],
            num_stock_mil_p : elems2[172], num_stock : elems2[169], ass_change: ass_change, debt_change: debt_change, ass_dir: ass_dir, debt_dir: debt_dir, rev_dir: rev_dir, ni_dir: ni_dir, eps: eps, roa: roa, cr: cr}
            console.log(kombs1);
            //res.send(h1+html2send+h2);
            res.send(html2send);
            }
          });

    }
  });
});

app.listen(8080, () => console.log("Server is running!"));

