<%@ Control Language="VB" AutoEventWireup="false" CodeFile="introduction.ascx.vb" Inherits="js_documentation_pages_introduction" %>
<section class="page">
    <h2>Introduction</h2>
    <p>
        What's jPepper? jPepper is a small and fast javascript library for DOM manipultation.
    </p>
    <p>
        I always use jQuery, I'm a big fan of jQuery, but some months ago, during a project that requires performance, I found that jQuery in some cases is not so performant. 
        So I started writing my own library and that's jPepper.
    </p>
    <p>
        jPepper obviously is a baby compared to jQuery, jPepper is David and jQuery is Golia. I'm working hard to this library but I have a life, a wife and a lot of childrens (actually we are waiting for the ninth!), so be patient with me!
        For simple project jPepper is ready to use, with him you can do simple DOM manipulations, events binding and so on.
    </p>
    <br />
    <h2>How to use</h2>
    <p>jPepper is very simple, let's start with some examples</p>
    <span class="title1">1: Query DOM</span>
    <pre class="prettyprint">
    // get all DIVs in the page
    var alldivs = jPepper("DIV");

    // you can also use the short way with _(underscore) char
    alldivs = _("DIV");
    </pre>
</section>
