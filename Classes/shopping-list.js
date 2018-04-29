angular.module("app").factory("ShoppingList", function () {
    // ---ShoppingList Class---
    // Object representation of a senior's shopping list 
    class ShoppingList {
        constructor(descriptor) {
            this.list = [];
        }

        // add an item to the list
        addItem(shoppingItem) {
            this.list.push(shoppingItem);
        }

        // ---FUNCTIONS BELOW NEVER IMPLEMENTED---
        // remove an item from the list
        removeItem() {}

        // get an item by descriptor
        getItem() {}

        // empty the shopping list
        clear() {}
    }

    return ShoppingList;
});
