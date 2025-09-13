// MandiPrices.jsx placeholder, fill with full code provided earlier
import React from "react";
import "./MandiPrices.css";

const prices = [
  { crop: "Wheat", price: "₹2200/qtl" },
  { crop: "Rice", price: "₹3100/qtl" },
  { crop: "Sugarcane", price: "₹290/qtl" },
  { crop: "Soybean", price: "₹4500/qtl" }
];

const MandiPrices = () => {
  return (
    <section className="mandi card">
      <h3>Mandi Prices</h3>
      <table className="mandi-table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((row, i) => (
            <tr key={i}>
              <td>{row.crop}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default MandiPrices;
