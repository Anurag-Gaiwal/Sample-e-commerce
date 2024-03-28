// Simulated data for products
const products = [
    { name: "Product 1", price: 20 },
    { name: "Product 2", price: 30 },
    { name: "Product 3", price: 25 },
    { name: "Product 4", price: 35 },
    { name: "Product 5", price: 40 }
];

// Function to generate product cards
function generateProductCards() {
    const productsSection = document.querySelector('.products');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product');
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;
        productsSection.appendChild(productCard);
    });
}

// Call the function to generate product cards
generateProductCards();
