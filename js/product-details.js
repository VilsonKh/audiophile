import {
	addBusketItemsToLocalStorage,
	cleanLocalStorage,
	createBusketItems,
	createDetailedCard,
	createSummaryBasketItem,
	itemDecrement,
	itemIncrement,
	onBurgerMenuOpen,
	onBusketClose,
	onBusketOpen,
	setCurrentProduct,
} from "./index.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);

	//opens and closes busket menu
	$(".btn-busket").on("click", onBusketOpen);
	$(".popup-busket").on("click", (e) => onBusketClose(e));

	//sets current product in local storage
	$(".btn").on("click", setCurrentProduct);

	//creates basket with items in checkout page
	$(".btn-checkout").on("click", createSummaryBasketItem);

	//clean local storage and basket
	$(".busket__remove").on("click", cleanLocalStorage);

	//fills busket if localStorage is not empty
	createBusketItems();

	//creates product details card
	createDetailedCard("#product-details");

	//adds items to localStorage
	$(".product-details .product .btn").on("click", addBusketItemsToLocalStorage);

	//increment product counter
	$(document).on("click", "#detailed__increment", itemIncrement);

	//decrement product counter
	$(document).on("click", "#detailed__decrement", itemDecrement);
});
