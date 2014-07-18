<%@ Language = VBScript %>
<% Option Explicit %>

<html>

<head>
<meta http-equiv="Content-Language" content="it">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title><%= Request.ServerVariables("HTTP_HOST") %></title>
</head>

<body>
<% response.Redirect("documentation/index.html") %></body>
</html>
