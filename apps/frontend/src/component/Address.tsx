import { useState } from "react";
import { TextField } from "@mui/material";
import { AddressEntity } from "backend/dist/model/address.entity";

export default function Address() {
  const [address, setAddress] = useState(new AddressEntity());
  return (
    <>
      <h2>Address</h2>
      <form>
        <TextField
          fullWidth
          required
          id="street"
          label="Street"
          name="street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <br />
        <TextField
          fullWidth
          required
          id="city"
          label="City"
          name="city"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <TextField
          fullWidth
          required
          id="postcode"
          label="Postcode"
          name="postcode"
          value={address.postcode}
          onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
        />
        <TextField
          fullWidth
          required
          id="country"
          label="Country"
          name="country"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
      </form>
    </>
  );
}
