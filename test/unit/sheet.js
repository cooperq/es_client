if (typeof define !== 'function') { var define = require('amdefine')(module) }
define(function (require) {

var Sheet = require('es_client/models/sheet');
var config = require('es_client/config');
var expect = require('chai').expect;
var should = require('chai').should();

describe('Sheet', function(){
  var sheet, events;

  var initializeSheet = function(){
    events = [];
    sheet = new Sheet();
    sheet.on('all',function(){
      events.push({
        name: arguments[0],
        args: Array.prototype.slice.call(arguments,1)
      });
    });
  };
  
  var clearEvents = function(){
    events = [];
  };

  describe('getters', function(){
    before(function(){
      initializeSheet();
    });

    it('rowCount should get row count', function(){
      sheet.rowCount().should.equal(config.DEFAULT_ROW_COUNT);
    });

    it('colCount should get column count', function(){
      sheet.colCount().should.equal(config.DEFAULT_COL_COUNT);
    });

    it('rowIds should return an array of ids', function(){
      var row_ids = sheet.rowIds();
      row_ids.length.should.equal(config.DEFAULT_ROW_COUNT);
    });

    it('colIds should return an array of ids', function(){
      var col_ids = sheet.colIds();
      col_ids.length.should.equal(config.DEFAULT_COL_COUNT);
    });
    it('colAt should return the id of the column at index', function(){
      var col_id = sheet.colIds()[0];
      sheet.colAt(0).should.equal(col_id);
    });
    it('rowAt should return the id of the row at index', function(){
      var row_id = sheet.rowIds()[0];
      sheet.rowAt(0).should.equal(row_id);
    });
  });

  describe('update cell', function(){
    var new_value,row_id, col_id, success;

    before(function(){
      initializeSheet();
      new_value = 5;
      row_id = sheet.rowIds()[0];
      col_id = sheet.colIds()[0];
      success = sheet.updateCell(row_id,col_id,new_value);
    });

    it('should return true', function(){
      success.should.equal(true);
    });

    it('should change the cell value', function(){
      sheet.getValue(row_id,col_id).should.equal(new_value.toString());
    });

    it('should trigger an update_cell event',function(){
      events.length.should.equal(1);
      events[0].name.should.equal('update_cell');
      var cell = events[0].args[0];
      cell.row_id.should.equal(row_id);
      cell.col_id.should.equal(col_id);
      cell.value.should.equal(new_value);
      cell.sheet_id.should.equal(sheet.id);
    });
  });

  describe('insert row', function(){
    var old_row_id, new_row_id;
  
    before(function(){
      initializeSheet();
      old_row_id = sheet.rowIds()[1];
      new_row_id = sheet.insertRow(1);
    });
    
    it('should put the new row in the correct position', function(){
      sheet.rowIds()[1].should.equal(new_row_id);
    });

    it('should move the original row over by one position', function(){
      sheet.rowIds()[2].should.equal(old_row_id);
    });

    it('should trigger an insert_row event',function(){
      events.length.should.equal(1);
      events[0].name.should.equal('insert_row');
      events[0].args[0].row_id.should.equal(new_row_id);
      events[0].args[0].sheet_id.should.equal(sheet.id);
    });
  });

  describe('detele rows', function(){
    var row_id, col_id, cell_id;

    before(function(){
      initializeSheet();
      row_id = sheet.rowIds()[0];
      col_id = sheet.colIds()[0];
      cell_id = sheet.updateCell(row_id,col_id,5);
      clearEvents(); 
      sheet.deleteRow(row_id);
    });

    it('should remove a single row', function(){
      sheet.rowIds()[0].should.not.equal(row_id);
    });

    it('should remove the deleted row\'s cells', function(){
      expect(sheet.getValue(row_id,col_id)).to.equal('')
      expect(sheet.getRawValue(row_id,col_id)).to.be.undefined;
    });
    
    it('should trigger a delete row event',function(){
      events.length.should.equal(1);
      events[0].name.should.equal('delete_row');
      events[0].args[0].row_id.should.equal(row_id);
      events[0].args[0].sheet_id.should.equal(sheet.id);
    });
  });

  describe('insert column', function(){
    var second_col_id, new_row_id, new_col_id;
    
    before(function(){
      initializeSheet();
      second_col_id = sheet.colIds()[1];
      new_col_id = sheet.insertCol(1);
    });

    it('should put the col in the correct position', function(){
      sheet.colIds()[1].should.equal(new_col_id);
    });

    it('should move the original call over one position', function(){
      sheet.colIds()[2].should.equal(second_col_id);
    });

    it('should trigger an insert column event',function(){
      events.length.should.equal(1);
      events[0].name.should.equal('insert_col');
      events[0].args[0].col_id.should.equal(new_col_id);
      events[0].args[0].sheet_id.should.equal(sheet.id);
    });
  });

  describe('detele column', function(){
    var row_id, col_id, cell_id;

    before(function(){
      initializeSheet();
      row_id = sheet.rowIds()[0];
      col_id = sheet.colIds()[0];
      cell_id = sheet.updateCell(row_id,col_id,5);
      clearEvents(); 
      sheet.deleteCol(col_id);
    });

    it('should remove a single column', function(){
      sheet.colIds()[0].should.not.equal(col_id);
    });

    it('should remove the deleted column\'s cells', function(){
      expect(sheet.getValue(row_id,col_id)).to.equal('');
      expect(sheet.getRawValue(row_id,col_id)).to.be.undefined;
    });
    
    it('should trigger a delete column event',function(){
      events.length.should.equal(1);
      events[0].name.should.equal('delete_col');
      events[0].args[0].col_id.should.equal(col_id);
      events[0].args[0].sheet_id.should.equal(sheet.id);
    });
  });

});

});
