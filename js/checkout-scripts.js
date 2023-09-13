import {
	cleanLocalStorage,
	confirmtionPopupClose,
	createBusketItems,
	createSummaryBasketItem,
	onBurgerMenuOpen,
	onBusketClose,
	onBusketOpen,
	onConfirmClick,
	setCurrentProduct,
	toggleInputs,
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

	//creates items in basket
	createBusketItems();

	//creates items in checkout basket
	createSummaryBasketItem();
	
	//opens confirmation popup
	$("#confirm").on("click", onConfirmClick);

	//closes confirmation popup
	$(".popup-confirmation").on("click", (e) => confirmtionPopupClose(e));

	//sets eMoney button active
	$(".checkout__radio-label").first().trigger("click");

	//hide eMoney fields, then cash button pressed
	$(".checkout__right").on("click", (e) => toggleInputs(e));
});
