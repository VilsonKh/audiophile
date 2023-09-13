import { cleanLocalStorage, createbasketItems, createSummaryBasketItem, onBurgerMenuOpen, onbasketClose, onbasketOpen, setCurrentProduct } from "./index.js";

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

	createbasketItems();
});
