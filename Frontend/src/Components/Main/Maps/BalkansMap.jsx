import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryIdToISO = {
  8: "AL", // Albania
  70: "BA", // Bosnia and Herzegovina
  100: "BG", // Bulgaria
  191: "HR", // Croatia
  300: "GR", // Greece
  499: "ME", // Montenegro
  807: "MK", // North Macedonia
  642: "RO", // Romania
  688: "RS", // Serbia
  705: "SI", // Slovenia
  792: "TR", // Turkey
  XK: "XK",
};

const balkanCountryIds = [
  8, // Albania
  70, // Bosnia and Herzegovina
  100, // Bulgaria
  191, // Croatia
  300, // Greece
  499, // Montenegro
  807, // North Macedonia
  642, // Romania
  688, // Serbia
  705, // Slovenia
  792, // Turkey
];

export default function BalkansMap() {
  const [geographies, setGeographies] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        const countries = feature(
          topology,
          topology.objects.countries
        ).features;
        const filtered = countries.filter(
          (geo) =>
            (geo.id && balkanCountryIds.includes(+geo.id)) ||
            geo.properties.name === "Kosovo"
        );
        setGeographies(filtered);
      })
      .catch((err) => console.error("Error loading map data:", err));
  }, []);

  function getFlagEmoji(geo) {
    const iso2 = geo.properties.iso_a2 || countryIdToISO[geo.id] || "";
    if (iso2 === "XK") return "🇽🇰";
    return iso2
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  }
  const handleCountryClick = (geo) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const name = geo.properties?.name || geo.id;
    navigate(`/jobs/${name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleMouseMove = (evt, geo) => {
    setHoveredCountry(geo);
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  };
  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <div className=" flex flex-row">
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "auto",
          position: "relative",
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [21, 42],
            scale: 2500,
          }}
          width={1000}
          height={700}
        >
          <Geographies geography={{ features: geographies }}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey || geo.properties?.name}
                  geography={geo}
                  onClick={() => handleCountryClick(geo)}
                  onMouseMove={(evt) => handleMouseMove(evt, geo)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: "#2c7be5",
                      outline: "none",
                      cursor: "pointer",
                    },
                    hover: {
                      fill: "#1a5fb4",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#1a5fb4",
                      outline: "none",
                      cursor: "pointer",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        {hoveredCountry && (
          <div
            style={{
              pointerEvents: "none",
              position: "fixed",
              top: tooltipPos.y + 10,
              left: tooltipPos.x + 10,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 1000,
              userSelect: "none",
            }}
          >
            <span
              style={{
                fontFamily:
                  "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif",
              }}
            >
              {getFlagEmoji(hoveredCountry)}
            </span>

            <span>{hoveredCountry.properties.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
