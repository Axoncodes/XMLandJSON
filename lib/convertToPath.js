function convertAllToPath(data) {
  /**
   * @param {json} data
   * @returns You can convert all specific svg tags such as rect or poligon and etc to PATH tag
   */
  console.log('convertAllToPath');
  if(!data || data.length==0) throw 'invalid input in convertAllToPath'
  if(typeof data == 'string') data = JSON.parse(data);
  const unifiedSvg = data.map(tagData => {
    const attrs = tagData.attributes;
    const classAttr = tagData.attributes && tagData.attributes.class?tagData.attributes.class:null;
    const idAttr = tagData.attributes && tagData.attributes.id?tagData.attributes.id:null;
    tagData.attributes = {};
    if (tagData.tag == "rect") {
      tagData.attributes.d = svgShapesToPathRectToPath(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "polyline") {
      tagData.attributes.d = svgShapesToPathPolylineToPath(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "line") {
      tagData.attributes.d = svgShapesToPathLineToPath(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "circle") {
      tagData.attributes.d = svgShapesToPathCircleToPath(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "polygon") {
      tagData.attributes.d = svgShapesToPathPolygonToPath(attrs);
      tagData.tag = "path";
    } else tagData.attributes = attrs;

    tagData.attributes = {class: classAttr, id: idAttr, ...tagData.attributes}
    return tagData;
  });

  return JSON.stringify(unifiedSvg);
}
 
 
function svgShapesToPathRectToPath(attributes) {
  if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathRectToPath'
  const x = 'undefined' !== typeof attributes.x ? parseFloat(attributes.x) : 0;
  const y = 'undefined' !== typeof attributes.y ? parseFloat(attributes.y) : 0;
  const width =
    'undefined' !== typeof attributes.width ? parseFloat(attributes.width) : 0;
  const height =
    'undefined' !== typeof attributes.height
      ? parseFloat(attributes.height)
      : 0;
  const rx =
    'undefined' !== typeof attributes.rx
      ? parseFloat(attributes.rx)
      : 'undefined' !== typeof attributes.ry
      ? parseFloat(attributes.ry)
      : 0;
  const ry =
    'undefined' !== typeof attributes.ry ? parseFloat(attributes.ry) : rx;

  return (
    '' +
    // start at the left corner
    'M' +
    (x + rx) +
    ' ' +
    y +
    // top line
    'h' +
    (width - rx * 2) +
    // upper right corner
    (rx || ry ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry : '') +
    // Draw right side
    'v' +
    (height - ry * 2) +
    // Draw bottom right corner
    (rx || ry ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx * -1 + ' ' + ry : '') +
    // Down the down side
    'h' +
    (width - rx * 2) * -1 +
    // Draw bottom right corner
    (rx || ry
      ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx * -1 + ' ' + ry * -1
      : '') +
    // Down the left side
    'v' +
    (height - ry * 2) * -1 +
    // Draw bottom right corner
    (rx || ry ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry * -1 : '') +
    // Close path
    'z'
  );
}
 
 
function svgShapesToPathPolylineToPath(attributes) {
  if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathPolylineToPath'
  return 'M' + attributes.points;
}
   
function svgShapesToPathLineToPath(attributes) {
  if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathLineToPath'
  // Move to the line start
  return (
    '' +
    'M' +
    (parseFloat(attributes.x1) || 0).toString(10) +
    ' ' +
    (parseFloat(attributes.y1) || 0).toString(10) +
    ' ' +
    ((parseFloat(attributes.x1) || 0) + 1).toString(10) +
    ' ' +
    ((parseFloat(attributes.y1) || 0) + 1).toString(10) +
    ' ' +
    ((parseFloat(attributes.x2) || 0) + 1).toString(10) +
    ' ' +
    ((parseFloat(attributes.y2) || 0) + 1).toString(10) +
    ' ' +
    (parseFloat(attributes.x2) || 0).toString(10) +
    ' ' +
    (parseFloat(attributes.y2) || 0).toString(10) +
    'Z'
  );
}
   
function svgShapesToPathCircleToPath(attributes) {
  if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathCircleToPath'
  const cx = parseFloat(attributes.cx);
  const cy = parseFloat(attributes.cy);
  const rx =
    'undefined' !== typeof attributes.rx
      ? parseFloat(attributes.rx)
      : parseFloat(attributes.r);
  const ry =
    'undefined' !== typeof attributes.ry
      ? parseFloat(attributes.ry)
      : parseFloat(attributes.r);

  // use two A commands because one command which returns to origin is invalid
  return (
    '' +
    'M' +
    (cx - rx) +
    ',' +
    cy +
    'A' +
    rx +
    ',' +
    ry +
    ' 0,0,0 ' +
    (cx + rx) +
    ',' +
    cy +
    'A' +
    rx +
    ',' +
    ry +
    ' 0,0,0 ' +
    (cx - rx) +
    ',' +
    cy
  );
}
   
function svgShapesToPathPolygonToPath(attributes) {
  if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathPolygonToPath'
  return 'M' + attributes.points + 'Z';
}
   


module.exports = convertAllToPath;