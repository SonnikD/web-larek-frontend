export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const categories = new Map([
  ['дополнительное', 'card__category_additional'],
	['кнопка', 'card__category_button'],
  ['софт-скил', 'card__category_soft'],
	['другое', 'card__category_other'],
	['хард-скил', 'card__category_hard'],
]);
