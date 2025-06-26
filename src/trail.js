// TrailPlugin: Allows drawing a "trail" of points on a Chart.js chart by clicking and dragging on the canvas

const TrailPlugin = {
  id: 'Trail',

  // Initialize the plugin and set up mouse event listeners
  beforeInit(chart) {
    chart.trailState = {
      drawing: false,
      trailPoints: [],
    };

    const canvas = chart.canvas;

    // Define handlers as named functions so they can be removed later
    chart._trailHandlers = {
      mousedown: (e) => {
        chart.trailState.drawing = true;
        chart.trailState.trailPoints = [];
        const { x, y } = getRelativePosition(e, chart);
        const xValue = chart.scales.x.getValueForPixel(x);
        const yValue = chart.scales.y.getValueForPixel(y);
        chart.trailState.trailPoints.push({ x: xValue, y: yValue });
        chart.update('none');
      },
      mousemove: (e) => {
        if (!chart.trailState.drawing) return;
        const { x, y } = getRelativePosition(e, chart);
        const xValue = chart.scales.x.getValueForPixel(x);
        const yValue = chart.scales.y.getValueForPixel(y);
        chart.trailState.trailPoints.push({ x: xValue, y: yValue });
        chart.update('none');
      },
      mouseup: () => {
        chart.trailState.drawing = false;
      },
    };

    // Add event listeners
    canvas.addEventListener('mousedown', chart._trailHandlers.mousedown);
    canvas.addEventListener('mousemove', chart._trailHandlers.mousemove);
    canvas.addEventListener('mouseup', chart._trailHandlers.mouseup);
  },

  // Remove event listeners when the chart is destroyed
  beforeDestroy(chart) {
    const canvas = chart.canvas;
    if (canvas && chart._trailHandlers) {
      canvas.removeEventListener('mousedown', chart._trailHandlers.mousedown);
      canvas.removeEventListener('mousemove', chart._trailHandlers.mousemove);
      canvas.removeEventListener('mouseup', chart._trailHandlers.mouseup);
    }
  },

  // Draw the trail points and connecting lines before the datasets are drawn
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const { ctx } = chart;
    const { trailPoints } = chart.trailState;

    if (!trailPoints || trailPoints.length === 0) return;

    ctx.save();
    const fillColor = pluginOptions?.trailFillColor || '#c7c7c7';
    const borderColor = pluginOptions?.trailBorderColor || '#9c9c9c';
    const borderWidth = pluginOptions?.trailBorderWidth || 1;
    const radius = pluginOptions?.trailRadius || 3;

    // Draw each point in the trail
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

    // Draw line to connect the trail points
    if (trailPoints.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < trailPoints.length; i++) {
        const x = chart.scales.x.getPixelForValue(trailPoints[i].x);
        const y = chart.scales.y.getPixelForValue(trailPoints[i].y);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    ctx.restore();
  },

  // Utility function to clear the trail manually
  clearTrail(chart) {
    if (chart.trailState) {
      chart.trailState.trailPoints = [];
      chart.update();
    }
  },
};

// Helper function to get mouse position relative to the chart canvas
function getRelativePosition(e, chart) {
  const canvas = chart?.canvas || null;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

export default TrailPlugin;