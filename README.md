# Bootstrap Editable

### Edit-Table, an ajax friendly way of updating dynamic HTML tables
A simple, customisable JQuery plugin that allows toggling of `<table>` cells to HTML inputs for editing.

The plugin attaches an assortment of customisable buttons and dropdowns to the end (last `<td>` and `<tr>`) to enable the user to `Add`, `Edit`, `View` and `Delete` the table's rows and cells

This is a pure client-side plugin which incorporates multiple callbacks to work with your own ajax functions - a great step if you need to create an 'ajaxable' table.

### Check-out the Demo: jsfiddle.net/Lmbm14hf/1/

The plugin is designed to work with my prefered JQuery plugins:

 * Bootstrap v3
 * Bootstrap Tooltips
 * Parsley Validation (listeners incorporated)
 * JQuery Number github.com/teamdf/jquery-number
 * JQuery Autosize github.com/MartinF/jQuery.Autosize.Input

If you don't want it to work with these functions then the plugin will fallback with a console warning.

**This plugin is a work is progress, it has been tested and is in production (v1.3), if you find any bugs please don't hesitate to send a pull request!**

And here's how you use it! :+1:

1. **Firstly we have to include JQuery and Bootstrap (In that order):**
	* `<script src="/path/to/js/JQuery-x.x.x.min.js"></script>`
	* `<script src="/path/to/js/bootstrap.min.js"></script>`
	* `<link href="/path/to/css/bootstrap.css" rel="stylesheet">`

2. **Secondly we have to include our dependencies (some are actually optional):**
	* `<script src="../path/to/plugins/parsley.min.js"></script>`
	* Optional: `<script src="../path/to/plugins/number.min.js"></script>`
	* Optional: `<script src="../path/to/plugins/autosize.input.min.js"></script>`
	* And our Editable script: `<script src="../path/to/plugins/editable.js"></script>`

3. **And finally initiate the editable plugin:**
``` javascript
$(document).ready(function() {
    $('.myTable').editable();
});
```

Don't forget to initiate bootstrap tooltips!
``` javascript
$(document).ready(function() {
    $('body').tooltip({
        selector: "[title]",
    });
});
```
This will get you started with a simple table that becomes editable when you click edit... but although may look nice it doesn't have any functionality, so we need to add some options :smiley:

Like most JQuery plugins the options are seperated into callbacks and options, we will look at the options first.

The current list of options is as follows:

Option | Type | Values | Default | Explaination
-------|------|--------|---------|-------------
`shortCircuit`| bool | `true` or `false`|`false`|Jumps the plugin to the the return functions `enableInputs()` and `disabledInputs()` this is call automatically if you pass `null` as an argument like this: `$.editable(null)`
`add_hook`| bool |`true` or `false`|`true`|Includes an `Add` button in the `<tbody>` under the editable column
`toggler_hooks`| bool |`true` or `false`|`true`|Includes an `Edit` and `Done` button under the editable column
`delete_hook`| bool |`true` or `false`|`true`|Includes a `Delete` button or dropdown under the editable column
`custom_hook`| bool |`true` or `false`|`false`|Includes a `Custom` button or dropdown under the editable column.
`view_hook`| bool |`true` or `false`|`false`|Includes a `View` button or dropdown under the editable column
`debug`| bool |`true` or `false`|`false`|Dumps all options and callbacks to the console (`console.log`)
`parsleyValidation`| bool |`true` or `false`|`true`|Initiates Parsley's events listeners inside editable, if you specify `false` it will ignore field validation and you will have to do it manually
`hookNames`| array |`{view:'NewName'}`|`inherit`|Accepts an array of values that change the current button text
`inputWidth`| string |`px`|`50px`|Sets the defualt width of inputs, the value should include the `px` affix
`inputAttr`| array |any|`{required:true}`|Accepts an array of attributes to pass indiscriminately to all input fields
`inputClass`| string |any|`form-control`|Passes classes to the input field
`acceptAttributes`| array |any|<small>`{1: 'data-parsley-required',` <br> `2: 'data-parsley-type',` <br> `3: 'data-parsley-minlength',` <br> `4: 'data-parsley-maxlength',` <br> `5: 'data-parsley-length',` <br> `6: 'data-parsley-min',` <br> `7: 'data-parsley-max',` <br> `8: 'data-parsley-range',` <br> `9: 'data-parsley-pattern',` <br> `10: 'data-parsley-mincheck',` <br> `11: 'data-parsley-maxcheck',` <br> `12: 'data-parsley-check',` <br> `13: 'data-parsley-equalto'}`</small> |Array of attributes that will be searched through and if exist in the parent container (`<td>`) will be added to the input fields dynamically for validation.

Callback list:
Function | Explaination
---------|-------------
`onInit`|Will be called when the plugin gets initiated (can be bypassed by setting `shortCircuit` to `false`)
`add`|






