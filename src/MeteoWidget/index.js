import React, { useState, useEffect } from "react";
import "./styles.css";
import PlaceholderIcon from "./timeImage/PlaceholderIcon";
import { get } from "lodash";
import ReactTooltip from 'react-tooltip';

const Day = ({ temp, image, label, selected = false, details = '' }) => {
  return (
    <div data-tip={details} className={`day ${selected && "selected"}`}>
      <div className="daylabel">{label}</div>
      <div className="dayimage">{image}</div>
      <div className="daytemp">{temp}</div>
    </div>
  );
};

const getIcon = ({weather: { icon } }, isSup = false) => 
   <img alt='iconMeteo' className={isSup ? 'iconSup' : 'icon'} src={`https://www.weatherbit.io/static/img/icons/${icon}.png`} />

const getLabel = ({ valid_date }) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const d = new Date(valid_date);
  const dayName = days[d.getDay()];
  return dayName;
};

const MeteoWidget = () => {
  let [coords, setCoords] = useState([0, 0]);
  let [daysData, setDaysData] = useState({});
  let [isRun, setIsRun] = useState(false);
  let [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCoords([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    if (isRun && coords[0]) {
      fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${coords[0]}&lon=${
        coords[1]
        }3&lang=en&days=7&key=c34a0091a8b548d89208c4572a9f8c99`
      )
        .then(res => res.json())
        .then(res => {
          setDaysData(res);
          setIsFetching(false);
        });
    }
    setIsRun(true);
  }, [coords, isRun]);

  if (isFetching) {
    return <div id="loading">Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <ReactTooltip />
      <div className="flip-box-front">
        <div id="summary">
          <div id="location">
            <span style={{ marginRight: 10 }}>
              <PlaceholderIcon width="23px" height="23px" />
            </span>
            {daysData.city_name}
          </div>
          <div id="summaryimage">
            {getIcon(get(daysData, "data.0", []), true)}
          </div>
          <div id="summarytemp">{get(daysData, "data.0.temp")}°</div>
          <div className="summarydetail">
            Feel like {get(daysData, "data.0.app_max_temp")}°
              </div>
          <div className="summarydetail">
            Humidity {get(daysData, "data.0.rh")}%
              </div>
        </div>
        <hr id="divider" />
        <div id="days">
          {get(daysData, "data", []).map((day, i) => (
            <Day
              key={get(day, "valid_date")}
              temp={`${parseInt(get(day, "low_temp", ""))}° - 
                  ${parseInt(get(day, "max_temp", ""))}°`}
              selected={i === 0}
              image={getIcon(day)}
              label={getLabel(day)}
              details={`${get(day, 'weather.description', '')}, Humidity: ${get(day, 'rh', '0')} % `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeteoWidget;
