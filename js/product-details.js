import {
	addbasketItemsToLocalStorage,
	cleanLocalStorage,
	createbasketItems,
	createDetailedCard,
	createSummaryBasketItem,
	itemDecrement,
	itemIncrement,
	onBurgerMenuOpen,
	onbasketClose,
	onbasketOpen,
	setCurrentProduct,
} from "./index.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);

	//opens and closes basket menu
	$(".btn-basket").on("click", onbasketOpen);
	$(".popup-basket").on("click", (e) => onbasketClose(e));

	//sets current product in local storage
	$(".btn").on("click", setCurrentProduct);

	//creates basket with items in checkout page
	$(".btn-checkout").on("click", createSummaryBasketItem);

	//clean local storage and basket
	$(".basket__remove").on("click", cleanLocalStorage);

	//fills basket if localStorage is not empty
	createbasketItems();

	//creates product details card
	createDetailedCard("#product-details");

	//adds items to localStorage
	$(".product-details .product .btn").on("click", addbasketItemsToLocalStorage);

	//increment product counter
	$(document).on("click", "#detailed__increment", itemIncrement);

	//decrement product counter
	$(document).on("click", "#detailed__decrement", itemDecrement);
});
