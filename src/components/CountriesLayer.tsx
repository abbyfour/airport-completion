import { InternalClient } from "@/external/internalClient";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { useEffect, useRef } from "react";
import { GeoJSON } from "react-leaflet";

type CountriesLayerProps = {
  countryCodes: string[];
};

const initialData: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export function CountriesLayer({ countryCodes }: CountriesLayerProps) {
  const geoJsonLayer = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    InternalClient.fetchCountriesGeoJSON().then((countries) => {
      if (geoJsonLayer.current) {
        geoJsonLayer.current
          .clearLayers()
          .addData(
            filterGeoJSON(countries as GeoJSON.FeatureCollection, countryCodes)
          );
      }
    });
  }, [countryCodes]);

  return (
    <GeoJSON
      ref={geoJsonLayer}
      data={initialData}
      style={{
        fillColor: "#ffcd00",
        weight: 2,
        opacity: 1,
        color: "transparent",
        fillOpacity: 0.4,
      }}
    />
  );
}

function filterGeoJSON(
  countries: GeoJSON.FeatureCollection,
  countryCodes: string[]
) {
  return {
    ...countries,
    features: countries.features.filter((feature) => {
      return countryCodes.includes(feature.properties?.ISO_A2);
    }),
  };
}
