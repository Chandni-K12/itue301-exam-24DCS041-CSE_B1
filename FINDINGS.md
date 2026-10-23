# Findings

## T1 - The Menu

- **What was wrong:** The starter screen was the default Vite counter page. It had no canteen menu data or menu item cards.
- **Why it mattered:** The page could not show the required item details or calculate portion energy, and there was no availability label.
- **How I fixed it:** Added ten menu records in `src/data/menu.js` and a reusable `MenuCard` component in `src/components/MenuCard.jsx`. The card formats rupee prices to two decimals, defaults a missing `weightG` to 100, calculates rounded kcal, and labels availability. `src/App.jsx` renders each record with its stable `id` as the React key.

## T2 - The Order

- **What was wrong:** The starter app had no client-side routes, customer name, or cart behavior.
- **Why it mattered:** Students could not move between Menu, Order, and Specials without a page load, build an order, see its totals, or enforce the calorie limit.
- **How I fixed it:** Added React Router routes and navigation in `src/App.jsx`. Menu cards can add available items; unavailable items have a disabled button. The Order page stores the typed name, syncs cart lines with the orders API, reloads the browser's saved cart, supports removal, derives item count, price, and energy totals from the cart, and rejects an addition above 1000 kcal with the required message. A dismissible toast confirms additions and removals and announces calorie-limit rejections.

## T3 - The Specials Board

- **What was wrong:** The Specials route was only a placeholder and did not request or display API data.
- **Why it mattered:** Students could not see daily specials, their availability, or recover from a failed request.
- **How I fixed it:** Replaced the placeholder with `SpecialsPage` in `src/App.jsx`. It requests the required todos URL once per route opening, checks the HTTP status, catches request and JSON errors, sorts available items first while preserving their API order, and shows the available count. Recognizable canteen dish names appear with each original API title underneath. Its Retry button requests the data again without navigating or reloading.

## T4 - The Orders Service

- **What was wrong:** The starter project had no Express orders API, request logger, validation, or centralized error response.
- **Why it mattered:** Staff could not create or manage orders through the required endpoints, invalid order data was not rejected consistently, and unexpected failures had no safe JSON response.
- **How I fixed it:** Added `server/index.js` with the required menu calorie values, MongoDB-backed order creation/list/read/delete routes, input validation and defaults, one timestamped log line per request, and error middleware that returns the required generic 500 response. Added `server/models/Order.js`, a Vite `/api` proxy, Node globals for the server files in `eslint.config.js`, and local `.env` ignores.

## T5 - The Menu Data

- **What was wrong:** The starter project had no Mongoose menu schema, validation formatter, or seed script.
- **Why it mattered:** Menu documents had no consistent field rules, drink portions could exceed the required limit, and there was no reproducible example of valid and invalid data.
- **How I fixed it:** Added `server/models/MenuItem.js` with the required field rules and drink weight validation, `server/utils/formatValidationError.js` for plain validation details, and `server/seed.js` to save a valid menu item and print the formatted error from an invalid one. Added `server/seedMenuData.js` to upsert the ten current canteen menu items for Compass evidence, `server/models/Order.js` for persisted orders, and `seed` and `seed:menu` npm scripts with `.env.example` for the MongoDB connection string.
