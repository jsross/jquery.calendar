/*
Copyright (c) 2013 James Ross

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
$.widget( "jsr.yearSelector", {
		 
	// Default options.
	options: {
		yearFormat: "YYYY",
		startYear: new Date(new Date().getFullYear(), 0, 1),
		count: 25,
		rowCount: 5,
		currentDate: null,
	},
	
	_dataFormat: "YYYY-MM-DD",
 
	_create: function() {
		this.element.addClass( "year-selector" );
		
		this.startYear = new Date(this.options.startYear.getFullYear(), 0, 1);
		
		var selector = this._renderSelector(this.startYear);
		this.element.append(selector);
	},
	
	_renderSelector: function(date) {
		var $table = $("<table/>");
		var currentRow = $('<tr/>');
		
		$table.append(currentRow);
		
		var currentMonth = moment(date);
		var index = 0;
		
		for(;index < this.options.count; index++) {
			if(index > 0 && index % this.options.rowCount == 0) {
				var currentRow = $('<tr/>');
				$table.append(currentRow);
			}
			
			var clickableArea = $("<a>").attr("href","#")
						    .attr("data-date", currentMonth.format(this._dataFormat))
					            .html(currentMonth.format(this.options.yearFormat))
					            .click($.proxy(this._handleMonthClick,this));
			
			currentRow.append($("<td>").append(clickableArea));
			currentMonth = currentMonth.add("y",1);
		}
		
		return $table;
	},
	
	_handleMonthClick: function(event) {
		event.preventDefault();
		var selectedDate = moment($(event.target).attr("data-date"),this._dataFormat).toDate();
		this._trigger("yearSelected", event, selectedDate);
	}
});