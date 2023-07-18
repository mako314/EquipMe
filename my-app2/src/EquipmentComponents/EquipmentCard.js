function ProductCard({ name, model }) {

    return (
        <li className="cards__item">
            <div className="card">
                <div className="card__content">
                    <div className="card__title">{name}</div>
                    <p className="card__text">Model:{model}</p>
                </div>
            </div>
        </li>
    )
}

export default ProductCard;