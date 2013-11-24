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
$.widget( "jsr.calendar", {
		 
	// Default options.
	options: {
		date: null,
		currentDate: null,
		headerDayFormat: "ddd",
		showDayNames: true,
		dataFormat: "YYYY-MM-DD",
		dayFormat: "D",
		previousButtonText: "Prev",
		nextButtonText: "Next",
		headerFormat: "MMMM YYYY"
	},
 
	_create: function() {
		this.element.addClass( "calendar" );
		
		if(!(this.options.currentDate instanceof Date) ) {
			this.options.currentDate = new Date();
		}
		
		var currentDay = this.options.currentDate;
		
		if(!(this.options.date instanceof Date) ) {
			this.options.date = new Date();
		}
		
		this.month = moment(this.options.date).startOf("month");
		var $controls = this._renderControls(this.month);
		
		this.controls = $controls;
		
		this.element.append($controls);
		
		this.mainContainer = $("<div>").css("position","relative")
						.css("width","100%");
											 
		this.element.append(this.mainContainer);
		this.currentMonthView = this._renderMonth(this.month);
		this.mainContainer.append(this.currentMonthView);
		this.mainContainer.height(this.currentMonthView.outerHeight());
		
		this.currentMonthView.show();
	},
	
	previousMonth: function() {
		this.month.subtract(1,"month");
		var $monthView = this._renderMonth(this.month);
		this.currentMonthView = $monthView;
		
		this.controls.find(".header").html(this.month.format(this.options.headerFormat));
		
		this._swapMainContainerView($monthView, "backwards");
	},
	
	nextMonth: function() {
		this.month.add(1,"month");
		var $monthView = this._renderMonth(this.month);
		this.currentMonthView = $monthView;
		
		this.controls.find(".header").html(this.month.format(this.options.headerFormat));
				    
		this._swapMainContainerView($monthView, "forwards");
	},
	
	getSelectedDate: function () {
		return this.currentMonthView.monthView('getSelectedDate');
	},
	
	_renderControls: function(renderMoment){
		var $previousButton = $("<a>").attr("href","#")
					      .html(this.options.previousButtonText)
					      .click($.proxy(this._handlePreviousButtonClick,this));
		
		var $nextButton = $("<a>").attr("href","#")
					  .html(this.options.nextButtonText)
					  .click($.proxy(this._handleNextButtonClick,this));
		
		$header = $("<div>").addClass("header")
				    .html(renderMoment.format(this.options.headerFormat));

		$controlsContainer = $("<div>").addClass("controls-container")
					       .append($("<div>").addClass("previous-container").append($previousButton))
					       .append($header)
					       .append($("<div>").addClass("next-container").append($nextButton));
									   
		return $controlsContainer;
	},
	
	_renderMonth: function(month) {
		return $("<div>").monthView({
						date: month.toDate(),
						staticRowCount: true,
						selectionChanged: $.proxy(this._handleMonthViewSelectionChange,this)
					    }).css("position","absolute")
					      .css("width","100%")
					      .css("height","auto")
					      .hide();
	},
	
	_handlePreviousButtonClick: function(event) {
		event.preventDefault();
		var selectedDate = this.getSelectedDate();
		this.previousMonth();
	},
	
	_handleNextButtonClick: function(event) {
		event.preventDefault();
		var selectedDate = this.getSelectedDate();
		this.nextMonth();
	},
	
	_handleMonthViewSelectionChange: function(event, data) {
		this._trigger("selectionChanged",event,data);
	},
	
	_swapMainContainerView: function($newSlide, direction) {
		var $container = this.mainContainer;
		var $oldSlide = $container.children();
		$container.append($newSlide);
		var oldHeight = $oldSlide.outerHeight();
		var newHeight = $newSlide.outerHeight();

		if(newHeight > oldHeight) {
			$container.animate({height:newHeight},200);
		}
		
		var hideDirection = 'none';
		var showDirection = 'none';
		
		switch(direction) {
			case "forwards":
				hideDirection = "left";
				showDirection = "right";
			break;
			case "backwards":
				hideDirection = "right";
				showDirection = "left";
			break;
			case "down":
				hideDirection = "down";
				showDirection = "up";
			break;
			case "up":
				hideDirection = "up";
				showDirection = "down";
			break;
		}
		
		$oldSlide.hide('slide', {direction: hideDirection}, 1000, function(){$oldSlide.remove()});
		$newSlide.show('slide', {direction: showDirection}, 1000, function(){
									if(newHeight < oldHeight) {
										$container.animate({height:newHeight},200);
									}																			 
								    });
	}
});