<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="js_documentation_Default" %>

<%@ Register Src="pages/leftsummary.ascx" TagName="leftsummary" TagPrefix="uc1" %>

<%@ Register Src="pages/introduction.ascx" TagName="introduction" TagPrefix="uc2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>jPepper</title>

    <link href="css/reset.css" rel="stylesheet" />
    <link href='http://fonts.googleapis.com/css?family=Oswald:400,700,300' rel='stylesheet' type='text/css' />
    <link href="PrettyPrint/prettify.css" rel="stylesheet" />
    <link href="css/main.css" rel="stylesheet" />

    <script src="PrettyPrint/prettify.js"></script>
    <script src="../jpepper.stable.js"></script>

    <script type="text/javascript">
        _.onDomReady(function () {

            prettyPrint();

        });
    </script>
</head>
<body class="bg1">
    <form id="form1" runat="server">
        <section class="content">
            <section class="left">
                <uc1:leftsummary ID="leftsummary1" runat="server" />
            </section>
            <section class="right">
                <header>
                    <h1>jPepper</h1>
                    <h6>by Diego Pianarosa</h6>
                </header>
                <article>
                    <uc2:introduction ID="introduction1" runat="server" />
                </article>
            </section>
        </section>
    </form>
</body>
</html>
