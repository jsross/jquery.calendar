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
$.widget( "jsr.monthView", {
		 
	// Default options.
	options: {
		date: null,
		currentDate: null,
		headerDayFormat: "ddd",
		showDayNames: true,
		dataFormat: "YYYY-MM-DD",
		dayFormat: "D",
		staticRowCount: false
	},
 
	_create: function() {
		this.element.addClass( "month-view" );
		
		if(!(this.options.currentDate instanceof Date) ) {
			this.options.currentDate = new Date();
		}
		
		var currentDay = this.options.currentDate;
		
		if(!(this.options.date instanceof Date) ) {
			this.options.date = new Date();
		}
		
		this.options.date = moment(this.options.date).startOf("month");
		
		var $monthView = this._renderMonth(moment(this.options.date));
		
		this.element.append($monthView);
	},
	
	changeSelection: function(date) {
		this.element.find(".selected").removeClass("selected");	
		var dayCell = this.getDayCell(date);
		
		dayCell.addClass("selected");
	},
	
	getDayCell: function(date) {
		var dataFormated = moment(date).format(this.options.dataFormat);
		var cell = this.element.find("[data-date='" + dataFormated + "']").first();
		
		return cell;
	},
	
	getSelectedDate: function() {
		var $selected = this.element.find(".selected").first();
		if($selected.length == 0)
			return null;
		var dataDate = $selected.attr("data-date");
		var selectedDate = moment(dataDate,this.options.dataFormat).toDate();
		
		return selectedDate;
	},
	
	getSelectedCell: function() {
		var $selected = this.element.find(".selected").first();
		
		if($selected.length == 0)
			return null;
		
		return $selected;
	},
	
	_handleDayClick: function(event) {
		event.preventDefault();
		
		var $triggered = $(event.target);
		var $parentCell = $triggered.parent();
		var $currentSelection = this.getSelectedCell();
		
		if($currentSelection != null && $parentCell[0] == $currentSelection[0]){
			$currentSelection.removeClass("selected");
			this._trigger("selectionChanged", event);
			
			return;
		}

		this.element.find(".selected").removeClass("selected");
		$parentCell.addClass("selected");
		var selectedDate = moment($parentCell.attr("data-date"),this.options.dataFormat).toDate();
		
		this._trigger("selectionChanged", event, selectedDate);
	},
	
	_renderMonth: function(renderMonth) {
		var $monthView = $("<table/>");
		
		if (this.options.showDayNames) {
			$monthView.append(this._renderDayHeaders());
		}
		
		var currentRow = $('<tr/>');
		$monthView.append(currentRow);
		
		var currentDay = moment(renderMonth).startOf("week");
		
		if(this.options.staticRowCount) {
			if(currentDay.isSame(renderMonth)) {
				currentDay.subtract('days', 7);
			}
			
			var endDay = moment(currentDay).add('days',42);
		}
		else {
			var endDay = moment(renderMonth).endOf("month").endOf("week");
		}

		while(currentDay.isBefore(endDay)) {
			if(currentRow.children().length == 7) {
				currentRow = $('<tr/>');
				$monthView.append(currentRow);
			}
			
			var dayCell = $("<td/>").attr("data-date", currentDay.format(this.options.dataFormat));
			
			if ( currentDay.isSame(moment(this.options.currentDate),"day")) {
				dayCell.addClass("today");
			}
			
			if(currentDay.month() < renderMonth.month()) {
				dayCell.addClass("previous-month");
			}
			else if (currentDay.month() == renderMonth.month()) {
				dayCell.addClass("current-month");
			}
			else {
				dayCell.addClass("next-month");
			}
			
			dayCell.append(this._renderDayLink(currentDay));
			currentRow.append(dayCell);
			
			currentDay.add("days",1);
		}
		
		return $monthView;
	},
	
	_renderDayHeaders: function() {
		var $tableHeader = $("<thead/>");
		var $headerRow = $('<tr/>');
		$tableHeader.append($headerRow);	
		
		var currentDate = moment(new Date()).startOf("week");

		for (var i = 0; i < 7; i++) {
			var $dayHeader = $('<th/>');					
			$dayHeader.html(currentDate.format(this.options.headerDayFormat));
			$headerRow.append($dayHeader);
			
			currentDate.add('days', 1);
		}
		
		return $tableHeader;
	},
	
	_renderDayLink: function(date) {
		var $dayLink = $('<a/>').attr("href","#")
					.html(date.format(this.options.dayFormat));
					
		var $widget = this;
		
		$dayLink.click($.proxy(this._handleDayClick,this));
		
		return $dayLink;
	}
});