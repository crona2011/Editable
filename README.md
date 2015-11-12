# Editable Fn
<h3>Edit-Table, an ajax friendly way of updating dynamic HTML tables</h3>
<p>A simple, customisable JQuery plugin that allows toggling of <table> cells to HTML inputs for editing.</p>
<p>The plugin attaches an assortment of customisable buttons and dropdowns to the end (last <td> and <tr>) to enable the user to Add, Edit, View, Delete the table's rows and cells</p>
<p>This is a pure client-side plugin which incorporates multiple callbacks to work with your own ajax functions - a great step if you need to create an 'ajaxable' table.</p>

<h3>Check-out the Demo <a href="https://jsfiddle.net/Lmbm14hf/1/">JSFiddle</a></h3>

<p>The plugin is designed to work with my prefered JQuery plugins:</p>
<ul>
  <li>Bootstrap v3</li>
  <li>Bootstrap Tooltips</li>
  <li>Parsley Validation (listeners incorporated)</li>
  <li>jQuery number github.com/teamdf/jquery-number</li>
  <li>jQuery Autosize</li>
</ul>
<p>If you don't want it to work with these functions then the plugin will fallback with a console warning.</p>
<b>This plugin is a work is progress, it has been tested and is in production (v1.3), if you find any bugs please don't hesitate to send a pull request!</b>

<h3>Quick Setup</h3>

<p>To make your table editable instantly (just to give you an idea of what it will look like in your application) just include the editable script at the end of the page:</p>
`<script type="text/javascript" src="../path/to/plugins/editable.js"></script>`
<p>and initiate the plugin: </p> `$('#myTableID').editable();`
