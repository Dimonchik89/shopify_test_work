import { shopifyFetch } from './lib/shopify';
import { getProductQuery } from './lib/shopify/queries/product';
import { _slideDown, _slideToggle, _slideUp } from './scripts/slide';

const productContainer = document.querySelector('.product__container');
const placeholderProductImg = 'https://cdn.shopify.com/s/files/1/0591/3772/0393/files/AAUvwnj0ICORVuxs41ODOvnhvedArLiSV20df7r8XBjEUQ_s900-c-k-c0x00ffffff-no-rj_58e5329e-7eb7-49a4-86fc-2db2f8e43ead.jpg?v=1727081882';

async function fetchData() {
	try {
		productContainer.innerHTML = `
		<div class="spinner center">
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
			<div class="spinner-blade"></div>
		</div>
	`;
		const result = await shopifyFetch(getProductQuery);

		productContainer.innerHTML = createMarkup(result.body);
	} catch (error) {
		productContainer.innerHTML = `<h2 class="error__message">${error}</h2>`;
	}
}

function createMarkup(arr) {
	return arr
		.map(
			({ title, description, images, variants }) => `
			<div class="product__item">
				<div class="flip-card">
					<div class="flip-card-inner">
						<div class="flip-card-front">
							<div class="product__img">
								<img src="${images[0].url || placeholderProductImg}" alt="${images[0].altText || title}" />
							</div>
						</div>
						<div class="flip-card-back">
							<div class="product__img">
								<img src="${images.length > 1 ? images[1].url : images[0].url || placeholderProductImg}" alt="${images[0].altText || title}" />
							</div>
						</div>
					</div>
				</div>
				<div class="product__content">
					<h4 class="product__title">${title}</h4>
					<span class="product__description text-md">${description}</span>
					<div class="product__price">
						<span class="product__price-old">${variants[0]?.compareAtPrice?.amount || variants[0]?.price?.amount * 1.2}</span>
						<span class="product__price-current">${variants[0]?.price?.amount}</span>
					</div>
				</div>
			</div>
	`,
		)
		.join('');
}
fetchData();

const accordion = document.querySelector('.accordion');

if (accordion) {
	initAccordion(accordion);
}

function initAccordion(accordionBlock) {
	initAccordionBody(accordionBlock);
	accordionBlock.addEventListener('click', setAccordionAction);
}

function initAccordionBody(accordionBlock) {
	const accordionTitles = accordionBlock.querySelectorAll('[data-accordion]');

	if (accordionTitles.length > 0) {
		accordionTitles.forEach((item) => {
			if (!item.classList.contains('_active')) {
				item.nextElementSibling.hidden = true;
			}
		});
	}
}

function setAccordionAction(event) {
	const el = event.target;

	if (el.hasAttribute('data-accordion') || el.closest('[data-accordion]')) {
		const accordionTitle = el.hasAttribute('data-accordion') ? el : el.closest('[data-accordion]');
		const accordionBlock = accordionTitle.closest('[data-accordions]');

		if (!accordionBlock.querySelectorAll('._slide').length) {
			if (!accordionTitle.classList.contains('_active')) {
				hideAccordionBody(accordionBlock);
			}

			accordionTitle.classList.toggle('_active');

			_slideToggle(accordionTitle.nextElementSibling, 500);
		}
		event.preventDefault();
	}
}

function hideAccordionBody(accordionBlock) {
	const accordionActiveTitle = accordionBlock.querySelector('[data-accordion]._active');

	if (accordionActiveTitle) {
		accordionActiveTitle.classList.remove('_active');
		_slideUp(accordionActiveTitle.nextElementSibling, 500);
	}
}
