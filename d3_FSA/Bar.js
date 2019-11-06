// create the svg

  var  bmargin = {top: 50, right: 250, bottom: 50, left: 50};
  var  bwidth = 1300 - bmargin.left - bmargin.right;
  var  bheight = 350 - bmargin.top - bmargin.bottom;

// set x scale
var bx = d3.scaleBand()
    .rangeRound([0, bwidth])
    .paddingInner(0.05)
    .align(0.1);

// set y scale
var by_scale = d3.scaleLinear()
    .range([bheight, 0]);

// set the colors
var bz = d3.scaleOrdinal()
    //.range(["#400b15", "#0FbFbF", "#F22E2E"]);
    .range(["#85A6A6", "#0FBFBF", "#D697FF"]);

// load the csv and create the chart
var bdata = d3.csv("PortfolioSummary.csv");
bdata.then(function(bdata){
  bdata.forEach(function(d){
  d.Direct = +d.Direct;
  d.FFEL= +d.FFEL;
  d.Perkins = +d.Perkins
})

//Define the div for the tooltip
var div = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

/// Create SVG Element
var bsvg  =   d3.select( '#BChart' )
      .append( 'svg' )
      .attr( 'width',bwidth + bmargin.left + bmargin.right)
      .attr( 'height',bheight + bmargin.top + bmargin.bottom);

var bgroups = bsvg.append("g")
    .attr("transform", "translate(" + 100 + "," + bmargin.top + ")");

var bkeys = bdata.columns.slice(1);

  bdata.sort(function(a, b) { return b.total - a.total; });

  var bmaxY = d3.max(bdata, function(d){
    return d.Direct+
           d.FFEL +
           d.Perkins ;
  });

  bx.domain(bdata.map(function(d) { return d.Year; }));
  by_scale.domain([0, bmaxY]);
  bz.domain(bkeys);

  bgroups.append("g")
      .selectAll("g")
      .data(d3.stack().keys(bkeys)(bdata))
      .enter().append("g")
      .attr("fill", function(d) { return bz(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return bx(d.data.Year); })
      .attr("y", function(d) { return by_scale(d[1]); })
      .attr("height", function(d) {
        return by_scale(d[0]) - by_scale(d[1]); })
      .attr("width", bx.bandwidth())
      .on('mouseover', d => {
        div
          .transition()
          .duration(200)
          .style('opacity', 0.9)
        div
          .html(d.data.Year + '<br/>' + d.bdata)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', ()=> {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
      });


  bgroups.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + bheight + ")")
      .call(d3.axisBottom(bx))
      .selectAll("text")
      .style("text-anchor", 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr("transform", 'rotate(-55)');


  bgroups.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(by_scale).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", by_scale(by_scale.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");


  var blegend = bgroups.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "front")
      .selectAll("g")
      .data(bkeys.slice())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  blegend.append("rect")
      .attr("x", bwidth + 10)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", bz);

  blegend.append("text")
      .attr("x", bwidth + 35)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

   });
