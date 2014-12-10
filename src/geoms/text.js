function Text(spec) {
  if(!(this instanceof Geom)){
    return new Text(spec);
  }
  Point.apply(this);
  var attributes = {
    name: "text",
    geom: 'text', 
  };

  this.attributes = _.merge(this.attributes, attributes);

  for(var attr in this.attributes){
    // if((!this[attr] && this.attributes.hasOwnProperty(attr))){
      this[attr] = createAccessor(attr);
    // }
  }
}
Text.prototype = new Point();

Text.prototype.constructor = Text;

Text.prototype.draw = function (sel, data, i, layerNum) {

  var s     = this.setup(),
      scales = this.scalesAxes(sel, s, data.selector, layerNum,
                               this.drawX(), this.drawY());


  var positionX = this.positionPoint(scales.x, s.grouped),
      positionY = this.positionPoint(scales.y, s.grouped);

  ggd3.tools.removeElements(sel, layerNum, "geom-text");

  function drawText(text) {
    text
      .attr('class', 'geom g' + layerNum + " geom-text")
      .text(function(d) { return d[s.aes.label]; })
      .attr('x', positionX)
      .attr('y', positionY)
      .style('font-size', s.size)
      .attr('fill-opacity', s.alpha)
      .style('stroke', s.color)
      .style('stroke-width', 1)
      .attr('text-anchor', 'middle')
      .attr('fill', s.fill);
  }

  var tt = ggd3.tooltip()
            .content(this.tooltip())
            .geom(this);

  var text = sel.select('.plot')
                .selectAll('text.geom.g' + layerNum)
                .data(data.data);
  text.transition().call(drawText);
  text.enter().append('text').call(drawText);
  text.exit()
    .transition()
    .style('opacity', 0)
    .remove();
  text.each(function() {
      tt.tooltip(d3.select(this), s);
    });
};

ggd3.geoms.text = Text;
