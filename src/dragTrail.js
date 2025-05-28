// DragTrailPlugin: Allows dragging a point on a Chart.js chart and draws a trail of its movement

const dragTrailPlugin = {
  id: 'dragTrail', // Unique plugin ID

  // Called before the chart is initialized
  // Sets up the drag state and mouse event listeners
  beforeInit(chart) {
    // Store the dragging state, the currently dragged point, and the trail points
    chart.dragState = {
      dragging: false,        // True while a point is being dragged
      draggedPoint: null,     // Reference to the currently dragged point
      trailPoints: [],        // Array of points representing the drag trail
    };

    const canvas = chart.canvas;

    // Listen for mouse down to start dragging a point if one is near the cursor
    canvas.addEventListener('mousedown', (e) => {
      const { x, y } = getRelativePosition(e, chart);
      const point = getNearestPoint(chart, x, y);

      if (point) {
        chart.dragState.dragging = true;      // Enable dragging mode
        chart.dragState.draggedPoint = point; // Store the dragged point reference
      }
    });

    // Listen for mouse move to update the dragged point's position and add to the trail
    canvas.addEventListener('mousemove', (e) => {
      if (!chart.dragState.dragging) return; // Only update if dragging

      const { x, y } = getRelativePosition(e, chart);
      const xValue = chart.scales.x.getValueForPixel(x);
      const yValue = chart.scales.y.getValueForPixel(y);

      const point = chart.dragState.draggedPoint;
      // Update the raw data of the dragged point
      point.raw.x = xValue;
      point.raw.y = yValue;

      // Add the new position to the trail
      chart.dragState.trailPoints.push({ x: xValue, y: yValue });

      chart.update('none'); // Update chart without animation
    });

    // Listen for mouse up to stop dragging
    canvas.addEventListener('mouseup', () => {
      chart.dragState.dragging = false;
      chart.dragState.draggedPoint = null;
    });
  },

  // Called before datasets are drawn
  // Draws the trail points on the chart canvas
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const { ctx } = chart;
    const { trailPoints } = chart.dragState;

    ctx.save(); // Save the current canvas state

    // Get style options from pluginOptions or use defaults
    const fillColor = pluginOptions?.trailFillColor || '#c7c7c7';
    const borderColor = pluginOptions?.trailBorderColor || '#9c9c9c';
    const borderWidth = pluginOptions?.trailBorderWidth || 1;
    const radius = pluginOptions?.trailRadius || 3;

    // Draw each point in the trail as a circle
    trailPoints.forEach((pt) => {
      const x = chart.scales.x.getPixelForValue(pt.x);
      const y = chart.scales.y.getPixelForValue(pt.y);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    });

    ctx.restore(); // Restore the canvas state
  },

  // Utility function to clear the trail programmatically
  clearTrail(chart) {
    if (chart.dragState) {
      chart.dragState.trailPoints = []; // Remove all trail points
      chart.update(); // Redraw the chart
    }
  },
};

// Helper function to get mouse position relative to the chart canvas
// Returns an object with x and y properties in pixel coordinates
function getRelativePosition(e, chart) {
  const rect = chart.canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// Helper function to find the nearest chart point to the mouse position
// Returns an object with datasetIndex, index, and raw data reference if found, otherwise null
function getNearestPoint(chart, x, y) {
  const radius = 10; // Pixel radius to consider a point "near"
  for (
    let datasetIndex = 0;
    datasetIndex < chart.data.datasets.length;
    datasetIndex++
  ) {
    const meta = chart.getDatasetMeta(datasetIndex);
    for (let i = 0; i < meta.data.length; i++) {
      const point = meta.data[i];
      const dx = point.x - x;
      const dy = point.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < radius) {
        return {
          datasetIndex,
          index: i,
          raw: chart.data.datasets[datasetIndex].data[i],
        };
      }
    }
  }
  return null;
}

export default dragTrailPlugin;