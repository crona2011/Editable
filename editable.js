/*
 * COPYRIGHT: Edward Selby
 * VERSION: 1.4.2
 * LAST UPDATED: 17/11/2015
 *
 * Required Dependencies:
 * Glyphicons
 * Parsley Validation
 * Number.js
 * AutoSize.js
 * bootstrap v3
 * bootstrap tooltips (bootstrap v3.js)
 * 
 *
 * Change Log:
 *
 * 12/11/2015
 * Added custom_hook
 * Added hookNames
 * Added fallback for Parsley Validation
 *
 */

(function ( $ ) {
    
    $.fn.editable = function( options ) {
        //Set an alternative scope
        $this = this;
    
        //Define plugin defaults and types
        $.fn.editable.defaults = {
            //default options
            shortCircuit: false,
            add_hook: true,
            toggler_hooks: true,
            delete_hook: true,
            custom_hook: false,
            view_hook: false,
            debug: false,
            parsleyValidation: true,
            hookNames: {
                view: 'View',
                edit: 'Edit',
                add: 'Add',
                rdelete: 'Delete',
                done: 'Done',
                reset: 'Clear',
                custom: 'Custom',
            },
            
            //inputs
            inputWidth: '50px',
            inputAttr: {
                required: true,
            },
            inputClass: 'form-control',
            acceptAttributes: {
                1: 'data-parsley-required',
                2: 'data-parsley-type',
                3: 'data-parsley-minlength',
                4: 'data-parsley-maxlength',
                5: 'data-parsley-length',
                6: 'data-parsley-min',
                7: 'data-parsley-max',
                8: 'data-parsley-range',
                9: 'data-parsley-pattern',
                10: 'data-parsley-mincheck',
                11: 'data-parsley-maxcheck',
                12: 'data-parsley-check',
                13: 'data-parsley-equalto',
            },
    
            //static callbacks
            enableInputs: function() {},
            disableInputs: function() {},
    
            //optional callbacks
            onInit: function() {},
            add: function() {},
            done: function() {},
            doneAfter: function() {},
            edit: function() {},
            editAfter: function() {},
            rdelete: function() {},
            view: function() {},
            custom: function() {},
            validate: function() { return true; },
        };
        
        //loops through td's and returns and array of objects and there respective values
        var rowData = function(hook) {
            var data = {};
            var value;
            var idx;
            $(hook).closest('tr').find('td').each(function() {
                idx = $(this)[0].cellIndex;
                if ($(this).find('input').length) {
                    value = $(this).find('input').val();
                    data[idx] = {'obj': $(this), 'val': value};
                } else if ($(this).find('select').length) {
                    value = $(this).find('option:selected').val();
                    data[idx] = {'obj': $(this), 'val': value};
                } else {
                    data[idx] = {'obj': $(this), 'val': $(this).text()};
                }
            });
            return data;
        };
        
        //if null is parsed go straight to return functions (shortCircuit)
        if (options === null) {
            var opts = $.extend(true, {}, $.fn.editable.defaults, options, {shortCircuit: true} );
        } else if (options === undefined) {
            var opts = $.fn.editable.defaults
        } else {
            var opts = $.extend(true, {}, $.fn.editable.defaults, options );
        }
        
        //stringify inputAttr array
        opts.attrString = '';
        for (key in opts.inputAttr) {
            opts.inputAttr[key] = key+'="'+opts.inputAttr[key]+'" ';
            opts.attrString = opts.attrString.concat(opts.inputAttr[key]);
        }
        
        //output options for debug
        opts.debug ? console.log(opts) : '';
        
        //make plugin go directly to closure
        if (!opts.shortCircuit) {
            
            this.addClass('editable');
            
            //Parsley Validation
            //if parsley function is registered on the system add event listeners
            if ( $.isFunction($.fn.parsley) ) {
                // when there is an error, display the tooltip with the error message
                $.listen('parsley:field:error', function (fieldInstance) {
                    var messages = ParsleyUI.getErrorsMessages(fieldInstance);
                    fieldInstance.$element.tooltip({
                        animation: true,
                        container: 'body',
                        placement: 'top',
                        title: messages,
                        trigger: 'manual'
                    });
                    $(document).trigger('editable.validateError');
                });
                
                // destroy tooltip when field is valid
                $.listen('parsley:field:success', function(fieldInstance) {
                    $(document).trigger('editable.validateSuccess');
                });
            } else {
                opts.parsleyValidation = false;
                console.log('Parsley plugin missing, no validation required, falling back...');
            }
            
            //add edit hooks to table
            if (opts.toggler_hooks || opts.delete_hook || opts.view_hook || opts.custom_hook) {
                //add specific classes if more than one editable
                if ($(this).size() > 1) {
                    $(this).each(function(i) {
                        $(this).addClass('editable-'+i)
                    });
                }
                //add edit column
                $(this).each(function(i) {
                    if ( $(this).find('.edit-th').size() == 0  ) {
                        $(this).find('thead tr th').last().after("<th class='edit-th'><i class='glyphicon glyphicon-pencil'></i></th>");
                        $(this).find('.edit-th').css('width', '50px').addClass('text-center');
                    }
                    if ( $(this).find('.edit-td').size() == 0 ) {
                        $(this).find('tbody tr').append("<td class='not edit-td'></td>");
                        $(this).find('.edit-td').css('width', '50px').addClass('text-center');
                        
                        $(this).find('.edit-td').html("<div class='btn-group edit-group'></div>");
                        //add the width for toggle hooks only
                        if (opts.toggler_hooks) {
                            $(this).find('.edit-group').css('width', '75px');
                        }
                        //add dropdown if delete OR views hooks exist AND if toggler hooks exist
                        if ((opts.delete_hook || opts.view_hook || opts.custom_hook) && opts.toggler_hooks) {
                            $(this).find('.edit-td').find('.edit-group').html("<button type='button' class='edit-dropdown btn btn-xs btn-primary dropdown-toggle' data-toggle='dropdown' aria-expanded='false' title='Options'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button><ul class='dropdown-menu' role='menu' style='right: 9px; left: inherit; min-width:100px; padding:0px; margin:0px'></ul>")
                        }
                    }
                });
                //add edit button
                if (opts.toggler_hooks) {
                    //add 'Edit' hook
                    $(this).each(function(i) {
                        if ( $(this).find('.edit-hook').size() == 0 ) {
                            $(this).find('.edit-group').prepend("<button type='button' value='edit' class='btn btn-xs btn-default edit-hook' title='Click to Edit'>"+ opts.hookNames.edit +"</button><button type='button' value='done' class='btn btn-xs btn-success done-hook' title='Click to finish editing' style='display:none'>"+ opts.hookNames.done +"</button>");
                        }
                    });
                }
                $(document).trigger('editable.addHooks');
            }
    
            //add 'Delete', 'View' and 'Custom' dropdowns
            if (opts.view_hook && opts.delete_hook && !opts.custom_hook) {
                $(this).each(function(i) {
                    if ( $(this).find('.delete-hook').size() == 0 ) {
                        $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='delete' class='delete-hook' title='Click to "+ opts.hookNames.rdelete +"'>"+ opts.hookNames.rdelete +"</a></li>");
                    }
                    if ( $(this).find('.view-hook').size() == 0 ) {
                        $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='view' class='view-hook' title='Click to trigger an additional view'>"+ opts.hookNames.view +"</a></li>");
                    }
                });
                $(document).trigger('editable.dropdowns');
            //add 'View' and 'Custom' dropdowns
            } else if (opts.view_hook && opts.custom_hook && !opts.delete_hook) {
                $(this).each(function(i) {
                    if ( $(this).find('.view-hook').size() == 0 ) {
                        $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='view' class='view-hook' title='Click to trigger an additional view'>"+ opts.hookNames.view +"</a></li>");
                    }
                    if ( $(this).find('.custom-hook').size() == 0 ) {
                        $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='custom' class='custom-hook' title=Click to "+ opts.hookNames.custom +">"+ opts.hookNames.custom +"</a></li>");
                    }
                });
                $(document).trigger('editable.dropdowns');
            } else {
                $(this).each(function(i) {
                    if ( $(this).find('.delete-hook').size() == 0 ) {
                        $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='delete' class='delete-hook' title='Click to "+ opts.hookNames.rdelete +"'>"+ opts.hookNames.rdelete +"</a></li>");
                    }
                    if ( $(this).find('.custom-hook').size() == 0 ) {
                        $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='custom' class='custom-hook' title='Click to "+ opts.hookNames.custom +"'>"+ opts.hookNames.custom +"</a></li>");
                    }
                });
            }
            
            //if toggle hooks DO NOT exist
            if (!opts.toggler_hooks) {
                //if a view hook exists then put a button NOT a dropdown
                if(opts.view_hook && !opts.delete_hook && !opts.custom_hook) {
                    $(this).each(function(i) {
                        if ( $(this).find('.view-hook').size() == 0 ) {
                            $(this).find('.edit-group').append("<button type='button' value='view' class='btn btn-xs btn-default view-hook' title='Click to trigger an additional view'>"+ opts.hookNames.view +"</button>");
                        }
                    });
                    $(document).trigger('editable.viewDropdown');
                //if a custom hook exists then put a button NOT a dropdown
                } else if(!opts.view_hook && !opts.delete_hook && opts.custom_hook) {
                    $(this).each(function(i) {
                        if ( $(this).find('.custom-hook').size() == 0 ) {
                            $(this).find('.edit-group').append("<button type='button' value='custom' class='btn btn-xs btn-default custom-hook' title='Click to "+ opts.hookNames.custom +"''>"+ opts.hookNames.custom +"</button>");
                        }
                    });
                    $(document).trigger('editable.customDropdown');
                } else {
                    //and the same for delete hook
                    $(this).each(function(i) {
                        if ( $(this).find('.delete-hook').size() == 0 ) {
                            $(this).find('.edit-group').append("<button type='button' value='delete' class='btn btn-xs btn-default delete-hook' title='Click to delete'>"+ opts.hookNames.rdelete +"</button>");
                        }
                    });
                    $(document).trigger('editable.deleteDropdown');
                }
            //if toggler hooks DO exist then 'Delete', 'View' and 'Custom' should be dropdowns NOT buttons
            } else{
                if(opts.view_hook) {
                    $(this).each(function(i) {
                        if ( $(this).find('.view-hook').size() == 0 ) {
                            $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='view' class='view-hook' title='Click to trigger an additional view'>"+ opts.hookNames.view +"</a></li>");
                        }
                    });
                    $(document).trigger('editable.viewButton');
                }
                if(opts.delete_hook) {
                    $(this).each(function(i) {
                        if ( $(this).find('.delete-hook').size() == 0 ) {
                            $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='delete' class='delete-hook' title='Click to delete'>"+ opts.hookNames.rdelete +"</a></li>");
                        }
                    });
                    $(document).trigger('editable.deleteButton');
                }
                if(opts.custom_hook) {
                    $(this).each(function(i) {
                        if ( $(this).find('.custom-hook').size() == 0 ) {
                            $(this).find('.edit-group').find('.dropdown-menu').append("<li><a href='#' value='custom' class='custom-hook' title='Click to "+ opts.hookNames.custom +"'>"+ opts.hookNames.custom +"</a></li>");
                        }
                    });
                    $(document).trigger('editable.customButton');
                }
            }
    
            //build a default 'Add' row
            if (opts.add_hook) {
                $(this).each(function(i) {
                    if ( $(this).find('.add-hook').size() == 0 ) {
                        $(this).append('<tfoot></tfoot>');
                        $(this).find('tfoot').html("<tr class='add-tr not'></tr>");
                        var row = $(this).find('tfoot tr:last');
                        var th = $(this).find('thead tr th').not('.hide');
                        $(th).each(function(i) {
                            if (i == th.size() - 1) {
                                $(row).append("<td class='not add-td'><div class='btn-group add-group' style='width:75px'></div></td>")
                                $(row).find('.add-group').append("<button type='button' value='add' class='btn btn-xs btn-default add-hook' title='Click to add a row'>"+ opts.hookNames.add +"</button>");
                                $(row).find('.add-group').append("<button type='button' class='add-dropdown btn btn-xs btn-primary dropdown-toggle' data-toggle='dropdown' aria-expanded='false' title='Options'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button><ul class='dropdown-menu' role='menu' style='right: 9px; left: inherit; min-width:100px; padding:0px; margin:0px'></ul>");
                                $(row).find('.add-group').find('.dropdown-menu').append("<li><a href='#' value='reset' class='reset-hook' title='Click to clear the add fields'>"+ opts.hookNames.reset +"</a></li>");
                                return false;
                            } else {
                                var thClass = $(this).attr('class');
                                if (thClass == undefined) {
                                    console.log("No table header class found.");
                                }
                                $(row).append('<td class="not" id="'+thClass+'"></td>');
                            }
                        });
                        $(this).find('.add-td').css('width', '50px').addClass('text-center');
                    }
                });
            }
    
            //Define hooks
            var addHook = $(this).find('.add-hook');
            var editHook = $(this).find('.edit-hook');
            var doneHook = $(this).find('.done-hook');
            var deleteHook = $(this).find('.delete-hook');
            var viewHook = $(this).find('.view-hook');
            var resetHook = $(this).find('.reset-hook');
            var customHook = $(this).find('.custom-hook');
        
            /*
             * OPTIONAL CALLBACKS
             */
            
            //Trigger optional add callback
            if (opts.add_hook) {
                $(addHook).not('.bound').addClass('bound').on('click', function(e) {
                    if ($(this).is('.disabled') ) { return false; }
                    e.preventDefault();
                    
                    //parsley validation
                    if (opts.parsleyValidation) {
                        var parsleyContainer = $(this).closest('tr');
                        $(parsleyContainer).attr('data-parsley-validate', 'true');
                        $(parsleyContainer).parsley({
                            errorsContainer: function (ParsleyField) {
                                return ParsleyField.$element.attr("title");
                            },
                            errorsWrapper: false,
                        });
                    }
                    
                    //callback
                    if($(parsleyContainer).parsley().validate() || !opts.parsleyValidation) {
                        opts.add.call($this, $(this), rowData($(this)));
                    }
                    $(this).trigger('editable.add');
                    return false;
                });
            }
            
            //Trigger optional edit callback
            if (opts.toggler_hooks) {
                $(editHook).not('.bound').addClass('bound').on('click', function(e) {
                    e.preventDefault();
                    //call the edit callback
                    if(opts.edit.call($this, $(this), rowData($(this))) !== false) {
                        //enable the inputs
                        $this.editable(null).enableInputs($(this));
                    }
                    $(this).trigger('editable.edit');
                    return false;
                });
        
                //Trigger optional done callback
                $(doneHook).not('.bound').addClass('bound').on('click', function(e) {
                    e.preventDefault();
                    
                    //parsley validation
                    if (opts.parsleyValidation) {
                        var parsleyContainer = $(this).closest('tr');
                        $(parsleyContainer).attr('data-parsley-validate', 'true');
                        $(parsleyContainer).parsley({
                            errorsContainer: function (ParsleyField) {
                                return ParsleyField.$element.attr("title");
                            },
                            errorsWrapper: false,
                        });
                    }
                    
                    //check if fields are valid
                    if($(parsleyContainer).parsley().validate() || !opts.parsleyValidation) {
                        //call the done callback
                        if(opts.done.call($this, $(this), rowData($(this))) !== false) {
                            //disable the inputs
                            $this.editable(null).disableInputs($(this));
                        }
                        $(this).trigger('editable.done');
                    }
                    return false;
                });
            }
            
            //Trigger optional editAfter callback
            if (opts.toggler_hooks) {
                $(editHook).not('.after').addClass('after').on('click', function(e) {
                    e.preventDefault();
                    //call the editAfter callback
                    opts.editAfter.call($this, $(this), rowData($(this)));
                    $(this).trigger('editable.editAfter');
                    return false;
                });
        
                //Trigger optional doneAfter callback
                $(doneHook).not('.after').addClass('after').on('click', function(e) {
                    e.preventDefault();
                    
                    //parsley validation
                    if (opts.parsleyValidation) {
                        var parsleyContainer = $(this).closest('tr');
                        $(parsleyContainer).attr('data-parsley-validate', 'true');
                        $(parsleyContainer).parsley({
                            errorsContainer: function (ParsleyField) {
                                return ParsleyField.$element.attr("title");
                            },
                            errorsWrapper: false,
                        });
                    }
                    
                    //check if fields are valid
                    if($(parsleyContainer).parsley().validate() || !opts.parsleyValidation) {
                        //call the doneAfter callback
                        opts.doneAfter.call($this, $(this), rowData($(this)));
                        $(this).trigger('editable.doneAfter');
                    }
                    return false;
                });
            }
            
            //Trigger optional delete callback
            if (opts.delete_hook) {
                $(deleteHook).not('.bound').addClass('bound').on('click', function(e) {
                    if ($(this).is('.disabled') ) { return false; }
                    e.preventDefault();
                    opts.rdelete.call($this, $(this), rowData($(this)));
                    $(this).trigger('editable.rdelete');
                    return false;
                });
            }
            
            //Trigger optional view callback
            if (opts.view_hook) {
                $(viewHook).not('.bound').addClass('bound').on('click', function(e) {
                    if ($(this).is('.disabled') ) { return false; }
                    e.preventDefault();
                    opts.view.call($this, $(this), rowData($(this)));
                    $(this).trigger('editable.view');
                    return false;
                });
            }
            
            //Trigger optional custom callback
            if (opts.custom_hook) {
                $(customHook).not('.bound').addClass('bound').on('click', function(e) {
                    if ($(this).is('.disabled') ) { return false; }
                    e.preventDefault();
                    opts.custom.call($this, $(this), rowData($(this)));
                    $(this).trigger('editable.custom');
                    return false;
                });
            }
            
            $(resetHook).not('.bound').addClass('bound').on('click', function(e) {
                if ($(this).is('.disabled') ) { return false; }
                e.preventDefault();
                $(this).closest('tr').find('td').each(function() {
                    $(this).find('input').val('');
                    $(this).find('select :first').attr('selected', 'true');
                });
                $(this).trigger('editable.reset');
                return false;
            });
            
            //run custom function on initiate and parse this and addHook to callback
            opts.onInit.call(this, this, rowData(addHook));
            $(this).trigger('editable.onInit');
        
        } //end short circuit
        
        return {
            enableInputs: function(hook) {
                //get cell values and put them into inputs
                $(hook).closest('tr').find('td').not('.not').each(function(i) {
                    var carryAttr = '';
                    if (opts.parsleyValidation) {
                        for (key in opts.acceptAttributes) {
                            if ($(this).attr(opts.acceptAttributes[key]) == undefined) {
                                continue;
                            } else {
                                var string = opts.acceptAttributes[key]+'="'+$(this).attr(opts.acceptAttributes[key])+'" ';
                                carryAttr = carryAttr.concat(string);
                            }
                        }
                    }
                    cellValue = $(this).html();
                    width = $(this).width();
                    $(this).html("<input type='text' value='"+cellValue+"' class='ajax-input "+opts.inputClass+"' style='width:"+width+"px'"+opts.attrString+" "+carryAttr+">");
                    if(i == 0) {
                        $(this).find('input').focus();
                    }
                });
        
                //set this link to done
                $(hook).parent().find('.edit-hook').hide();
                $(hook).parent().find('.done-hook').show();
        
                //bind links so they can't be clicked
                $(hook).closest('tbody').find('.add-hook, .view-hook, .delete-hook').addClass('disabled');
        
                //autosize inputs
                if ( $.isFunction($.fn.autosizeInput) ) {
                    $(hook).closest('tr').find('td').find('input').each(function() {
                        $(this).width(opts.inputWidth);
                        $(this).autosizeInput();
                    });
                } else {
                    console.log('autosizeInput plugin missing, falling back...');
                }
                
                //format number inputs
                if ( $.isFunction($.fn.number) ) {
                    $(hook).closest('tr').find('td').find('input').each(function() {
                        if ($(this).attr('data-parsley-type') !== undefined && $(this).attr('data-parsley-type') == 'number' || $(this).attr('type') == 'number') {
                            $(this).number( true, 2 );
                        }
                    });
                } else {
                    console.log('number plugin missing, falling back...');
                }
                
                $(document).trigger('editable.enableInputs');
                
            },
            
            disableInputs: function(hook) {
                //if hook is undefined hook = this (the table)
                hook == undefined ? hook = $this : '';
                
                //if hook is the event trigger:
                if (hook.has(doneHook)) {
                    //get cell values and put them into inputs
                    $(hook).closest('tr').find('td').not('.not').each(function(i) {
                        if ($(this).find('input').size() == 1) {
                            var value = $(this).find('input').val();
                        } else if ($(this).find('select').size() == 1) {
                            var value = $(this).find('option:selected').html();
                        }
                        $(this).html(value);
                    });
            
                    //set this link to done
                    $(hook).parent().find('.done-hook').hide();
                    $(hook).parent().find('.edit-hook').show();
            
                    //set class so they can't be clicked
                    $(hook).closest('tbody').find('.add-hook, .view-hook, .delete-hook').removeClass('disabled');
                }
                //if it is the event parent($this):
                if (hook.is($this)) {
                    //get cell values and put them into inputs
                    $(hook).find('td').not('.not').each(function(i) {
                        if ($(this).find('input').size() == 1) {
                            if (parseFloat($(this).find('input').val())) {
                                var value = $(this).find('input').val().replace(/,/g, '');
                            } else {
                                var value = $(this).find('input').val();
                            }
                        } else if ($(this).find('select').size() == 1) {
                            var value = $(this).find('option:selected').html();
                        }
                        $(this).html(value);
                    });
            
                    //set this link to done
                    $(hook).find('.done-hook').hide();
                    $(hook).find('.edit-hook').show();
            
                    $(hook).closest('tbody').find('.add-hook, .view-hook, .delete-hook').removeClass('disabled');
                }
                $(document).trigger('editable.disableInputs');
            }
        }
    
    }

}(jQuery));



