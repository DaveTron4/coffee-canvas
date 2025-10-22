import React from 'react'
import { useRoutes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import ViewCoffee from './pages/ViewCoffee'
import EditCoffee from './pages/EditCoffee'
import CreateCoffee from './pages/CreateCoffee'
import CoffeeDetails from './pages/CoffeeDetails'
import CoffeeOptionsAPI from './services/CoffeeOptionsAPI'
import './App.css'

const App = () => {
  // State to hold coffee options fetched from API (categorized object)
    const [coffeeOptions, setCoffeeOptions] = useState({
        caffeineTypes: [],
        drinkTypes: [],
        roastTypes: [],
        milkOptions: [],
        shotNumbers: [],
        shotModifiers: [],
        syrupOptions: [],
        toppingOptions: [],
    });

    // Fetch coffee options on component mount
    useEffect(() => {

        const fetchOptions = async () => {
            // API call to get categorized coffee options
            const json = await CoffeeOptionsAPI.getAllCoffeeOptions();
            setCoffeeOptions(json);
        }

        fetchOptions();

    }, []);

    let element = useRoutes([
      {
        path: '/',
        element: <CreateCoffee title='BOLT BUCKET | Customize' coffeeOptions={coffeeOptions} />
      },
      {
        path:'/coffees',
        element: <ViewCoffee title='BOLT BUCKET | Custom Coffees' coffeeOptions={coffeeOptions} />
      },
      {
        path: '/coffees/:id',
        element: <CoffeeDetails title='BOLT BUCKET | View' coffeeOptions={coffeeOptions} />
      },
      {
        path: '/edit/:id',
        element: <EditCoffee title='BOLT BUCKET | Edit' coffeeOptions={coffeeOptions} />
      }
    ])

    return (
      <div className='app'>

        <Navigation />

        { element }

      </div>
    )
}

export default App