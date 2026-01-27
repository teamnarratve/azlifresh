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

  const isFormValid = () => {
    // Basic validation
    if (!form.full_name || !form.ph_number || !form.pin_code || !form.street_location || !form.district) return false;
    if (activeTab === "home" && !form.house_building_number) return false;
    // Add other specific checks if needed
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* MAP SECTION - Full Width Top */}
      <div className="bg-white shadow-sm relative">
        <div
          ref={mapContainerRef}
          className="w-full h-48 bg-gray-200"
        />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm z-10">
          Pin your delivery location
        </div>
        
        {/* Current Location Button - Floating over map */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="absolute bottom-3 right-3 bg-white px-3 py-2 rounded-lg shadow-md text-green-700 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors z-10"
          aria-label="Use current location"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="14"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          Use current location
        </button>
      </div>
      
      {/* ERROR MSG */}
      {mapError && (
        <div className="bg-red-50 px-4 py-2 text-xs text-red-600 text-center">
            {mapError}
        </div>
      )}

      {/* CONTENT CONTAINER */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        
        {/* ADDRESS TYPE SELECTOR */}
        <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Save As</p>
            <div className="flex bg-gray-100 p-1 rounded-xl">
                {tabs.map((t) => (
                <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                    ${
                    activeTab === t.key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    {t.label}
                </button>
                ))}
            </div>
        </div>

        {/* FORM FIELDS */}
        <div className="space-y-4">
             {/* Name & Phone */}
            <div className="space-y-4">
                <InputField
                    label="Full Name"
                    placeholder="Receiver's Name"
                    value={form.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                />
                <InputField
                    label="Phone Number"
                    placeholder="10-digit mobile number"
                    value={form.ph_number}
                    onChange={(e) => updateField("ph_number", e.target.value)}
                    type="tel"
                />
            </div>

            {/* House / Flat Details */}
            <div className="pt-2">
                 {activeTab === "home" ? (
                    <InputField
                    label="House No"
                    placeholder="No. / Flat / Floor"
                    value={form.house_building_number}
                    onChange={(e) =>
                        updateField("house_building_number", e.target.value)
                    }
                    />
                 ) : (
                     <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Apartment"
                            placeholder="Apt Name"
                            value={form.apartment_name}
                            onChange={(e) => updateField("apartment_name", e.target.value)}
                        />
                         <InputField
                            label="Phase/Block"
                            placeholder="Phase 1"
                            value={form.phase}
                            onChange={(e) => updateField("phase", e.target.value)}
                        />
                     </div>
                 )}
                 
                 {/* Extra fields for office/other if needed, keeping simple for now based on user request "House No" */}
                 {activeTab !== "home" && (
                     <div className="grid grid-cols-3 gap-4 mt-4">
                         <InputField
                            label="Block"
                            placeholder="Blk"
                            value={form.block}
                            onChange={(e) => updateField("block", e.target.value)}
                        />
                        <InputField
                            label="Floor"
                            placeholder="Flr"
                            value={form.floor_number}
                            onChange={(e) => updateField("floor_number", e.target.value)}
                        />
                        <InputField
                            label="Room"
                            placeholder="Rm"
                            value={form.room_number}
                            onChange={(e) => updateField("room_number", e.target.value)}
                        />
                     </div>
                 )}
            </div>

            {/* Street & Landmark */}
            <div className="space-y-4">
                <InputField
                    label="Street / Location"
                    placeholder="Street name, Area"
                    value={form.street_location}
                    onChange={(e) => updateField("street_location", e.target.value)}
                />
                <InputField
                    label="Landmark (Optional)"
                    placeholder="Near Apollo Pharmacy"
                    value={form.landmark}
                    onChange={(e) => updateField("landmark", e.target.value)}
                />
            </div>

            {/* Pincode & District */}
            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Pincode"
                    placeholder="560001"
                    value={form.pin_code}
                    onChange={(e) => updateField("pin_code", e.target.value)}
                    type="number"
                />
                <InputField
                    label="District"
                    placeholder="Bangalore"
                    value={form.district}
                    onChange={(e) => updateField("district", e.target.value)}
                />
            </div>
        </div>

      </div>

      {/* STICKY BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-50 safe-area-bottom">
        <div className="max-w-lg mx-auto">
            <button
                onClick={handleSave}
                disabled={!isFormValid()}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
                Save Address
            </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Component - Refined */
const InputField = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1 group-focus-within:text-green-600 transition-colors">
        {label}
    </label>
    <input
      type={type}
      className="w-full bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
