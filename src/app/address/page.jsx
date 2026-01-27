"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiHome,
  FiBriefcase,
  FiUser,
  FiCheck,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import { useAddress } from "@hooks/azli_hooks/useAddress";

const typeMeta = {
  home: {
    icon: FiHome,
    color: "bg-green-500",
  },
  office: {
    icon: FiBriefcase,
    color: "bg-amber-500",
  },
  other: {
    icon: FiUser,
    color: "bg-gray-500",
  },
};

const AddressCard = ({
  data,
  isDefault,
  onSelect,
  onEdit,
  onDelete,
  selecting,
  deleting,
}) => {
  const typeKey = data?.address_type?.toLowerCase() || "other";
  const meta = typeMeta[typeKey] || typeMeta.other;
  const Icon = meta.icon;

  const addressLines = useMemo(() => {
    const lines = [];
    if (data?.full_name) lines.push(data.full_name);

    const streetParts = [
      data?.house_building_number,
      data?.street || data?.street_location,
      data?.district,
      data?.state,
    ]
      .filter(Boolean)
      .join(", ");

    if (streetParts) lines.push(streetParts);
    if (data?.pin_code) lines.push(`pin : ${data.pin_code}`);
    if (data?.landmark) lines.push(data.landmark);

    return lines;
  }, [data]);

  return (
    <div className="px-5 py-5">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSelect}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50"
          aria-label={isDefault ? "Selected address" : "Select this address"}
        >
          <Icon className="h-5 w-5 text-gray-800" />
          <span
            className={`absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-white shadow ${
              isDefault ? meta.color : "bg-gray-200"
            }`}
          >
            {isDefault ? (
              <FiCheck className="h-3 w-3 text-white" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-white" />
            )}
          </span>
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {typeKey}
              </p>
              {addressLines.map((line, idx) => (
                <p key={idx} className="text-sm text-gray-600 leading-5">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {data?.ph_number && (
            <p className="mt-3 text-sm text-gray-800">
              <span className="font-semibold">Phone :</span>{" "}
              <span className="tracking-wide">{data.ph_number}</span>
            </p>
          )}

          <div className="mt-4 flex gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 text-green-600 transition hover:text-green-700"
            >
              <FiEdit2 className="h-4 w-4" />
              EDIT
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-2 text-rose-600 transition hover:text-rose-700 disabled:opacity-60"
              disabled={deleting}
            >
              <FiTrash2 className="h-4 w-4" />
              {deleting ? "DELETING..." : "DELETE"}
            </button>
          </div>

          {selecting && (
            <p className="mt-2 text-xs text-gray-500">Updating default...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AddressSkeleton = () => (
  <div className="px-5 py-5 animate-pulse">
    <div className="flex gap-4">
      <div className="h-11 w-11 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-32 rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

export default function AddressPage() {
  const router = useRouter();
  const {
    addressList,
    defaultAddressId,
    loading,
    handleFetchAddressList,
    handleSelectAddress,
    handleDeleteAddress,
  } = useAddress();

  const [selectingId, setSelectingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    handleFetchAddressList();
  }, []);

  const onSelectAddress = async (id) => {
    setSelectingId(id);
    try {
      await handleSelectAddress(id);
    } finally {
      setSelectingId(null);
    }
  };

  const onDeleteAddress = async (id) => {
    setDeletingId(id);
    try {
      await handleDeleteAddress(id);
    } finally {
      setDeletingId(null);
    }
  };

  const isDefaultAddress = (address) => {
    if (defaultAddressId) {
      return Number(defaultAddressId) === Number(address?.id);
    }
    return address?.selected === 1;
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="mx-auto max-w-screen-md px-4 pb-16 pt-6">


        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Saved Addresses
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {loading && (
              <>
                <AddressSkeleton />
                <AddressSkeleton />
              </>
            )}

            {!loading && addressList?.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-gray-500">
                You have not added any addresses yet.
              </div>
            )}

            {!loading &&
              addressList?.map((item) => (
                <AddressCard
                  key={item.id}
                  data={item}
                  isDefault={isDefaultAddress(item)}
                  selecting={selectingId === item.id}
                  deleting={deletingId === item.id}
                  onSelect={() => onSelectAddress(item.id)}
                  onEdit={() =>
                    router.push(`/add_address?addressId=${item.id}`)
                  }
                  onDelete={() => onDeleteAddress(item.id)}
                />
              ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/add_address")}
          className="mt-8 w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
        >
          Add New Address
        </button>
      </div>
    </div>
  );
}
