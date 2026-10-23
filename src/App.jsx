import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom'
import MenuCard from './components/MenuCard.jsx'
import { getEnergyKcal, getPortionWeight, menuItems } from './data/menu.js'
import './App.css'

const specialDisplayNames = {
  1: 'Masala Chai',
  2: 'Samosa',
  3: 'Veg Thali',
  4: 'Cold Coffee',
  5: 'Paneer Wrap',
  6: 'Aloo Paratha',
  7: 'Mango Lassi',
  8: 'Pav Bhaji',
  9: 'Poha Bowl',
  10: 'Dhokla Plate',
}

function getCartSessionId() {
  const storageKey = 'campus-canteen-cart-session'

  try {
    const savedId = window.localStorage.getItem(storageKey)
    if (savedId) return savedId

    const newId = window.crypto.randomUUID()
    window.localStorage.setItem(storageKey, newId)
    return newId
  } catch {
    return window.crypto.randomUUID()
  }
}

function SiteHeader({ cartCount }) {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/" aria-label="Campus Canteen home">
        <span className="brand-mark" aria-hidden="true">C</span>
        <span>Campus Canteen</span>
      </NavLink>

      <nav className="site-nav" aria-label="Main navigation">
        <NavLink end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">
          Menu
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/order">
          Order <span className="nav-cart-count">{cartCount}</span>
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/specials">
          Specials
        </NavLink>
      </nav>
    </header>
  )
}

function MenuPage({ onAdd, pendingItemIds, cartReady }) {
  return (
    <>
      <section className="welcome-panel" aria-label="Canteen introduction">
        <div className="welcome-copy">
          <span className="open-indicator"><span /> Serving today</span>
          <h1>Good food,<br />between classes.</h1>
          <p>Comforting campus favorites, made fresh for your next break.</p>
          <a className="menu-link" href="#today-menu">
            Explore today's menu <span aria-hidden="true">{'\u2193'}</span>
          </a>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-sun" />
          <span className="plate plate-back" />
          <span className="plate plate-front"><span>{'\u{1F35B}'}</span></span>
          <span className="welcome-leaf leaf-one" />
          <span className="welcome-leaf leaf-two" />
          <span className="welcome-art-caption">A little joy<br />on every plate</span>
        </div>
      </section>

      <section className="menu-section" aria-labelledby="menu-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Made for your break</p>
            <h2 id="menu-heading">Today's menu</h2>
          </div>
          <span className="menu-count">{menuItems.length} campus favorites</span>
        </div>
        <p className="section-description">
          Every serving comes with its portion size and energy information.
        </p>

        <div className="menu-grid" id="today-menu">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAdd={onAdd}
              isAdding={pendingItemIds.includes(item.id)}
              isCartReady={cartReady}
            />
          ))}
        </div>
      </section>
    </>
  )
}

