//dropdown data
var dropdown_options = [
  {value: "current",
  text: "Current amount of loans in repayment"
},
  {value: "second",
  text: "Loans that are 31-90 days delinquent"
},
  {value: "third",
  text: "Loans that are 91-180 days delinquent"
},
  {value: "forth",
  text: "Loans that are 181-270 days delinquent"
},
  {value: "fifth",
  text: "Loans that are 271-360 days delinquent"
},
  {value: "last",
  text: "Loans that are 361 days or more delinquent"
},
]

//populate drop-down
d3.select("#dropdown")
  .selectAll("option")
  .data(dropdown_options)
  .enter()
  .append("option")
  .attr("value", function(option) { return option.value })
  .text(function(option) { return option.text });


//List of groups
//var dataset = ['current', 'second', 'third ', 'fourth', 'fifth', 'last'];

//var initial = 'current';

//setup
var choro_chart_width = window.innerWidth;
var choro_chart_height = window.innerHeight;
var choro_color = d3.scaleQuantize().range([
'rgb(238,217,147)',
'rgb(237,204,136)','rgb(235,192,125)',
'rgb(232,180,115)','rgb(229,165,102)',
'rgb(226,153,92)','rgb(222,138,80)',
'rgb(217,123,68)','rgb(207,94,46)',
'rgb(199,70,29)','rgb(190,40,12)','rgb(183,0,0)']);

var formatDecimalComma = d3.format(",.2f");

var choro_div = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

//projection and path
var choro_projection = d3.geoAlbersUsa()
  .scale([choro_chart_width])
  .translate([choro_chart_width / 25 , choro_chart_height / 20]);

var choro_path = d3.geoPath(choro_projection);

//create svg
var choro_svg = d3.select('#choro_chart')
  .append('svg')
  .attr('width', '100vw')
  .attr('height', '55vw')
  .attr('viewBox', `${-choro_chart_width / 2.2} ${-choro_chart_height / 2.5}
  ${choro_chart_width} ${choro_chart_height}`);

//loads the data to state variable
var state_data = d3.csv('StatesbyDollars.csv');
  state_data.then(function(state_data){
    state_data.forEach(function(d){
      d.current = +d.current;
      d.second = +d.second;
      d.third = +d.third;
      d.fourth = +d.fourth;
      d.fifth = +d.fifth;
      d.last = +d.last;
    })
});

// selects min and max from data set and scale colors based off that
state_data.then(function(state_data){
  choro_color.domain([
    d3.min(state_data, function(d ){
        return d.current;
    }),
    d3.max(state_data, function(d){
      return d.current;
    })
  ]);

//map data
d3.json('us.json').then(function(us_data){
  us_data.features.forEach(function(us_e, us_i){
    state_data.forEach(function(s_e, s_i){
      if(us_e.properties.name !== s_e.Name){
        return null;
      }
      us_data.features[us_i].properties.current = (s_e.current);
    });
  });

//create and fill map
  choro_svg.selectAll('path')
  .data(us_data.features)
  .enter()
  .append('path')
  .attr('d', choro_path)
  .attr('fill', function(d){
    var choro_num = d.properties.current;
    return choro_num ? choro_color(choro_num) : '#ddd';
  })
  .attr('stroke', '#000')
  .attr('stroke-width', 1)
  // .on('mouseover', function(d){displayData(d)})
  // .on('mouseout', hideData())

//hoverover fill
  .on('mouseover', function(){
    d3.select(this)
      .attr('fill', '#014636')
  .on('mouseout', function(){
    d3.select(this)
      .transition()
      .duration(750)
      .attr('fill', function(d){
        var choro_num = d.properties.current;
        return choro_num ? choro_color(choro_num) : '#ddd';
      })
      })
      })
      //tooltip
        .on('mouseover', d =>{
          choro_div
              .transition()
              .duration(200)
              .style('opacity', .9);
          choro_div
              .html(d.properties.name + '<br/>' + "$" +
              formatDecimalComma(d.properties.current))
              .style('left', d3.event.pageX + 'px')
              .style('top', d3.event.pageY - 28 + 'px');
        })
        .on ('mouseout', () =>{
          choro_div.transition()
              .duration(500)
              .style('opacity', 0);
        });
//Create buttons
// d3.selectAll('#buttons button')
//   .on('click', function(){
//     var offset = projection.translate();
//     var distance = 100;
//     var direction = d3.select(this).attr('class');
//
//     if (direction == 'up'){
//       offset[1] += distance;
//     }else if (direction == 'down') {
//       offset[1] -= distance;
//     }else if (direction == 'left') {
//       offset[0] += distance;
//     }else if (direction == 'right') {
//       offset[0] -= distance;
//     }
//
//     projection.translate( offset );
//
//     svg.selectAll('path')
//       .attr('d', path);
//
//   });
});
});

// function update(selectedGroup){
//   var dataFilter = state_data.map(function(d){return {state: d.state}})
// }
