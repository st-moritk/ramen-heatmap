self.addEventListener("message", (event) => {
  const { positions, bbox, gridSize = { x: 10, y: 10 } } = event.data;
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const width = maxLon - minLon;
  const height = maxLat - minLat;
  const cellWidth = width / gridSize.x;
  const cellHeight = height / gridSize.y;

  const densityMap = [];
  for (let gx = 0; gx < gridSize.x; gx++) {
    for (let gy = 0; gy < gridSize.y; gy++) {
      const cellMinLon = minLon + gx * cellWidth;
      const cellMinLat = minLat + gy * cellHeight;
      let count = 0;
      for (const [lon, lat] of positions) {
        if (
          lon >= cellMinLon &&
          lon < cellMinLon + cellWidth &&
          lat >= cellMinLat &&
          lat < cellMinLat + cellHeight
        ) {
          count++;
        }
      }
      if (count > 0) {
        densityMap.push({
          position: [cellMinLon + cellWidth / 2, cellMinLat + cellHeight / 2],
          density: count,
        });
      }
    }
  }

  postMessage(densityMap);
});
