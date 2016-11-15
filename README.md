Data Science Utilities
======================

A collection of utility algorithms that may come in handy for data science and data visualisation projects.

So far, only the SMOTE algorithm has been implemented. More will be added over time, probably.

Examples for browser and node.js are in the demos directory. The contents of the data directory are needed only for the demos.
Currently the node dependencies are included (in the standard node_modules directory). Don't ask...

The html demo uses the SMOTE algorithm for purposes it wasn't really intended for. Rather than oversampling the minority, this oversamples everything.
That's because I needed to get an idea of the density of, in this case, petrol stations in the UK, but the dataset only has about half the actual total number.


Languages and implementation
----------------------------

This is implemented in JavaScript for running in the browser. There is a modified version for running in node.js.
These will be combined into one file, possibly using AMD or UMD. Maybe even Harmony. 
If you don't know what these are, it shouldn't impede you in any way.

Don't expect anything you run in a browser to be up to the task of processing big data. Be sensible, or at least be patient.
However, it should work fine for a couple of 10s of thousands of data points.

And yes, it's data science in JavaScript. Get over it.