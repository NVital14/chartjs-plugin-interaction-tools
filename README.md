# chartjs-plugin-interaction-tools

This package provides two interactive plugins for [Chart.js](https://www.chartjs.org/):

- 🟢 **dragTrailPlugin** – allows you to click and drag a data point, leaving a visual trail.
- 🟡 **trailPlugin** – lets you draw freeform trails on the chart by clicking and dragging the mouse.

---

## Features

- Click-and-drag individual points
- Visual trail of movement
- Customizable trail appearance (radius, color, stroke)
- Draw freeform trails anywhere on the chart
- Compatible with Chart.js v4+

---

## Installation

```bash
npm install chartjs-plugin-interaction-tools
```

---

## Usage

1. Register the plugins

```bash
import {
  dragTrailPlugin,
  trailPlugin
} from 'chartjs-plugin-interaction-tools';

Chart.register(dragTrailPlugin, trailPlugin);
```

2. Add to your chart config

```bash
const chart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [...]
  },
  options: {
    plugins: {
      dragTrail: {
        trailFillColor: '#cccccc',
        trailBorderColor: '#999999',
        trailRadius: 4
      },
      Trail: {
        trailFillColor: '#ffaaaa',
        trailBorderColor: '#aa0000',
        trailRadius: 4
      }
    }
  },
  plugins: ['dragTrail', 'Trail']
});
```

---

## Clearing the Trail

You can clear trails manually with:

```bash
dragTrailPlugin.clearTrail(chart);
trailPlugin.clearTrail(chart);
```

---

## Advanced Options

Both plugins accept the following options under the `plugins` section of your chart config:

```bash
trailFillColor:   // Color to fill the trail points (default: '#c7c7c7')
trailBorderColor: // Color for the trail border (default: '#9c9c9c')
trailBorderWidth: // Width of the trail border (default: 1)
trailRadius:      // Radius of the trail points (default: 3)
```

Example:

```bash
plugins: {
  dragTrail: {
    trailFillColor: '#00ff00',
    trailBorderColor: '#006600',
    trailBorderWidth: 2,
    trailRadius: 5
  },
  Trail: {
    trailFillColor: '#ffaaaa',
    trailBorderColor: '#aa0000',
    trailBorderWidth: 2,
    trailRadius: 5
  }
}
```

## Questions

If you have any questions, feel free to reach out to Noemi Vital (noemimvital.14@gmail.com).