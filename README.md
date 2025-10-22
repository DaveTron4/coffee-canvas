# WEB103 Project 4 - *Coffee Canvas*

Submitted by: **David Salas C.**

About this web app: **Coffee Canvas is a full-stack coffee recipe customization platform that allows users to create, save, and manage their perfect coffee drinks. Users can customize multiple aspects of their coffee including caffeine type, drink style, roast preferences, milk options, espresso shots, syrups, and toppings. The app features dynamic pricing that updates in real-time as options are selected, intelligent form validation that prevents incompatible combinations (like selecting roast types for espresso-based drinks), and a visually responsive interface that transforms between hot and iced themes. Built with React, Express, and PostgreSQL, Coffee Canvas provides a complete CRUD experience where users can view all their saved recipes, edit existing drinks, and delete unwanted ones from both list and detail views.**

Time spent: **10** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [x]  **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [x] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [x] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [x] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
- [x] **The visual interface changes in response to at least one customizable feature.**
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [x] **Users can view a list of all submitted `CustomItem`s.**
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**


The following **optional** features are implemented:

- [x] Selecting particular options prevents incompatible options from being selected even before form submission

The following **additional** features are implemented:

- [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ScreenToGif
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

### Challenges Encountered

**1. Recipe List Not Loading in ViewCoffee Page**
- **Problem**: The ViewCoffee component expected `coffeeOptions` as a prop from the parent but wasn't receiving it, causing recipes to never render and display "Loading recipes..." indefinitely.
- **Action**: Investigated the component's data flow and identified the dependency on an external prop that wasn't being passed correctly.
- **Solution**: Refactored ViewCoffee to fetch both recipes and coffee options internally using `Promise.all()`, removing the prop dependency and adding proper loading states and error handling.

**2. Dynamic Price Calculation Not Updating**
- **Problem**: The total price remained at $0.00 even when options were selected because ID types weren't matching (database IDs were numbers but form values were strings).
- **Action**: Created a dedicated `priceCalculator` utility to isolate the pricing logic and debug ID matching issues.
- **Solution**: Implemented robust numeric ID coercion in the calculator, ensured all IDs are converted to numbers for comparison, and added proper `useEffect` dependencies including `JSON.stringify()` for array fields to trigger recalculation on every relevant change.

**3. Multi-Select Checkboxes Not Working Correctly**
- **Problem**: Syrups and toppings checkboxes would add items but wouldn't remove them on deselection, leading to duplicate entries and incorrect pricing.
- **Action**: Reviewed the toggle handler logic and state management for array fields.
- **Solution**: Implemented a proper toggle function using `Array.includes()` to check existence and `Array.filter()` to remove items, ensuring clean addition and removal of selections.

**4. Server Update Endpoint Returning 404 Error**
- **Problem**: PUT requests to `/api/user-recipes/:id` were failing with 404 errors, preventing recipe updates.
- **Action**: Investigated the server-side controller and found a syntax error in the `updateUserRecipe` function.
- **Solution**: Fixed the destructuring error (`const { id } = parseInt(req.params.id)` → `const id = parseInt(req.params.id)`) and added `RETURNING *` to the SQL UPDATE query to return the updated recipe data.

**5. Displaying Raw IDs Instead of Human-Readable Names**
- **Problem**: Recipe details showed option IDs (e.g., "Caffeine Type: 3") instead of meaningful names (e.g., "Caffeine Type: Espresso").
- **Action**: Created helper utilities to map IDs to display names from the coffee options data.
- **Solution**: Built `recipeHelpers.js` with functions to resolve single and multiple option IDs to names, then enriched recipe objects with a `_display` field containing all human-readable values before rendering.

**6. SQL Insert Statement Syntax Error**
- **Problem**: Initial recipe creation was failing due to an invalid SQL statement that mixed INSERT and UPDATE syntax.
- **Action**: Reviewed the `createUserRecipe` controller function and identified the malformed query.
- **Solution**: Rewrote the query as a proper INSERT statement with all required columns and added `RETURNING *` to get the newly created recipe with its ID.

**7. Preventing Invalid Feature Combinations**
- **Problem**: Users could select incompatible options (e.g., selecting roast type for espresso drinks or shot modifiers for brewed coffee).
- **Action**: Analyzed the business logic for which caffeine types should allow which customization options.
- **Solution**: Implemented conditional field enabling/disabling based on caffeine type selection (espresso → allows shots, brewed → allows roast type) with automatic cleanup of disallowed selections when caffeine type changes.

**8. Missing Visual Interface Responsiveness Requirement**
- **Problem**: The app was missing the required feature where the visual interface changes in response to customizable options.
- **Action**: Identified that the "Is Iced" checkbox was a perfect candidate for visual theme changes.
- **Solution**: Implemented dynamic CSS theming that switches between warm brown/orange tones (hot coffee) and cool blue tones (iced coffee) with animated floating emojis, smooth color transitions, and different backgrounds for checkbox lists based on the iced selection.

## License

Copyright 2025 David Salas Carrascal

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.