import { InternalClient } from "@/apiClients/internalClient";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { useEffect, useRef } from "react";
import { GeoJSON } from "react-leaflet";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

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
        fillColor: fullConfig.theme.colors.yellow[400],
        weight: 1,
        opacity: 1,
        color: "#e7c952",
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
