import {
	onBurgerMenuOpen,
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
	closeConfirmationPopup,
} from "./index.js";

import { onBackButtonClick } from "./helpers.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);

	//opens and closes busket menu
	$(".btn-busket").on("click", onBusketOpen);
	$(".popup-busket").on("click", (e) => onBusketClose(e));

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

	$(".popup-confirmation").on("click", (e) => closeConfirmationPopup(e));

	createBusketItems();

	// createSummaryBasketItem();

	$(".back").on("click", onBackButtonClick);
});
