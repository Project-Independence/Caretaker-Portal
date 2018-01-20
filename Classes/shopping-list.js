angular.module("app").factory("ShoppingList", function () {
    class ShoppingList {
        constructor(descriptor) {
            this.list = [];
        }

        addItem(shoppingItem) {
            this.list.push(shoppingItem);
        }

        removeItem() {}

        getItem() {}

        clear() {}
    }

    return ShoppingList;
});
