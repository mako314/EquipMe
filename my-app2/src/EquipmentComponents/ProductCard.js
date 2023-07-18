function ProductCard({ name, model, make, location }) {

    return (
        <li className="cards__item">
            <div className="card">
                <div className="card__content">
                    <div className="card__title">Product Name: {name}</div>
                    <p className="card__text">Model: {model}</p>
                    <p className="card__text">Manufacturer: {make}</p>
                    <p className="card__text">Available Locations: {location}</p>

                </div>
            </div>
        </li>
    )
}

export default ProductCard;