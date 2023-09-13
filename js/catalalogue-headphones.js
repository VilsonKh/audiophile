import { cleanLocalStorage, createBusketItems, createCard, createSummaryBasketItem, onBurgerMenuOpen, onBusketClose, onBusketOpen, setCurrentProduct } from "./index.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);

	//opens and closes busket menu
	$(".btn-busket").on("click", onBusketOpen);
	$(".popup-busket").on("click", (e) => onBusketClose(e));

	//creates certain catalogues
	createCard("headphones", "#catalogue-headphones");

	//sets current product in local storage
	$(".btn").on("click", setCurrentProduct);

	//creates basket with items in checkout page
	$(".btn-checkout").on("click", createSummaryBasketItem);

	//clean local storage and basket
	$(".busket__remove").on("click", cleanLocalStorage);

	//fills busket if localStorage is not empty
	createBusketItems();
});
