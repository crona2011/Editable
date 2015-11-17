# Bootstrap Editable v1.4.1

### Edit-Table, an ajax friendly way of updating dynamic HTML tables
A simple, customisable JQuery plugin that allows toggling of `<table>` cells to HTML inputs for editing.

The plugin attaches an assortment of customisable buttons and dropdowns to the end (last `<td>` and `<tr>`) to enable the user to `Add`, `Edit`, `View` and `Delete` the table's rows and cells

This is a pure client-side plugin which incorporates multiple callbacks to work with your own ajax functions - a great step if you need to create an 'ajaxable' table.

### Check-out the Demo: http://jsfiddle.net/Lmbm14hf/2/

The plugin is designed to work with my prefered JQuery plugins:

 * Bootstrap v3
 * Bootstrap Tooltips
 * Parsley Validation (listeners incorporated)
 * JQuery Number http://github.com/teamdf/jquery-number
 * JQuery Autosize http://github.com/MartinF/jQuery.Autosize.Input

If you don't want it to work with these functions then the plugin will fallback with a console warning.

**This plugin is a work is progress, it has been tested and is in production, if you find any bugs please don't hesitate to send a pull request!**

And here's how you use it! :+1:

1. **Firstly we have to include JQuery and Bootstrap (In that order):**
	* `<script src="/path/to/js/JQuery-x.x.x.min.js"></script>`
	* `<script src="/path/to/js/bootstrap.min.js"></script>`
	* `<link href="/path/to/css/bootstrap.css" rel="stylesheet">`

2. **Secondly we have to include our dependencies (some are actually optional):**
	* Optional: `<script src="../path/to/plugins/parsley.min.js"></script>`
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

The below example shows how you can execute functions to be called when a particular button is pressed packaged up into a neat block of code.

`$(hook)` is a pointer to which button was pressed and can be used to find that row and subsquentially the values you need in the cells.

You can also use the data object provided in the second argument on the callback (data), the returned data should look something like this:

``` javascript
data {
	1: {
		'obj':td.myid-td,
		'val':1
	},
	2: {
		'obj':td.name-td,
		'val':'myName'
	}
	etc...
};
```
The data will be fetched based on what element (if any) are contained within the cell, so if there is an `input` it will fetch the `input`'s value. Currently only `input`'s and `select`'s are supported. If there is no element or an unsupported element inside the cell the cell's contents will be returned as text.

The `onInit` callback passes the `addHook` as its second parameter.

You can use the object passed as 'obj' in the data array to reference a particular cell and change its contents if necessary, like so:
`$(data[1]['obj']).hmtl('<input type="text" class="form-control">');`

### Example:

``` javascript
myTableOptions = {
    view_hook: true,
    custom_hook: true,
    hookNames: {custom:'MyCustomHook'},
    onInit: function(hook, data) {
        $(data[1]['obj']).html("<input type='text' id='name-th-input' class='form-control' placeholder='Name' required='true'>");
        //autosize input
        $(data[1]['obj']).find(input').width('90px').autosizeInput();
    },
    add: function(hook, data) {
        //alert('Add button clicked');
    },
    editAfter: function(hook, data) {
        //alert('Edit button clicked');
    },
    done: function(hook, data) {
        //alert('Done button clicked');
    },
    rdelete: function(hook, data) {
        //alert('Delete button clicked');
    },
    view: function(hook, data) {
        //alert('View button clicked');
    },
};
```

After setting your options you call the plugin with the options variable as the argument like so:

``` javascript
$(document).ready(function() {
    $('.myTable').editable(myTableOptions);
});
```

**Returning false inside the edit or done functions will prevent the fields being converted in to fields and vice-versa**

**Please note that if you specify the `add_hook` as `true` (default) your table's `<th>`'s will each need a class, as when the `<tfoot>` is generated these classes will become each cell's id**

Like most JQuery plugins the options are seperated into callbacks, options and events, below is a few lists for your reference.

### Options:
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

### Callbacks:
Function | Explaination
---------|-------------
`onInit`| Will be called when the plugin gets initiated (can be bypassed by setting `shortCircuit` to `false`)
`add`| Will be called when the `add` button is clicked
`edit`| Will be called when the `edit` button is clicked
`editAfter`| Will be called when the `edit` button is clicked and after the fields have been converted to input fields
`done`| Will be called when the `done` button is clicked
`doneAfter`| Will be called when the `done` button is clicked and after the fields have been converted back to text
`rdelete`| Will be called when the `delete` button is clicked **notice the r in `rdelete`**
`view`| Will be called when the `view` button is clicked
`custom`| Will be called when the `custom` button is clicked
`validate`| Not currently in use

### Events (Global):
All events are attached to the document - `$(document).trigger('editable.name')`

Event | Explaination
------|-------------
`editable.validateError` | Triggered when parsley validates a field to be incorrect
`editable.validateSuccess` | Triggered when parsley validates a field to be correct
`editable.addHooks` | Triggered when the add hooks are created
`editable.dropdowns` | Triggered when the dropdown parent is created
`editable.viewDropdown` | Triggered when the dropdown `view` dropdown is created
`editable.customDropdown` | Triggered when the dropdown `custom` dropdown is created
`editable.deleteDropdown` | Triggered when the dropdown `delete` dropdown is created
`editable.viewButton` | Triggered when the dropdown `view` button is created
`editable.deleteButton` | Triggered when the dropdown `delete` button is created
`editable.customButton` | Triggered when the dropdown `custom` button is created
`editable.add` | Triggered after the `add` callback is called
`editable.edit` | Triggered after the `edit` callback is called
`editable.done` | Triggered after the `done` callback is called
`editable.editAfter` | Triggered after the `editAfter` callback is called
`editable.doneAfter` | Triggered after the `doneAfter` callback is called
`editable.rdelete` | Triggered after the `rdelete` callback is called
`editable.view` | Triggered after the `view` callback is called
`editable.custom` | Triggered after the `custom` callback is called
`editable.reset` | Triggered after the `reset` callback is called
`editable.onInit` | Triggered when editable is initated (this can be bypassed by setting `shortCircuit` to `false`)
`editable.enableInputs` | Triggered when cells are converted into input fields
`editable.disableInputs` | Triggered when input fields are converted into text










