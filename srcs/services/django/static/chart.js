/*------------------------------########## LEGEND ##########------------------------------*/

// Legend class
class Legend{

	constructor(options){
		this.options = options;
		this.canvas = options.canvas;
		this.div = options.div;
		this.data = options.data;
		this.colors = options.colors;
	}

	drawLegend() {

		let pIndex = 0;
		let legend = document.querySelector("div[for='"+this.div+"']");
		let ul = document.createElement("ul");
		legend.append(ul);
		for (let ctg of Object.keys(this.options.data)) {
			let li = document.createElement("li");
			li.classList.add("text-light");
			li.style.listStyle = "none";
			li.style.borderLeft =
				"20px solid " + this.colors[pIndex % this.colors.length];
			li.style.padding = "5px";
			li.textContent = `${ctg}: ${this.options.data[ctg]}`;
			ul.append(li);
			pIndex++;
		}
	}
}

/*------------------------------########## PIE CHART ##########------------------------------*/

// helper JS functions
function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, fillColor, strokeColor) { // all variables for filling the pie slice with fillColor and strokeColor respectively, the color of the filling and the perimeter

	ctx.save();
	ctx.fillStyle = fillColor; // specifies the color or style to be used inside shapes
	ctx.strokeStyle = strokeColor;
	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.arc(centerX, centerY, radius, startAngle, endAngle, strokeColor);
	ctx.closePath(); // returns the pen to the starting point of the current sub-section
	ctx.fill(); // fills the current or given path with the current background color
	ctx.restore();
}

// Pie chart class
class PieChart { // call a class to create objects

	constructor(options){ // call the class constructor

		this.options = options;
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.colors = options.colors; // retrieves color options
		this.totalValue = [...Object.values(this.options.data)].reduce((a, b) => a + b, 0);
		this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2) - options.padding; // determines the radius of the graph
	}

	drawSlices(){ // method responsible for drawing the slices of the circular graph

		var colorIndex = 0;
		var startAngle = -Math.PI / 2;
		for (var categ in this.options.data) {
			var val = this.options.data[categ]; // retrieves the value associated with the current category
			var sliceAngle = (2 * Math.PI * val) / this.totalValue; // calculates the slice angle for each category
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				this.radius,
				startAngle,
				startAngle + sliceAngle,
				this.colors[colorIndex % this.colors.length]
			);
			startAngle += sliceAngle; // updates the starting angle for the next slice
			colorIndex++; // increments the color index for the next slice
		}
	}

	draw(){

		this.drawSlices();
	}
}

/*------------------------------########## BAR CHART ##########------------------------------*/

// helper JS functions
function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color){ //width is the bar's width and height its height

	ctx.save();
	ctx.fillStyle = color;
	ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height); //draws a solid rectangle with coordinates (x, y), dimensions determined by width and height and style determined by the fillStyle attribute
	ctx.restore();
}

// Bar chart class
class BarChart {

	constructor(options) {

		this.options = options;
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.colors = options.colors;
		this.maxValue = Math.max(...Object.values(this.options.data));
	}

	drawBars() {

		var canvasActualHeight = this.canvas.height - this.options.padding * 2;
		var canvasActualWidth = this.canvas.width - this.options.padding * 2;
		var barIndex = 0;
		var numberOfBars = Object.keys(this.options.data).length; // number of bars to draw
		var barSize = canvasActualWidth / numberOfBars; //calculates the size of each bar according to the available width
		var values = Object.values(this.options.data);
		for (let val of values) { //loop to draw each bar
			var barHeight = Math.round((canvasActualHeight * val) / this.maxValue); // calculates bar heights according to the value of the data passed as arguments to the
			drawBar(
				this.ctx,
				this.options.padding + barIndex * barSize, // bar position x
				this.canvas.height - barHeight - this.options.padding, //y position of the bar
				barSize, // bar width
				barHeight, // bar height
				this.colors[barIndex % this.colors.length]
			);
			barIndex++;
		}
	}

	draw() {

		this.drawBars();
	}
}

/*------------------------------########## PLOT CHART ##########------------------------------*/

// helper JS functions
function drawPlotLine(ctx, lineWidth, startX, startY, endX, endY, color){

	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX,endY);
	ctx.stroke();
	ctx.restore();
}

// Plot chart class
class PlotChart{

	constructor(options){
		this.options = options;
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.colors = options.colors;
		this.maxValue = Math.max(...Object.values(this.options.data));
	}

	drawPlots(){

		var canvasActualHeight = this.canvas.height - this.options.padding * 2;
		var canvasActualWidth = this.canvas.width - this.options.padding * 2;
		var oldPointX = 0 + this.options.padding; // keep the X coordinate of the previous point as the starting point for the current point
		var oldPointY = this.canvas.height - this.options.padding; //keep the Y coordinate of the previous point as the starting point for the current point
		var pointIndex = 0.5;
		var colorIndex = 0; // each data item will have its own color
		var numberOfPoints = Object.keys(this.options.data).length;
		var emptySpaceSize = canvasActualWidth / numberOfPoints; //horizontal distance between each point
		var values = Object.values(this.options.data);
		for (let val of values) { //loop to draw each bar
			var pointX = this.options.padding + (emptySpaceSize * pointIndex);
			var pointY = Math.round(canvasActualHeight - (canvasActualHeight * val) / this.maxValue);
			drawPlotLine(
				this.ctx,
				this.options.linePlotWidth, //width of the line separating each point
				oldPointX,
				oldPointY,
				pointX,
				pointY,
				this.colors[colorIndex % this.colors.length]
			);
			oldPointX = pointX;
			oldPointY = pointY;
			pointIndex = pointIndex + 0.5;
			colorIndex++;
		}
	}

	draw() {

		this.drawPlots();
	}
}
