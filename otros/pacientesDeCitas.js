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

var objectToArray = function(o, valueId, keyId, options){
  options = options || {};
  if (o){
    return Object.keys(o).map(function(k) { 
      if (keyId || valueId){
        var out = {};
        if (keyId){
          out[keyId] = (options.keyIsNumber)?Number(k):k;
          if (options.forceKeyToLowerCase && !options.keyIsNumber){
            out[keyId] = out[keyId].toUpperCase();
          }
        } 
        if (valueId) out[valueId] = o[k];
        return out;
      } else return o[k];
    });    
  }
}



  // var items = [];
  // for (var i = 0; i < 10000; i++) {
  //   items.push({id: i, name:'Renglón: '+i})
  // }
  // return res.send(items);
// va a ser mejor hacer esto en SQL
// select '1900-01-01' + INTERVAL(43160 - 2)DAY

var getPacientes = function(obj){
  var items = objectToArray(obj)
  var out = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    // out.push(item)
    out.push({
      replaceOne: {
        filter: {clave: item.clave},
        replacement: item
      }
    })
  }
  return out;
}

var pacientes = {};
var filename = './citas.xlsx';
if (filename){
  var buf = fs.readFileSync(filename);
  var wb = XLSX.read(buf, {type:'buffer'});
  var sheets = wb.SheetNames;

  if (sheets){
    var ws = wb.Sheets['Hoja1']||wb.Sheets[sheets[0]];
    var citas = trimKeys(XLSX.utils.sheet_to_json(ws)); 
    for (var i = citas.length - 1; i >= 0; i--) {
      var cita = citas[i];
      if (cita){
        var expediente = cita.expediente;
        if (expediente){
          pacientes[expediente] = {clave: expediente, nombreCompleto: cita.nombreCompleto, telefono: cita.telefono}
        }
      }      
    }
    var pacientes = getPacientes(pacientes);
    //console.log(pacientes.length)
    // console.log(_.countBy(pacientes, 'clave'))
    console.log(JSON.stringify(pacientes))
  }
} else console.error('Error:','file not found')