function OrderPage({
  cart,
  cartReady,
  customerName,
  onNameChange,
  onRemove,
}) {
  const itemCount = cart.reduce((total, line) => total + line.qty, 0)
  const totalPrice = cart.reduce((total, line) => total + line.item.price * line.qty, 0)
  const totalEnergy = cart.reduce((total, line) => total + line.energyKcal, 0)

  return (
    <section className="order-page" aria-labelledby="order-heading">
      <div className="page-intro">
        <p className="eyebrow">Your canteen pick</p>
        <h1 id="order-heading">Your order</h1>
        <p className="section-description">Review your items and keep an eye on your energy total.</p>
      </div>

      <div className="order-layout">
        <div className="order-main">
          <label className="name-field" htmlFor="customer-name">
            <span>Your name</span>
            <input
              id="customer-name"
              type="text"
              value={customerName}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
            />
          </label>

          <h2 className="order-for" aria-live="polite">
            Order for: {customerName}
          </h2>

          {!cartReady ? (
            <p className="cart-loading" role="status">Loading your saved order...</p>
          ) : cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon" aria-hidden="true">{'\u{1F37D}'}</span>
              <h3>Your order is empty</h3>
              <p>Head to the menu and add something you love.</p>
              <NavLink className="secondary-link" to="/">Browse menu</NavLink>
            </div>
          ) : (
            <ul className="cart-list" aria-label="Order items">
              {cart.map((line) => (
                <li className="cart-line" key={line.lineId}>
                  <div className="cart-line-icon" aria-hidden="true">{line.item.icon}</div>
                  <div className="cart-line-info">
                    <h3>{line.item.name}</h3>
                    <p>{line.qty > 1 && `${line.qty} x `}{line.energyKcal} kcal</p>
                  </div>
                  <strong className="cart-line-price">
                    <span>{'\u20B9'}</span>{(line.item.price * line.qty).toFixed(2)}
                  </strong>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => onRemove(line.lineId)}
                    aria-label={`Remove ${line.item.name} from order`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="order-summary" aria-label="Order summary">
          <p className="eyebrow">Order summary</p>
          <div className="summary-row">
            <span>Items</span>
            <strong>{itemCount}</strong>
          </div>
          <div className="summary-row">
            <span>Total energy</span>
            <strong>{totalEnergy} kcal</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong><span>{'\u20B9'}</span>{totalPrice.toFixed(2)}</strong>
          </div>
          <div className={`calorie-meter${totalEnergy >= 900 ? ' near-limit' : ''}`}>
            <div className="calorie-meter-label">
              <span>Calorie limit</span>
              <strong>{totalEnergy} / 1000 kcal</strong>
            </div>
            <div
              className="calorie-meter-track"
              role="progressbar"
              aria-label="Calories used"
              aria-valuemin="0"
              aria-valuemax="1000"
              aria-valuenow={Math.min(totalEnergy, 1000)}
            >
              <span style={{ width: `${Math.min((totalEnergy / 1000) * 100, 100)}%` }} />
            </div>
          </div>
          <p className="summary-note">Your order can include up to 1000 kcal.</p>
        </aside>
      </div>
    </section>
  )
}

function SpecialsPage() {
  const [todos, setTodos] = useState([])
  const [status, setStatus] = useState('loading')
  const requestStarted = useRef(false)

  const fetchSpecials = useCallback(async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      if (!response.ok) throw new Error(`Specials request failed with status ${response.status}`)

      const data = await response.json()
      if (!Array.isArray(data)) throw new Error('Specials response was not a list')

      setTodos(data)
      setStatus('success')
    } catch {
      setTodos([])
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (requestStarted.current) return
    requestStarted.current = true
    void fetchSpecials()
  }, [fetchSpecials])

  function retrySpecials() {
    setStatus('loading')
    void fetchSpecials()
  }

  const orderedTodos = [...todos].sort(
    (first, second) => Number(first.completed) - Number(second.completed),
  )
  const availableCount = todos.filter((todo) => !todo.completed).length

  return (
    <section className="order-page specials-page" aria-labelledby="specials-heading">
      <div className="page-intro">
        <p className="eyebrow">A little something extra</p>
        <h1 id="specials-heading">Today's specials</h1>
        <p className="section-description">Daily picks from around the campus canteen.</p>
      </div>

      {status === 'loading' && (
        <p className="specials-loading" role="status">{'Loading specials\u2026'}</p>
      )}

      {status === 'error' && (
        <div className="specials-error" role="alert">
          <p>Could not load specials</p>
          <button className="retry-button" type="button" onClick={retrySpecials}>
            Retry
          </button>
        </div>
      )}

      {status === 'success' && (
        <>
          <p className="specials-count">{availableCount} of {todos.length} available</p>
          <ul className="specials-list" aria-label="Today's specials">
            {orderedTodos.map((todo) => (
              <li className={`special-card${todo.completed ? ' sold-out-card' : ''}`} key={todo.id}>
                <span className="special-number">{String(todo.id).padStart(2, '0')}</span>
                <div className="special-card-copy">
                  <h2>{specialDisplayNames[todo.id] ?? todo.title}</h2>
                  <p className="special-source-title">API title: {todo.title}</p>
                </div>
                <span className={`special-status${todo.completed ? ' sold-out' : ''}`}>
                  <span className="availability-dot" aria-hidden="true" />
                  {todo.completed ? 'Sold out' : 'Available'}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function NotificationToast({ notification, onDismiss }) {
  if (!notification) return null

  return (
    <div
      className={`notification-toast toast-${notification.type}`}
      role={notification.type === 'error' ? 'alert' : 'status'}
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="toast-icon" aria-hidden="true">
        {notification.type === 'error' ? '!' : '\u2713'}
      </span>
      <p>{notification.message}</p>
      {notification.type === 'success' && (
        <NavLink className="toast-link" to="/order" onClick={onDismiss}>
          View order
        </NavLink>
      )}
      <button className="toast-close" type="button" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  )
}

function App() {
  const [cart, setCart] = useState([])
  const [cartReady, setCartReady] = useState(false)
  const [pendingItemIds, setPendingItemIds] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [notification, setNotification] = useState(null)
  const [sessionId] = useState(getCartSessionId)
  const cartRef = useRef([])
  const pendingEnergyRef = useRef(0)
  const cartLoadStarted = useRef(false)

  useEffect(() => {
    if (!notification) return undefined

    const timeoutId = window.setTimeout(() => setNotification(null), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const loadSavedOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/orders?sessionId=${encodeURIComponent(sessionId)}`)
      const data = await response.json()
      if (!response.ok || !Array.isArray(data)) {
        throw new Error(data.error || 'Could not load saved orders')
      }

      const restoredCart = data.flatMap((order) => {
        const item = menuItems.find((menuItem) => menuItem.name === order.itemName)
        if (!item) return []
        return [{
          lineId: order.id,
          item,
          qty: order.qty,
          energyKcal: order.kcal,
        }]
      })
      cartRef.current = restoredCart
      setCart(restoredCart)
    } catch {
      setNotification({
        type: 'error',
        message: 'Could not load saved orders. Check that the API and MongoDB are running.',
      })
    } finally {
      setCartReady(true)
    }
  }, [sessionId])

  useEffect(() => {
    if (cartLoadStarted.current) return
    cartLoadStarted.current = true
    void loadSavedOrders()
  }, [loadSavedOrders])

  async function addItem(item) {
    if (!item.available || !cartReady || pendingItemIds.includes(item.id)) return

    const energyKcal = getEnergyKcal(item)
    const currentEnergy = cartRef.current.reduce((total, line) => total + line.energyKcal, 0)
      + pendingEnergyRef.current

    if (currentEnergy + energyKcal > 1000) {
      const message = 'Calorie limit of 1000 kcal exceeded'
      setNotification({ type: 'error', message })
      return
    }

    pendingEnergyRef.current += energyKcal
    setPendingItemIds((currentIds) => [...currentIds, item.id])

    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemName: item.name,
          qty: 1,
          weightG: getPortionWeight(item),
        }),
      })
      const savedOrder = await response.json()
      if (!response.ok) throw new Error(savedOrder.error || 'Could not save this order')

      const line = {
        lineId: savedOrder.id,
        item,
        qty: savedOrder.qty,
        energyKcal: savedOrder.kcal,
      }
      const nextCart = [...cartRef.current, line]
      cartRef.current = nextCart
      setCart(nextCart)
      setNotification({ type: 'success', message: `${item.name} added to your order.` })
    } catch {
      setNotification({
        type: 'error',
        message: `Could not save ${item.name}. Check that the API and MongoDB are running.`,
      })
    } finally {
      pendingEnergyRef.current -= energyKcal
      setPendingItemIds((currentIds) => currentIds.filter((itemId) => itemId !== item.id))
    }
  }

  async function removeItem(lineId) {
    const removedLine = cartRef.current.find((line) => line.lineId === lineId)
    if (!removedLine) return

    try {
      const response = await fetch(`/api/v1/orders/${encodeURIComponent(lineId)}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not remove this order')

      const nextCart = cartRef.current.filter((line) => line.lineId !== lineId)
      cartRef.current = nextCart
      setCart(nextCart)
      setNotification({ type: 'info', message: `${removedLine.item.name} removed from your order.` })
    } catch {
      setNotification({
        type: 'error',
        message: `Could not remove ${removedLine.item.name}. Please try again.`,
      })
    }
  }

  const cartItemCount = cart.reduce((total, line) => total + line.qty, 0)

  return (
    <BrowserRouter>
      <main className="app-shell">
        <SiteHeader cartCount={cartItemCount} />
        <Routes>
          <Route
            path="/"
            element={(
              <MenuPage
                onAdd={addItem}
                pendingItemIds={pendingItemIds}
                cartReady={cartReady}
              />
            )}
          />
          <Route
            path="/order"
            element={(
              <OrderPage
                cart={cart}
                cartReady={cartReady}
                customerName={customerName}
                onNameChange={setCustomerName}
                onRemove={removeItem}
              />
            )}
          />
          <Route path="/specials" element={<SpecialsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <NotificationToast notification={notification} onDismiss={() => setNotification(null)} />
        <footer className="site-footer">
          <span>Campus Canteen</span>
          <span>Good food, right around the corner.</span>
        </footer>
      </main>
    </BrowserRouter>
  )
}

export default App
