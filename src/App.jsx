import React, { useEffect, useRef, useState } from "react";
import "./App.css";


// WeatherApp() is the primary component function, responsible for 
//managing state changes, API calls, click events and data presentation
export default function WeatherApp() {
  const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const [lat, setLat] = useState(41.8781);
  const [lng, setLng] = useState(-87.6298);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //useState hook initializes the app with a null error state (no error )
  //setErrorKind acts as the setter, switching states between null, 'validation',
  //'permission', 'timeout', and 'network' (the various error states)
  const [errorKind, setErrorKind] = useState(null); 
  const [success, setSuccess] = useState(false);

  const [meta, setMeta] = useState(null); 
  const [periods, setPeriods] = useState([]);

  //the useEffect function is used to lazy load the google map only once its available 
  useEffect(() => {
    if (!MAPS_API_KEY) return;
    const id = "google-maps-script";
    if (document.getElementById(id)) {
      if (window.google && window.google.maps && !map) initMap();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`;
    script.onload = () => initMap();
    script.onerror = () => {
      setError("Sorry...looks like the google maps script failed to load.");
      setErrorKind("network");
    };
    document.head.appendChild(script);
    
  }, [MAPS_API_KEY]);

  //Boots up Google Map inside the 'map' div element
  function initMap() {
    if (!mapRef.current || !window.google) return;

    const defaultLocation = { lat: 41.8781, lng: -87.6298 };
    const gmap = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 6,
    });

    const gmarker = new window.google.maps.Marker({
      position: defaultLocation,
      map: gmap,
    });

    //adds a click listener for recentering the map when the map is clicked
    gmap.addListener("click", (e) => {
      const nextLat = Number(e.latLng.lat().toFixed(6));
      const nextLng = Number(e.latLng.lng().toFixed(6));
      setLat(nextLat);
      setLng(nextLng);
      const nextPos = { lat: nextLat, lng: nextLng };
      gmap.setCenter(nextPos);
      gmarker.setPosition(nextPos);
    });

    setMap(gmap);
    setMarker(gmarker);
  }

  function validateCoordinates(a, b) {
    return (
      typeof a === "number" &&
      typeof b === "number" &&
      !Number.isNaN(a) &&
      !Number.isNaN(b) &&
      a >= -90 &&
      a <= 90 &&
      b >= -180 &&
      b <= 180
    );
  }

  //Orchestrator component function shared by both the submit and use-my-location buttons 
  //Responsible for resetting the UI state, making calls to the national weather service API
  //and presenting either results or an error message. 
  async function runForecast(latNum, lngNum) {
    setError("");
    setErrorKind(null);
    setSuccess(false);
    setMeta(null);
    setPeriods([]);

    if (map && marker) {
      const pos = { lat: Number(latNum), lng: Number(lngNum) };
      map.setCenter(pos);
      marker.setPosition(pos);
    }

    try {
      setLoading(true);
      const gridInfo = await getGridInfo(latNum, lngNum);
      if (!gridInfo) throw new Error(".....Sorry! Couldn't retrieve any grid data for this location.");

      const forecast = await getForecast(
        gridInfo.office,
        gridInfo.gridX,
        gridInfo.gridY
      );
      if (!forecast || forecast.length === 0)
        throw new Error(".....Sorry, Looks like there's no forecast data for this location.");

      setMeta({
        office: gridInfo.office,
        gridX: gridInfo.gridX,
        gridY: gridInfo.gridY,
        count: forecast.length,
      });
      setPeriods(forecast.slice(0, 7));
      setSuccess(true);
    } catch (err) {
      setError(err.message || "OH NO! Looks like something went wrong with the network.");
      setErrorKind("network"); 
    } finally {
      setLoading(false);
    }
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateCoordinates(lat, lng)) {
      setError(".....Sorry, your coordinates are invalid. Enter valid latitude/longitude");
      setErrorKind("validation");
      return;
    }
    await runForecast(lat, lng);
  }

  //function component for handling geolocation 
  function handleUseMyLocation() {
    if (!("geolocation" in navigator)) {
      setError("Sorry...Looks like this browser doesn't support geolocation.");
      setErrorKind("geolocation");
      return;
    }
    setError("");
    setErrorKind(null);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        runForecast(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        let kind = "geolocation";
        let msg = "Sorry...Couldn't find your location.";
        if (err.code === err.PERMISSION_DENIED) {
          kind = "permission";
          msg = "Sorry...it appears we don't have permission to find your location.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          kind = "geolocation";
          msg = "Sorry...Your location is unavailable right now.";
        } else if (err.code === err.TIMEOUT) {
          kind = "timeout";
          msg = "Sorry...Looks like your request timed out.Try again!.";
        }
        setError(msg);
        setErrorKind(kind);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
  //HTML formating for results
  return (
    <div className="app">
      <h1 id="forecast-title">Super Cool Weather App</h1>
      <p id="location-heading">
        for ({lat.toFixed(4)}, {lng.toFixed(4)})
      </p>
      
      <div className="map-container">
        <div ref={mapRef} id="map" />
      </div>

      <form onSubmit={handleSubmit} className="container">
        <label htmlFor="lat">Latitude</label>
        <input
          id="lat"
          type="number"
          value={lat}
          onChange={(e) => setLat(parseFloat(e.target.value))}
        />

        <label htmlFor="lng">Longitude</label>
        <input
          id="lng"
          type="number"
          value={lng}
          onChange={(e) => setLng(parseFloat(e.target.value))}
        />

        <button type="submit" className="submitButton" disabled={loading}>
          {loading ? "Hang tight..." : "Submit Coordinates!"}
        </button>
        <button
          type="button"
          className="submitButton"
          onClick={handleUseMyLocation}
          disabled={loading}
        >
          Use My Location
        </button>
      </form>

      
      {error && (
        <div
          className={`error error--${errorKind || "generic"}`}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {success && (
        <p className="success-msg" id="success">
          It worked! Look at all these sweet forecasts 👍
        </p>
      )}

      
      <div className="forecast-block">
        {meta && (
          <>
            <p className="meta">
              Office: {meta.office}, Grid: ({meta.gridX}, {meta.gridY})
            </p>
            <p className="meta">{meta.count} forecast periods were found</p>
            <hr className="divider" />
          </>
        )}

        {periods.slice(0, 7).map((p) => (
          <h3 key={p.number}>
            <strong>{p.name}</strong>
            <br />
            {getWeatherEmoji(p.shortForecast)} Temperature: {p.temperature}°
            {p.temperatureUnit}
            <br />
            Wind: {p.windSpeed} {p.windDirection}
            <br />
            Forecast: {p.shortForecast}
          </h3>
        ))}
      </div>
    </div>
  );
}


async function getGridInfo(lat, lng) {
  const url = `https://api.weather.gov/points/${lat},${lng}`;
  const headers = {
    "User-Agent": "(React Weather App, dummy_email@fake_email_address.com)",
    Accept: "application/geo+json",
  };

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`....Error: ${res.status};  Sorry, The grid request failed for some reason`);
  const data = await res.json();
  return {
    office: data.properties.cwa,
    gridX: data.properties.gridX,
    gridY: data.properties.gridY,
  };
}

async function getForecast(office, gridX, gridY) {
  const url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;
  const headers = {
    "User-Agent": "(React Weather App, dummy_email@fake_email_address.com)",
    Accept: "application/geo+json",
  };

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`.....Error: ${res.status};  Sorry, Couldn't find any weather data for this location`);
  const data = await res.json();
  return data.properties.periods || [];
}
//conditionals for emojis that accompany results 
function getWeatherEmoji(forecast) {
  const text = String(forecast || "").toLowerCase();
  if (text.includes("sun")) return "☀️";
  if (text.includes("cloud")) return "☁️";
  if (
    text.includes("rain") ||
    text.includes("shower") ||
    text.includes("drizzle")
  )
    return "🌧️";
  if (text.includes("thunder")) return "⛈️";
  if (text.includes("snow") || text.includes("blizzard")) return "❄️";
  if (text.includes("fog") || text.includes("haze") || text.includes("mist"))
    return "🌫️";
  if (text.includes("wind")) return "🌬️";
  return "🌈";
}
