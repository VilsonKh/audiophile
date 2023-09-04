import {
	onBurgerMenuOpen,
	onBurgerMenuClose,
	onBusketOpen,
	onBusketClose,
	createCard,
	setCurrentProduct,
	createDetailedCard,
	addBusketItemsToLocalStorage,
	itemIncrement,
	itemDecrement,
	createSummaryBasketItem,
	cleanLocalStorage,
	createBusketItems,
	onConfirmClick,
} from "./index.js";

import { onBackButtonClick } from "./helpers.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);
	$(document).on("click", onBurgerMenuClose);

	//opens and closes busket menu
	$(".btn-busket").on("click", onBusketOpen);
	$(".popup-busket").on("click", onBusketClose);

	//preloads pages
	createCard("headphones", "#catalogue-headphones");
	createCard("speakers", "#catalogue-speakers");
	createCard("earphones", "#catalogue-earphones");

	//sets current product in local storage
	$(".btn").on("click", setCurrentProduct);

	createDetailedCard("#product-details");

	$(".product-details .product .btn").on("click", addBusketItemsToLocalStorage);

	$(document).on("click", "#detailed__increment", itemIncrement);

	$(document).on("click", "#detailed__decrement", itemDecrement);

	$(".btn-checkout").on("click", createSummaryBasketItem);

	$(".busket__remove").on("click", cleanLocalStorage);

	createBusketItems();

	createSummaryBasketItem();

	$("#confirm").on("click", onConfirmClick);

	$(".back").on("click", onBackButtonClick);
});
