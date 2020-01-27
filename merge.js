var fs = require('fs');
var XLSX = require('xlsx');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var Handlebars = require('handlebars');
var uuid = require('uuid/v1');
var shortid = require('shortid');
var mongoid = require('mongoid-js');

var replaceAll = function(find, replace, str) {
  if (str){
    //console.log(str)
    return str.replace(new RegExp(find, 'g'), replace);  
  }  
}

var splitAndTrim = function(str, separator){
  var list = [];
  separator = separator || ',';
  if (str && (typeof str == 'string')){
    str = str.trim();
    if (str){
      var items = str.split(separator);
      if (items && items.length){
        var l = items.length;
        for (var i = 0; i < l; i++) {
          list.push(items[i].trim());
        };
      }
    }
  } else 
  if (_.isArray(str)){
    list = Utils.clone(str);
  }
  if (list.length==0){
    list = null;
  }
  return list;
}

Handlebars.registerHelper('array', function(context, options) {
  var out = '';
  if (context){
    var items = splitAndTrim(context);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item){
        if (out){
          out+=','
        }
        out+='"'+item+'"';
      }
    }
  }
  return new Handlebars.SafeString(out);
});

Handlebars.registerHelper('uuid', function(options) {
  return new Handlebars.SafeString(uuid());
});

Handlebars.registerHelper('shortid', function(options) {
  return new Handlebars.SafeString(shortid());
});

Handlebars.registerHelper('mongoid', function(options) {
  return new Handlebars.SafeString(mongoid());
});

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

var excel = process.argv[2];
var tpl = process.argv[3];
var lista = process.argv[4];
// if (name&&name.substr(-1)!=='.'){
//   name=name.trim()+'.';
// }

var outName1 = lista;
var plantilla = fs.readFileSync(tpl, 'utf8')
var tpl = Handlebars.compile(plantilla);


// var tpl2 = './slot.json';
// var outName2 = './slots.json';
// var plantilla2 = fs.readFileSync(tpl2, 'utf8')
// var tpl2 = Handlebars.compile(plantilla2);


//console.log(plantilla.length)
var out = '';
var out2 = '';
if (excel){
  var buf = fs.readFileSync(excel);
  var wb = XLSX.read(buf, {type:'buffer'});
  var sheets = wb.SheetNames;

  if (sheets){
    var ws = wb.Sheets['Hoja1']||wb.Sheets[sheets[0]];
    var items = trimKeys(XLSX.utils.sheet_to_json(ws));   
    out+='[';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var data = tpl(item);
      //var data2 = tpl2(item);
      out+=data+',\n';
      //out2+=data2+'\n';
    }
    out+=']';
    //console.log(out)
  }
  if (outName1){
    fs.writeFileSync(outName1, out)
  }
  // if (outName2){
  //   fs.writeFileSync(outName2, out2)
  // }
  
} else console.error('Error:','file not found')