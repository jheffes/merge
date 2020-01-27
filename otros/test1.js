var fs = require('fs');
var XLSX = require('xlsx');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');

var trimKeys = function(items){
  if (items && _.isArray(items)){
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var item = {};
      _.each(items[i], function(value, key){
        item[key.trim()] = value;
      })
      out.push(item)
    }
  }
  return out;
}


  // var items = [];
  // for (var i = 0; i < 10000; i++) {
  //   items.push({id: i, name:'Renglón: '+i})
  // }
  // return res.send(items);
// va a ser mejor hacer esto en SQL
// select '1900-01-01' + INTERVAL(43160 - 2)DAY

var medicos = [];
var filename = process.argv[2];
if (filename){
  var buf = fs.readFileSync(filename);
  var wb = XLSX.read(buf, {type:'buffer'});
  var sheets = wb.SheetNames;

  if (sheets){
    var ws = wb.Sheets['Hoja1']||wb.Sheets[sheets[0]];
    var items = trimKeys(XLSX.utils.sheet_to_json(ws));   
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item&&medicos.indexOf(item.curpMedico)<0){
        medicos.push(item.curpMedico)
      }
    }
    console.log(JSON.stringify(medicos.length))
  }
} else console.error('Error:','file not found')