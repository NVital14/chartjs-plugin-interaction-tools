// TrailPlugin: Allows drawing a "trail" of points on a Chart.js chart by clicking and dragging on the canvas

const TrailPlugin = {
  id: 'Trail', // Unique plugin ID

  // Called before the chart is initialized
  // Sets up the trail state and mouse event listeners
  beforeInit(chart) {
    // Store the drawing state and the list of trail points on the chart instance
    chart.trailState = {
      drawing: false,      // True while the mouse is pressed and moving
      trailPoints: [],     // Array of points in the trail
    };

    const canvas = chart.canvas;

    // Listen for mouse down to start a new trail
    canvas.addEventListener('mousedown', (e) => {
      chart.trailState.drawing = true;
      chart.trailState.trailPoints = []; // Clear any previous trail
      const { x, y } = getRelativePosition(e, chart); // Get mouse position relative to canvas
      // Convert pixel position to chart data values
      const xValue = chart.scales.x.getValueForPixel(x);
      const yValue = chart.scales.y.getValueForPixel(y);
      // Add the starting point to the trail
      chart.trailState.trailPoints.push({ x: xValue, y: yValue });
      chart.update('none'); // Update chart without animation
    });

    // Listen for mouse move to add points to the trail while drawing
    canvas.addEventListener('mousemove', (e) => {
      if (!chart.trailState.drawing) return; // Only add points if drawing
      const { x, y } = getRelativePosition(e, chart);
      const xValue = chart.scales.x.getValueForPixel(x);
      const yValue = chart.scales.y.getValueForPixel(y);
      chart.trailState.trailPoints.push({ x: xValue, y: yValue });
      chart.update('none');
    });

    // Listen for mouse up to stop drawing the trail
    canvas.addEventListener('mouseup', () => {
      chart.trailState.drawing = false;
    });
  },

  // Called before datasets are drawn
  // Draws the trail points and connecting lines on the chart canvas
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const { ctx } = chart;
    const { trailPoints } = chart.trailState;

    // If there are no points, do nothing
    if (!trailPoints || trailPoints.length === 0) return;

    ctx.save(); // Save the current canvas state

    // Get style options from pluginOptions or use defaults
    const fillColor = pluginOptions?.trailFillColor || '#c7c7c7';
    const borderColor = pluginOptions?.trailBorderColor || '#9c9c9c';
    const borderWidth = pluginOptions?.trailBorderWidth || 1;
    const radius = pluginOptions?.trailRadius || 3;

    // Draw each point in the trail as a circle
    trailPoints.forEach((pt) => {
      // Convert chart data values back to pixel positions
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

    // Draw a line connecting all the trail points
    if (trailPoints.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < trailPoints.length; i++) {
        const x = chart.scales.x.getPixelForValue(trailPoints[i].x);
        const y = chart.scales.y.getPixelForValue(trailPoints[i].y);
        if (i === 0) {
          ctx.moveTo(x, y); // Move to the first point
        } else {
          ctx.lineTo(x, y); // Draw line to next point
        }
      }
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    ctx.restore(); // Restore the canvas state
  },

  // Utility function to clear the trail programmatically
  clearTrail(chart) {
    if (chart.trailState) {
      chart.trailState.trailPoints = []; // Remove all trail points
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

export default TrailPlugin;
