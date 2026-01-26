"use client";

import { useEffect, useRef, useState } from "react";
import { useAddress } from "@hooks/azli_hooks/useAddress";
import { useRouter } from "next/navigation";

/* Tabs */
const tabs = [
  { key: "home", label: "home" },
  { key: "office", label: "office" },
  { key: "other", label: "other" },
];

export default function AddAddressForm() {
  const router = useRouter();
  const { handleCreateAddress } = useAddress();
  const GOOGLE_MAPS_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    "AIzaSyCYN_-tZnt82xp8PtM7dW3fIdhH8OV82CE";

  const [activeTab, setActiveTab] = useState("home");
  const [mapError, setMapError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [form, setForm] = useState({
    full_name: "",
    ph_number: "",
    pin_code: "",
    house_building_number: "",
    street_location: "",
    district: "",
    landmark: "",
    apartment_name: "",
    phase: "",
    block: "",
    floor_number: "",
    room_number: "",
    lift_floor_number: "",
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Initialize Google Maps once script is loaded
  useEffect(() => {
    const key = GOOGLE_MAPS_KEY;
    if (!key) {
      setMapError("Google Maps key is missing");
      return;
    }

    const initMap = () => {
      if (!mapContainerRef.current || !window.google?.maps) return;
      if (mapInstanceRef.current) return; // prevent re-init

      const defaultCenter =
        selectedLocation || { lat: 12.9716, lng: 77.5946 }; // default to BLR

      mapInstanceRef.current = new window.google.maps.Map(
        mapContainerRef.current,
        {
          center: defaultCenter,
          zoom: 13,
        }
      );

      markerRef.current = new window.google.maps.Marker({
        position: defaultCenter,
        map: mapInstanceRef.current,
      });

      mapInstanceRef.current.addListener("click", (event) => {
        const loc = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setSelectedLocation(loc);
      });
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    // If script already present, just wait for it to finish loading instead of re-adding
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", initMap, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => setMapError("Failed to load Google Maps");
    document.body.appendChild(script);
  }, [GOOGLE_MAPS_KEY]);

  // Keep marker and map in sync when selection changes
  useEffect(() => {
    if (selectedLocation && markerRef.current && mapInstanceRef.current) {
      markerRef.current.setPosition(selectedLocation);
      mapInstanceRef.current.panTo(selectedLocation);
    }
  }, [selectedLocation]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported on this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapError("");
        setSelectedLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setMapError("Unable to fetch current location");
      }
    );
  };

  /* ========================
      SAVE ADDRESS HANDLER
  ========================= */
  const handleSave = async () => {
    console.log("🟦 Save button clicked");
    console.log("📝 Active Tab (address_type):", activeTab);
    console.log("📌 Current Form Data:", form);
        console.log("📌 Current Form Data:", form);

            console.log("📌 selectedLocation?.lat::::::", selectedLocation?.lat);
                        console.log("📌 selectedLocation?.lng::::::", selectedLocation?.lng);



    const payload = {
      full_name: form.full_name,
      ph_number: form.ph_number,
      pin_code: form.pin_code,
      house_building_number: form.house_building_number,
      street_location: form.street_location, // maps to backend "street"
      district: form.district,
      state: "Karnataka", // TEMP DEFAULT
      address_type: activeTab,

      location_lat: selectedLocation?.lat || "",
      location_log: selectedLocation?.lng || "",

      apartment_name: form.apartment_name,
      phase: form.phase,
      block: form.block,
      floor_number: form.floor_number,
      room_number: form.room_number,
      lift_floor_number: form.lift_floor_number,

      landmark: form.landmark,
      receiver_name: "",
      receiver_number: "",
    };

    console.log("📦 FINAL PAYLOAD TO API:", payload);

    try {
      console.log("🚀 Calling handleCreateAddress()...");
      const ok = await handleCreateAddress(payload);

      console.log("✅ API Response:", ok);

      if (ok) {
        console.log("🎉 Redirecting to /address ...");
        router.push("/address");
      } else {
        console.log("❌ handleCreateAddress returned FALSE");
      }
    } catch (err) {
      console.log("💥 ERROR in handleSave:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] p-4 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New Address
      </h1>

      {/* ============================
          GRID - MAP LEFT / FORM RIGHT
      ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ----------------- MAP AREA ----------------- */}
        <div className="rounded-2xl bg-white shadow p-3 h-[380px] md:h-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Select Location
          </h2>

          <div
            ref={mapContainerRef}
            className="w-full h-[320px] bg-gray-200 rounded-xl"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
            <span>
              {selectedLocation
                ? `Lat: ${selectedLocation.lat.toFixed(
                    5
                  )}, Lng: ${selectedLocation.lng.toFixed(5)}`
                : "Tap on the map to select a point"}
            </span>
            <button
              type="button"
              className="text-[#2A8B45] font-semibold"
              onClick={handleUseCurrentLocation}
            >
              Use current location
            </button>
          </div>
          {mapError && (
            <p className="text-xs text-red-600 mt-2">{mapError}</p>
          )}
        </div>

        {/* ----------------- FORM AREA ----------------- */}
        <div className="rounded-2xl bg-white p-5 shadow space-y-5">
          {/* TABS */}
          <div className="flex gap-3 mb-3">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition
                ${
                  activeTab === t.key
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* FULL NAME */}
          <InputField
            label="Full Name"
            placeholder="Enter full name"
            value={form.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
          />

          {/* PHONE */}
          <InputField
            label="Phone Number"
            placeholder="Enter phone number"
            value={form.ph_number}
            onChange={(e) => updateField("ph_number", e.target.value)}
          />

          {/* PINCODE */}
          <InputField
            label="Pincode"
            placeholder="Enter pin code"
            value={form.pin_code}
            onChange={(e) => updateField("pin_code", e.target.value)}
          />

          {/* HOME ONLY FIELD */}
          {activeTab === "home" && (
            <InputField
              label="House No"
              placeholder="Enter house number"
              value={form.house_building_number}
              onChange={(e) =>
                updateField("house_building_number", e.target.value)
              }
            />
          )}

          {/* STREET */}
          <InputField
            label="Street / Location"
            placeholder="Enter street or location"
            value={form.street_location}
            onChange={(e) => updateField("street_location", e.target.value)}
          />

          {/* DISTRICT */}
          <InputField
            label="District"
            placeholder="Enter district"
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
          />

          {/* LANDMARK */}
          <InputField
            label="Landmark (optional)"
            placeholder="Enter landmark"
            value={form.landmark}
            onChange={(e) => updateField("landmark", e.target.value)}
          />

          {/* OFFICE TAB FIELDS */}
          {activeTab === "office" && (
            <>
              <InputField
                label="Phase"
                value={form.phase}
                placeholder="Enter phase"
                onChange={(e) => updateField("phase", e.target.value)}
              />
              <InputField
                label="Block"
                value={form.block}
                placeholder="Enter block"
                onChange={(e) => updateField("block", e.target.value)}
              />
              <InputField
                label="Room No"
                value={form.room_number}
                placeholder="Enter room number"
                onChange={(e) => updateField("room_number", e.target.value)}
              />
              <InputField
                label="Lift Floor No"
                value={form.lift_floor_number}
                placeholder="Enter lift floor number"
                onChange={(e) =>
                  updateField("lift_floor_number", e.target.value)
                }
              />
            </>
          )}

          {/* OTHER TAB FIELDS */}
          {activeTab === "other" && (
            <>
              <InputField
                label="Apartment Name"
                value={form.apartment_name}
                placeholder="Enter apartment"
                onChange={(e) => updateField("apartment_name", e.target.value)}
              />
              <InputField
                label="Phase"
                value={form.phase}
                placeholder="Enter phase"
                onChange={(e) => updateField("phase", e.target.value)}
              />
              <InputField
                label="Block"
                value={form.block}
                placeholder="Enter block"
                onChange={(e) => updateField("block", e.target.value)}
              />
              <InputField
                label="Room No"
                value={form.room_number}
                placeholder="Enter room"
                onChange={(e) => updateField("room_number", e.target.value)}
              />
              <InputField
                label="Lift Floor No"
                value={form.lift_floor_number}
                placeholder="Enter lift floor number"
                onChange={(e) =>
                  updateField("lift_floor_number", e.target.value)
                }
              />
            </>
          )}

          {/* SAVE BUTTON */}
          <button
            onClick={() => {
              console.log("🟩 Save Button Pressed");
              handleSave();
            }}
            className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-semibold shadow mt-4"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Component */
const InputField = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <input
      type="text"
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
