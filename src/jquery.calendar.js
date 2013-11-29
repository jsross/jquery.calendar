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
		headerFormat: "MMMM YYYY",
		headerYearFormat: "YYYY"
	},
	
	_monthView: "monthView",
	_monthSelector: "monthSelector",
 
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
		this.currentView = this._renderMonth(this.month);
		this.mainContainer.append(this.currentView);
		this.mainContainer.height(this.currentView.outerHeight());
		this.viewState = this._monthView;
		
		this.currentView.show();
	},
	
	previousMonth: function() {
		this.month.subtract(1,"month");
		var $monthView = this._renderMonth(this.month);

		this._setHeaderText(this.month.format(this.options.headerFormat));
		this._swapMainContainerView($monthView, "backwards");
	},
	
	nextMonth: function() {
		this.month.add(1,"month");
		var $monthView = this._renderMonth(this.month);
		
		this._setHeaderText(this.month.format(this.options.headerFormat));
		this._swapMainContainerView($monthView, "forwards");
	},
	
	getSelectedDate: function () {
		return this.currentView.monthView('getSelectedDate');
	},
	
	_setHeaderText: function(text) {
		this.controls.find(".header-button").html(text);
	},
	
	_renderControls: function(renderMoment){
		var $previousButton = $("<a>").attr("href","#")
					      .html(this.options.previousButtonText)
					      .click($.proxy(this._handlePreviousButtonClick,this));
		
		var $nextButton = $("<a>").attr("href","#")
					  .html(this.options.nextButtonText)
					  .click($.proxy(this._handleNextButtonClick,this));
		
		var $headerButton = $("<a>").attr("href","#")
					    .addClass("header-button")
					    .html(renderMoment.format(this.options.headerFormat))
					    .click($.proxy(this._handleHeaderButtonClick,this));
					
		var $header = $("<div>").addClass("header").append($headerButton);

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
	
	_renderMonthSelector: function(date) {
		return $("<div>").monthSelector({
						year: date,
						monthSelected: $.proxy(this._handleMonthSelected,this)
					    }).css("position","absolute")
					      .css("width","100%")
					      .css("height","100%")
					      .hide();
	},
	
	_handleHeaderButtonClick: function(event) {
		event.preventDefault();
		
		if(this.viewState == this._monthView) {
			var $selectorView = this._renderMonthSelector(this.month.toDate());
			this.viewState = this._monthSelector;
			this._setHeaderText(this.month.format(this.options.headerYearFormat));
			this._swapMainContainerView($selectorView, "down");
		}
	},
	
	_handleMonthSelected: function(event, data) {
		var $monthView = this._renderMonth(moment(data));
		this.month = moment(data);
		var headerText = this.month.format(this.options.headerFormat);
		this._setHeaderText(headerText);
				    
		this._swapMainContainerView($monthView, "up");
		this.viewState = this._monthView;
	},
	
	_handlePreviousButtonClick: function(event) {
		event.preventDefault();
		
		if(this.viewState == this._monthView) {
			this.previousMonth();
		}
	},
	
	_handleNextButtonClick: function(event) {
		event.preventDefault();
		
		if(this.viewState == this._monthView) {
			this.nextMonth();
		}
	},
	
	_handleMonthViewSelectionChange: function(event, data) {
		this._trigger("selectionChanged",event,data);
	},
	
	_swapMainContainerView: function($newSlide, direction) {
		this.currentView = $newSlide;
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