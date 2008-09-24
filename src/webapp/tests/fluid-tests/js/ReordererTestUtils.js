var fluid_0_5 = fluid_0_5 || {};
var fluid = fluid || fluid_0_5;

(function ($, fluid) {

    fluid.testUtils = fluid.testUtils || {};
    fluid.testUtils.reorderer = fluid.testUtils.reorderer || {};

    fluid.testUtils.reorderer.prepend = function(prefix, indices) {
        return fluid.transform(indices, 
            function(index) {return prefix + index;});
        };

    fluid.testUtils.reorderer.assertItemsInOriginalPosition = function(desc, thumbArray, imageIds) {
        var thumbIds = fluid.transform(thumbArray, fluid.getId);
        jqUnit.assertDeepEq(desc + " expect items in original order", imageIds, thumbIds);
        };
            
    fluid.testUtils.reorderer.assertItemsInOrder = function (message, expectOrder, thumbArray, prefix) {
        var thumbIds = fluid.transform(thumbArray, fluid.getId);
        var expectIds = fluid.testUtils.reorderer.prepend(prefix, expectOrder);
        jqUnit.assertDeepEq(message, expectIds, thumbIds);
        };
        
    fluid.testUtils.reorderer.assertItemDefault = function (message, index) {
        var itemId = orderableIds[index];
        var item = fluid.jById(itemId);
            
        jqUnit.assertTrue(message + itemId + " should be default", item.hasClass(defaultClass));
        jqUnit.assertFalse(message + itemId + " should not be selected", item.hasClass(selectedClass));
        jqUnit.assertFalse(message + itemId + " should not be dragging", item.hasClass(draggingClass));
        };
        
    fluid.testUtils.reorderer.assertItemFocused = function (message, index) {
        var itemId = orderableIds[index];
        var item = fluid.jById(itemId);
            
        jqUnit.assertTrue(message + itemId + " should be selected", item.hasClass(selectedClass));   
        jqUnit.assertFalse(message + itemId + " should not be default", item.hasClass(defaultClass));
        jqUnit.assertFalse(message + itemId + " should not be dragging", item.hasClass(draggingClass));
        };
        
    fluid.testUtils.reorderer.assertItemDragged = function (message, index) {
        var itemId = orderableIds[index];
        var item = fluid.jById(itemId);
            
        jqUnit.assertTrue(message + itemId + " should be dragging", item.hasClass(draggingClass));  
        jqUnit.assertFalse(message + itemId + " should not be default",item.hasClass(defaultClass));
        };
        
        /** Break down the process of firing a particular modified key into the separate events
         * of firing the modifier followed by the modified key itself, to give realism to the process
         * of generating the composite key sequence.
         */
    fluid.testUtils.reorderer.compositeKey = function (reorderer, event, target) {
        var modifierEvent = $.extend(true, {}, event);
        var modifier = event.ctrlKey? "CTRL" : event.shiftKey? "SHIFT" : event.altKey? "ALT" : "";
        modifierEvent.keyCode = $.a11y.keys[modifier];
        fluid.testUtils.reorderer.keyDown(reorderer, modifierEvent, target);
        fluid.testUtils.reorderer.keyDown(reorderer, event, target);
        modifierEvent.ctrlKey = modifierEvent.shiftKey = modifierEvent.altKey = undefined;
        fluid.testUtils.reorderer.keyUp(reorderer, modifierEvent, target);
        };       
        
    fluid.testUtils.reorderer.keyDown = function (reorderer, event, target) {
        event.target = target;
        reorderer.handleKeyDown(event);
        };
        
    fluid.testUtils.reorderer.keyUp = function (reorderer, event, target) {
        event.target = target
        reorderer.handleKeyUp(event);
        };
        
    fluid.testUtils.reorderer.bindReorderer = function (ids) {
        return {
            compositeKey: function (reorderer, event, targetIndex) {
                return fluid.testUtils.reorderer.compositeKey(reorderer, event, 
                   fluid.byId(ids[targetIndex]));
            },
            keyUp: function (reorderer, event, targetIndex) {
                return fluid.testUtils.reorderer.keyUp(reorderer, event, 
                   fluid.byId(ids[targetIndex]));
            },
            keyDown: function (reorderer, event, targetIndex) {
                return fluid.testUtils.reorderer.keyDown(reorderer, event, 
                   fluid.byId(ids[targetIndex]));
            },
        }
    }
  
})(jQuery, fluid_0_5);