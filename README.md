Statistics visualisations
=========================

This is a (work-in-progress) Javascript port of the Java applet
[Vertrauensbereich für den Mittelwert](http://www.elektronik.htw-aalen.de/statistik-erleben/indexi.php?top=top.txt&nav=nav_applets.htm&main=Vertrauensbereich.html),
which visualises the estimation of the mean from a sample of values of a normally distributed random variable.

In future it should calculate the confidence interval of the estimated mean, but it doesn't do that yet.


Demo
----

[Click here to see it.](http://ept.github.io/stats-viz/confidence.html)

This application should work in all modern browsers (Chrome, Firefox, Safari, etc), but it is
*not compatible* with Internet Explorer 6, 7 and 8. Internet Explorer 9 and above should be ok.


Development
-----------

This project uses [D3.js](http://d3js.org/) and [jQuery](http://jquery.com/). In order to work on it,
you'll need to understand D3, which has a steep learning curve, but is very well-designed and
well-documented. It's worth your time to learn how to use it.

[Download the code.](https://github.com/ept/stats-viz/archive/gh-pages.zip)
