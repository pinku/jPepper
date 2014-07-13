jPepper
=======

What's jPepper? jPepper is a small and fast javascript library for DOM manipultation.

I always use jQuery, I'm a big fan of jQuery, but some months ago, during a project that requires performance,
I found that jQuery in some cases is not so performant. 
So I started writing my own library and that's is, this is jPepper.

jPepper obviously is a baby compared to jquery, jPepper is David and jQuery is Golia. 
I'm working hard to this library but I have a life, a wife and a lot of childrens 
(actually we are waiting for the ninth!), so be patient with me!

For simple project jPepper is ready to use, with him you can do simple DOM manipulations, events binding and so on.

### Usage

jPepper is simple:

```html

// you can use the jPepper function
var mydiv = jPepper("div#mydiv");

// or, the short function with the _ (underscore) character
var mydiv2 = _("div#mydiv2");

```

### Some comparisons
Because the ultimate goal of jPepper is the execution speed, every new method is tested and compared with jQuery, 
if jPepper method is faster means I did a good job.

1) Query DOM :
http://jsperf.com/jpepper-vs-jquery-1-query-dom

2) Empty DOM elements:
http://jsperf.com/jpepper-vs-jquery-2-set-dom-element-attribute

3) Set elements attribute
http://jsperf.com/jpepper-vs-jquery-3-set-element-attribute

4) Show elements:
http://jsperf.com/jpepper-vs-jquery-4-show-elements

5) Set elements style:
http://jsperf.com/jpepper-vs-jquery-5-set-elements-style

