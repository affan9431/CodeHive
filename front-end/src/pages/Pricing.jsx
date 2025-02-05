import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { getName } from "../utils/getName";
import { useParams } from "react-router-dom";

const currencyPriceOptions = [
  { currency: "USD", symbol: "$", price: "249.99" },
  { currency: "EUR", symbol: "€", price: "269.99" },
  { currency: "JPY", symbol: "¥", price: "299.99" },
  { currency: "GBP", symbol: "£", price: "319.99" },
  { currency: "AUD", symbol: "A$", price: "349.99" },
  { currency: "CAD", symbol: "C$", price: "399.99" },
  { currency: "CHF", symbol: "CHF", price: "449.99" },
  { currency: "CNY", symbol: "¥", price: "499.99" },
  { currency: "SEK", symbol: "kr", price: "549.99" },
  { currency: "NZD", symbol: "NZ$", price: "599.99" },
  { currency: "TRY", symbol: "₺", price: "649.99" },
  { currency: "INR", symbol: "₹", price: "699.99" },
  // ... add more options as needed
];

function Pricing() {
  const [selected, setSelected] = useState({
    currency: "INR",
    symbol: "₹",
    price: "Select",
  });

  const { decoded } = getName();
  const userId = decoded?.id;
  const { id } = useParams();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("currencyPrice")) || [];

    const matchData = savedData.find(
      (item) => item.userId === userId && item.courseID === id
    );

    if (matchData) {
      setSelected({
        currency: matchData.currency,
        symbol: matchData.symbol,
        price: matchData.price,
      });
    }
  }, [id, userId]);

  const handleSave = () => {
    const currencyData = { ...selected, userId, courseID: id };

    const savedData = JSON.parse(localStorage.getItem("currencyPrice")) || [];

    const updateDataIndex = savedData.findIndex(
      (item) => item.userId === userId && item.courseID === id
    );

    if (updateDataIndex !== -1) {
      savedData[updateDataIndex] = currencyData;
    } else {
      savedData.push(currencyData);
    }

    localStorage.setItem("currencyPrice", JSON.stringify(savedData));
  };

  const handleSelectionChange = (type, value) => {
    // Find the selected currency or price from the options
    const selectedOption = currencyPriceOptions.find(
      (option) =>
        option.currency === value || `${option.symbol}${option.price}` === value
    );
    // Update state with the selected currency/price and its symbol
    if (selectedOption) {
      setSelected((prev) => ({
        ...prev,
        [type]: value,
        symbol: selectedOption.symbol,
        price: selectedOption.price,
      }));
    }
  };

  // Warn the user when they try to reload or leave the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Chrome requires this to show a confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <h1 className="mx-6 my-2 text-2xl font-semibold">Pricing</h1>
      <div className="w-full h-[1px] bg-slate-300"></div>
      <div className="mt-4 mx-4">
        <h1 className="text-[15px] font-bold">Set a price for your course</h1>
        <p>
          Please select the currency and the price tier for your course. If
          you’d like to offer your course for free, it must have a total video
          length of less than 2 hours. Also, courses with practice tests cannot
          be free.
        </p>

        <div className="mt-4 flex gap-5">
          <div>
            <h1 className="text-[15px] font-bold">Currency</h1>
            <DropDownButton
              data={currencyPriceOptions.map((option) => option.currency)}
              name={selected.currency}
              setName={(value) => handleSelectionChange("currency", value)}
            />
          </div>
          <div>
            <h1 className="text-[15px] font-bold">Price Tier</h1>
            <DropDownButton
              data={currencyPriceOptions.map(
                (option) => `${option.symbol}${option.price}`
              )}
              name={`${selected.symbol}${selected.price}`}
              setName={(value) => handleSelectionChange("price", value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            className="bg-[#2D2F31] hover:bg-zinc-800 text-white font-semibold py-1 px-4 transition duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DropDownButton({ data, name, setName }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded w-28"
        onClick={() => setIsOpen(!isOpen)}
      >
        {name}
        <FaChevronDown />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-40 bg-gray-100 rounded-sm shadow-lg mt-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="hover:bg-purple-600 hover:text-white cursor-pointer p-2"
              onClick={() => {
                setName(item);
                setIsOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Pricing;
