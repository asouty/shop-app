import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { getAuthRequest, putAuthRequest } from "../hook/Request.tsx";
import * as React from "react";

export const ProfileId = "profile";

class PersonEntity {
  id: string | undefined;
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
  lastname: string | undefined;
  addresses: AddressEntity[];
  constructor() {
    this.addresses = [];
  }
}

class AddressEntity {
  id: string | undefined;
  street: string | undefined;
  city: string | undefined;
  postcode: string | undefined;
  country: string | undefined;
  person: PersonEntity | undefined;
}

export default function Profile() {
  const [person, setPerson] = useState(new PersonEntity());
  const [address, setAddress] = useState(new AddressEntity());

  useEffect(() => {
    const fetchData = async () => {
      const savedPerson = await getAuthRequest<PersonEntity>("/api/person");
      setPerson(savedPerson);
      setAddress(
        savedPerson.addresses?.length > 0
          ? savedPerson.addresses[0]
          : new AddressEntity(),
      );
    };
    fetchData().catch(console.error);
  }, []);
  async function savePerson() {
    try {
      await putAuthRequest<PersonEntity>("/api/person", person);
    } catch (e) {
      console.log(e);
    }
  }
  async function saveAddress() {
    try {
      await putAuthRequest<AddressEntity>("/api/address", address);
    } catch (e) {
      console.log(e);
    }
  }

  const onChangePerson = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2>Profil</h2>
      <form>
        <TextField
          required
          id="email"
          label="Email"
          name="email"
          value={person.email}
          onChange={onChangePerson}
        />
        <TextField
          required
          id="password"
          label="Password"
          name="password"
          value={person.password}
          onChange={onChangePerson}
        />
        <TextField
          required
          id="name"
          label="Name"
          name="name"
          value={person.name}
          onChange={onChangePerson}
        />
        <TextField
          required
          id="lastname"
          label="Lastname"
          name="lastname"
          value={person.lastname}
          onChange={onChangePerson}
        />
        <Button onClick={savePerson}>Update</Button>
      </form>
      <h2>Address</h2>
      <form>
        <TextField
          required
          id="street"
          label="Street"
          name="street"
          value={address.street}
          onChange={onChangeAddress}
        />
        <br />
        <TextField
          required
          id="city"
          label="City"
          name="city"
          value={address.city}
          onChange={onChangeAddress}
        />
        <TextField
          required
          id="postcode"
          label="Postcode"
          name="postcode"
          value={address.postcode}
          onChange={onChangeAddress}
        />
        <TextField
          required
          id="country"
          label="Country"
          name="country"
          value={address.country}
          onChange={onChangeAddress}
        />
        <Button onClick={saveAddress}>Update</Button>
      </form>
    </>
  );
}
