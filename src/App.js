import "./App.css";
import { useState } from "react";
import data from "./Data";

function App() {
  const [store, setStore] = useState(null);
  const [date, setDates] = useState([]);
  const [disp, setDisp] = useState([]);
  const [location, setLocation] = useState("");
  const [nearbyStores, setNearbyStores] = useState([]);

  async function getNearbyStores() {
    const response = await fetch("http://localhost:5000/get_nearby_stores", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        clean_address: location,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setNearbyStores(result.nearby_stores);
    } else {
      console.error("Failed to fetch nearby stores");
    }
  }

  function handleLocationChange(e) {
    setLocation(e.target.value);
  }

  function handleSearch() {
    getNearbyStores();
  }

  function handleStore(e) {
    const selectedStore = e.target.value;
    setStore(selectedStore);
    dates(selectedStore);
  }

  function dates(selectedStore) {
    let filteredDates = data.filter((item) => item.STORENAME == selectedStore);
    // console.log(filteredDates);
    if (filteredDates.length > 0) {
      setDates(filteredDates);
    } else {
      console.log("No data found for the selected store");
    }
  }

  function handleDateChange(e) {
    let selectedDate = e.target.value;
    let selectedData = data.find(
      (item) => item.STORENAME == store && item.Date == selectedDate
    );
    if (selectedData) {
      setDisp([selectedData]);
    }
  }

  return (
    <div>
      <h3>Search for Nearby Stores:</h3>
      <input
        type="text"
        placeholder="Enter Location"
        value={location}
        onChange={handleLocationChange}
      />
      <button onClick={handleSearch}>Search</button>

     
      {/* stores */}
      {nearbyStores.length>0 ? (
        <>
          <h3>Stores:</h3>
          <select onChange={handleStore}>
            <option>Select Store</option>
            {nearbyStores.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {store ? (
            <select onChange={handleDateChange}>
              <option>Select Date</option>
              {date.map((item, index) => (
                <option key={index} value={item.Date}>
                  {item.Date}
                </option>
              ))}
            </select>
          ) : (
            <></>
          )}

          {disp.length > 0 ? (
            <div>
              {disp.map((item, index) => (
                <p key={index}>{item.itemDescription}</p>
              ))}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
