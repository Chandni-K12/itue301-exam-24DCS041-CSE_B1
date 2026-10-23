
import { getEnergyKcal, getPortionWeight } from '../data/menu.js'

function MenuCard({ item, onAdd, isAdding, isCartReady }) {
  const availabilityLabel = item.available ? 'Available' : 'Not Available'

  return (
    <article className={`menu-card menu-card-${item.category}`}>
      <div className="menu-card-art" aria-hidden="true">
        <span className="food-emoji">{item.icon}</span>
        <span className="art-sparkle" />
      </div>

      <div className="menu-card-content">
        <div className="menu-card-topline">
          <span className="category-tag">{item.category}</span>
          <span
            className={`availability ${item.available ? 'is-available' : 'is-unavailable'}`}
          >
            <span className="availability-dot" aria-hidden="true" />
            {availabilityLabel}
          </span>
        </div>

        <h2>{item.name}</h2>
        <p className="price"><span>{'\u20B9'}</span>{item.price.toFixed(2)}</p>

        <dl className="menu-card-details">
          <div>
            <dt>Portion</dt>
            <dd>{getPortionWeight(item)} g</dd>
          </div>
          <div>
            <dt>Energy</dt>
            <dd>{getEnergyKcal(item)} kcal</dd>
          </div>
        </dl>
        <button
          className="add-button"
          type="button"
          disabled={!item.available || !isCartReady || isAdding}
          onClick={() => onAdd(item)}
        >
          {!item.available
            ? 'Unavailable'
            : !isCartReady
              ? 'Loading order...'
              : isAdding
                ? 'Saving...'
                : 'Add to order'}
          {item.available && isCartReady && !isAdding && <span aria-hidden="true">+</span>}
        </button>
      </div>
    </article>
  )
}

export default MenuCard
