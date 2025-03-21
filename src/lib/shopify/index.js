const BASE_URL = 'https://tsodykteststore.myshopify.com/api/2023-01/graphql.json';

export async function shopifyFetch(query) {
	try {
		const response = await fetch(BASE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
			},
			body: JSON.stringify({ query: query }),
		});

		const body = await response.json();

		if (body.errors) {
			throw body.errors[0];
		}

		const data = removeEdgesAndNodes(body.data.products).map((item) => ({
			...item,
			images: removeEdgesAndNodes(item.images),
			variants: removeEdgesAndNodes(item.variants),
		}));

		return {
			status: response.status,
			body: data,
		};
	} catch (error) {
		throw new Error(error.message);
	}
}

function removeEdgesAndNodes(arr) {
	return arr.edges.map((item) => item?.node);
}
