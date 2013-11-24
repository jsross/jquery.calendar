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
$.widget( "jsr.monthSelector", {
		 
	// Default options.
	options: {
		monthFormat: "MMM",
		year: null,
		currentDate: null,
		dataFormat: "YYYY-MM-DD"
	},
 
	_create: function() {
		this.element.addClass( "month-selector" );

		if(!(this.options.year instanceof Date) ) {
			this.options.year = new Date();
		}
		
		this.options.year = new Date(this.options.year.getFullYear(), 0, 1);
		
		if(!(this.options.currentDate instanceof Date) ) {
			this.options.currentDate = new Date();
		}
		
		var selector = this._renderSelector(this.options.year);
		this.element.append(selector);
	},
	
	_renderSelector: function(date) {
		var $monthTable = $("<table/>");
		var currentRow = $('<tr/>');
		
		$monthTable.append(currentRow);
		
		var currentMonth = moment(date);
		var index = 0;
		
		for(;index < 12; index++) {
			if(index > 0 && index % 4 == 0) {
				var currentRow = $('<tr/>');
				$monthTable.append(currentRow);
			}
			
			var clickableArea = $("<a>").attr("href","#")
						    .attr("data-date", currentMonth.format(this.options.dataFormat))
					            .html(currentMonth.format(this.options.monthFormat))
					            .click($.proxy(this._handleMonthClick,this));
			
			currentRow.append($("<td>").append(clickableArea));
			currentMonth = currentMonth.add("M",1);
		}
		
		return $monthTable;
	},
	
	_handleMonthClick: function(event) {
		event.preventDefault();
		var selectedDate = moment($(event.target).attr("data-date"),this.options.dataFormat).toDate();
		this._trigger("monthSelected", event, selectedDate);
	}
});