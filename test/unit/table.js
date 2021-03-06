if (typeof define !== 'function') { var define = require('amdefine')(module) }
define(function (require) {

var expect = require('chai').expect;
var should = require('chai').should();
var $ = require('jquery');

var Sheet = require('es_client/models/sheet');
var TableView = require('es_client/views/table');
var ES = require('es_client/config');

// setup dom attachment point
var $container = $('<div id="ethersheet-container" style="display:none;"></div').appendTo('body');

describe('TableView', function(){

  var table, $el, sheet;

  var initializeTable = function(){
    $container.empty()
    $el = $('<div id="ethersheet"></div>').appendTo($container);
    sheet = new Sheet();
    table = new TableView({
      el: $el,
      sheet: sheet
    });
    table.render();
  }

  describe('by default, it should create a blank 20x100 table display', function(){
    before(function(){
      initializeTable();
    });

    it('should render a table', function(){
      $('#ethersheet table').length.should.not.be.empty;
    });

    it('should have the right number of cells', function(){
      var expected_cell_count = ES.DEFAULT_ROW_COUNT * ES.DEFAULT_COL_COUNT;
      $('#ethersheet .es-table-cell').length.should.equal(expected_cell_count);
    });

    it('should have the right number of rows', function(){
      $('#ethersheet .es-table-row').length.should.equal(ES.DEFAULT_ROW_COUNT);
    });

    it('should have the right column headers', function(){
      $('#ethersheet .column-header').length.should.equal(ES.DEFAULT_COL_COUNT);
      $("#ethersheet .column-header").last().text().should.equal('T');
    });

    it('should have the right row headers', function(){
      $('#ethersheet .row-header').length.should.equal(ES.DEFAULT_ROW_COUNT)
      $("#ethersheet .row-header").last().text().should.equal('100');
    });
    it('should have empty cells', function(){
      $('td',$el).each(function(){
        $(this).text().should.equal('');
      });
    });
  });
  
  describe('should respond to sheet events', function(){
    var row_id, col_id, value;

    beforeEach(function(){
      initializeTable();
      value = 5;
      row_id = sheet.rowAt(0);
      col_id = sheet.colAt(0);
    });
    describe('on update cell', function(){
      it('should draw a cell when we update the sheet\'s cell value',function(){
        sheet.updateCell(row_id,col_id,value);
        $('.es-table-cell',$el).first().text().should.equal(value.toString()); 
      });
    }); 
    describe('on insert_col', function(){
      it('should draw a new column', function(){
        var original_col_count = $('.es-table-row',$el)
                              .first()
                              .find('.es-table-cell')
                              .length;
        sheet.insertCol(0);
        var new_col_count = $('.es-table-row',$el)
                              .first()
                              .find('.es-table-cell')
                              .length;
        new_col_count.should.equal(original_col_count + 1);
      });

      it('should draw values in correct location', function(){
        sheet.updateCell(row_id,col_id,value);
        sheet.insertCol(0);
        
        $('.es-table-cell',$el)
        .eq(0)
        .text()
        .should.equal(''); 
        
        $('.es-table-cell',$el)
        .eq(1)
        .text()
        .should.equal(value.toString()); 
      });
    });
    describe('on delete_col', function(){
      it('should remove a column', function(){
        var original_col_count = $('.es-table-row',$el)
                              .first()
                              .find('.es-table-cell')
                              .length;
        sheet.deleteCol(sheet.colAt(0));
        var new_col_count = $('.es-table-row',$el)
                              .first()
                              .find('.es-table-cell')
                              .length;
        new_col_count.should.equal(original_col_count - 1);
      });

      it('should draw values in correct location', function(){
        row_id = sheet.rowAt(0);
        col_id = sheet.colAt(1);
        sheet.updateCell(row_id,col_id,value);
        sheet.deleteCol(sheet.colAt(0));
        
        $('.es-table-cell',$el)
        .eq(0)
        .text()
        .should.equal(value.toString()); 
        
        $('.es-table-cell',$el)
        .eq(1)
        .text()
        .should.equal(''); 
      });
    });
    describe('on insert_row', function(){
      it('should draw a new row', function(){
        var original_row_count = $('.es-table-row',$el)
                              .length;
        sheet.insertRow(0);
        var new_row_count = $('.es-table-row',$el)
                              .length;
        new_row_count.should.equal(original_row_count + 1);
      });

      it('should draw values in correct location', function(){
        sheet.updateCell(row_id,col_id,value);
        sheet.insertRow(0);
        
        $('.es-table-cell',$el)
        .eq(0)
        .text()
        .should.equal(''); 
        
        $('.es-table-row',$el)
        .eq(1)
        .find('.es-table-cell')
        .eq(0)
        .text()
        .should.equal(value.toString()); 
      });
    });
    
    describe('on delete_row', function(){
      it('should draw a new row', function(){
        var original_row_count = $('.es-table-row',$el)
                              .length;
        sheet.deleteRow(sheet.rowAt(0));
        var new_row_count = $('.es-table-row',$el)
                              .length;
        new_row_count.should.equal(original_row_count - 1);
      });

      it('should draw values in correct location', function(){
        row_id = sheet.rowAt(1);
        col_id = sheet.colAt(0);
        sheet.updateCell(row_id,col_id,value);
        sheet.deleteRow(sheet.rowAt(0));
        
        $('.es-table-cell',$el)
        .eq(0)
        .text()
        .should.equal(value.toString()); 
        
        $('.es-table-row',$el)
        .eq(1)
        .find('.es-table-cell')
        .eq(0)
        .text()
        .should.equal(''); 
      });
    });


  });
});

});
