import { cleanLocalStorage, createBusketItems, createSummaryBasketItem, onBurgerMenuOpen, onBusketClose, onBusketOpen, setCurrentProduct } from "./index.js";

$(function () {
	//opens and closes burger menu
	$(".header__burger").on("click", onBurgerMenuOpen);

	//opens and closes busket menu
	$(".btn-busket").on("click", onBusketOpen);
	$(".popup-busket").on("click", (e) => onBusketClose(e));

	//sets current product in local storage
	$(".btn").on("click", setCurrentProduct);

	$(".btn-checkout").on("click", createSummaryBasketItem);

	$(".busket__remove").on("click", cleanLocalStorage);

	createBusketItems();
});
