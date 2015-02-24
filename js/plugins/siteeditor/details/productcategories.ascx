<%@ Control Language="C#" AutoEventWireup="true" CodeFile="productcategories.ascx.cs" Inherits="jpepper_plugins_siteeditor_details_productcategories" %>
<%@ Register Src="footer.ascx" TagName="footer" TagPrefix="uc1" %>
<%@ Register Src="header.ascx" TagName="header" TagPrefix="uc2" %>

<div data-id="se-detail">

    <uc2:header ID="header1" runat="server" />

    <div data-id="se-body">
        <div class="se-row">
            <label>Codice</label>
            <input type="text" data-id="se-cd_category" />
        </div>
        <div class="se-row">
            <label>Descrizione</label>
            <input type="text" data-id="se-descr" />
        </div>
        <div class="se-row">
            <label>Descrizione estesa</label>
            <textarea data-id="se-descr2"></textarea>
        </div>
    </div>

    <uc1:footer ID="footer1" runat="server" />

</div>
