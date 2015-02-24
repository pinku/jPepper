<%@ Control Language="C#" AutoEventWireup="true" CodeFile="text.ascx.cs" Inherits="jpepper_plugins_siteeditor_details_text" %>
<%@ Register Src="footer.ascx" TagName="footer" TagPrefix="uc1" %>
<%@ Register Src="header.ascx" TagName="header" TagPrefix="uc2" %>


<script type="text/javascript">
    _.onDomReady(function () {
        tinymce.init({ selector: "textarea" });
    });

</script>
<div data-id="se-detail">

    <uc2:header ID="header1" runat="server" />

    <div data-id="se-body">
        <div class="se-row">
            <textarea data-id="se-text"></textarea>
        </div>
    </div>

    <uc1:footer ID="footer1" runat="server" />

</div>
