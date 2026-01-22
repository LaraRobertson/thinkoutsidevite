import {
    Button,
    Flex,
    Input,
    SwitchField, TableCell,
    TableHead,
    TableRow,
    TextAreaField,
    TextField,
    View,
    Table,
    TableBody
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {MyAuthContext} from "../../MyContext";
import { dataService } from "../../services/dataService";
import type { Schema } from "../../../amplify/data/resource";

type City = Schema["City"]["type"];

interface CityFormState {
    cityName: string;
    cityDescription: string;
    cityState: string;
    cityCountry: string;
    cityMap: string;
    order: number;
    disabled: boolean;
}

export default function CityForm() {
    const { setModalContent, modalContent  } = useContext(MyAuthContext);
    const [cities, setCities] = useState<City[]>([]);
    const [action, setAction] = useState<"add" | "edit">("add");
    const initialStateCreateCity: CityFormState = {
        cityName: "",
        cityDescription: "",
        cityState: "",
        cityCountry: "",
        cityMap: "",
        order: 1,
        disabled: false
    };
    const [formCreateCityState, setFormCreateCityState] = useState<CityFormState>(initialStateCreateCity);
    
    function setInputCreateCity(key: keyof CityFormState, value: string | number | boolean) {
        setFormCreateCityState({ ...formCreateCityState, [key]: value });
    }
    
    useEffect(() => {
      fetchCities();
    },[]);

    async function fetchCities() {
        try {
            const client = dataService.getClient();
            const { data: citiesFromAPI } = await client.models.City.list();
            setCities(citiesFromAPI);
        } catch (err) {
            console.log('error fetching cities', err);
        }
    }
    
    async function populateCityForm(cityID: string) {
        try {
            const client = dataService.getClient();
            const { data: cityFromAPI } = await client.models.City.get({ id: cityID });
            if (cityFromAPI) {
                setFormCreateCityState(cityFromAPI);
                setAction("edit");
            }
        } catch (err) {
            console.log('error fetching getCity', err);
        }
    }

    async function addCity() {
        if (!formCreateCityState.cityName) {
            window.alert("City Name is required");
            return;
        }
        if (!formCreateCityState.cityState) {
            window.alert("State is required");
            return;
        }
        if (!formCreateCityState.cityCountry) {
            window.alert("Country is required");
            return;
        }
        try {
            const gameCity = { ...formCreateCityState };
            const client = dataService.getAuthClient();
            const result = await client.models.City.create(gameCity);
            
            if (result.errors) {
                console.error('Errors creating city:', result.errors);
                window.alert("Error creating city: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateCityState(initialStateCreateCity);
            fetchCities();
            window.alert("City created successfully!");
        } catch (err) {
            console.error('error creating city:', err);
            window.alert("Error creating city: " + err);
        }
    }
    
    async function updateCity() {
        if (!formCreateCityState.cityName) {
            window.alert("City Name is required");
            return;
        }
        try {
            const gameCity = { ...formCreateCityState } as any;
            const client = dataService.getAuthClient();
            const result = await client.models.City.update(gameCity);
            
            if (result.errors) {
                console.error('Errors updating city:', result.errors);
                window.alert("Error updating city: " + JSON.stringify(result.errors));
                return;
            }
            
            setFormCreateCityState(initialStateCreateCity);
            fetchCities();
            setAction("add");
            window.alert("City updated successfully!");
        } catch (err) {
            console.error('error updating GameCity:', err);
            window.alert("Error updating city: " + err);
        }
    }
    
    async function deleteCity(props: { cityID: string }) {
        console.log("props.cityID: " + props.cityID);
        try {
            const client = dataService.getAuthClient();
            await client.models.City.delete({ id: props.cityID });
            fetchCities();
        } catch (err) {
            console.log('error deleting games:', err);
        }
    }

    return (
        <View>
            <Table
                highlightOnHover={true}
                size={"default"}
                variation={"striped"}
            >
               <TableHead>
                    <TableRow>
                        <TableCell as="th">City Name</TableCell>
                        <TableCell as="th">State</TableCell>
                        <TableCell as="th">Description</TableCell>
                        <TableCell as="th">Country</TableCell>
                        <TableCell as="th">Map</TableCell>
                        <TableCell as="th">Order</TableCell>
                        <TableCell as="th">Live</TableCell>
                        <TableCell as="th">Actions</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {cities.map((city, index) => (
                        <TableRow key={city.id}>
                                <TableCell>{city.cityName}</TableCell>
                                <TableCell>{city.cityState}</TableCell>
                                <TableCell>{city.cityDescription}</TableCell>
                                <TableCell>{city.cityCountry}</TableCell>
                                <TableCell>{city.cityMap}</TableCell>
                                <TableCell>{city.order}</TableCell>
                                <TableCell>{city.disabled ? "no" : "yes"}</TableCell>
                                <TableCell>
                                    <Button gap="0.1rem" marginRight="10px" size="small"
                                            onClick={() =>populateCityForm(city.id)}>edit</Button>

                                   <Button gap="0.1rem" size="small" color="red" onClick={() => deleteCity({"cityID": city.id})}>x</Button>
                                </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
<hr />
            <View id="gameClueForm" className="show" as="form" margin=".5rem 0">
                <View><strong>Game City Form</strong></View>
                <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                    <SwitchField
                        label="disabled (not live)"
                        isChecked={formCreateCityState.disabled}
                        onChange={(e) => {
                            console.log("e.target.checked: " + e.target.checked)
                            setInputCreateCity('disabled', e.target.checked);
                        }}
                    />
                    <Input
                        name="order"
                        type="number"
                        size="small"
                        width="50px"
                        onChange={(event) => setInputCreateCity('order', parseInt(event.target.value))}
                        value={formCreateCityState.order.toString()}
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityName', event.target.value)}
                        name="cityName"
                        placeholder="City Name"
                        label="City Name"
                        variation="quiet"
                        value={formCreateCityState.cityName}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityState', event.target.value)}
                        name="cityState"
                        placeholder="State"
                        label="State"
                        variation="quiet"
                        value={formCreateCityState.cityState}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityDescription', event.target.value)}
                        name="cityDescription"
                        placeholder="City Description"
                        label="City Description"
                        variation="quiet"
                        value={formCreateCityState.cityDescription}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityCountry', event.target.value)}
                        name="cityCountry"
                        placeholder="City Country"
                        label="City Country"
                        variation="quiet"
                        value={formCreateCityState.cityCountry}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityMap', event.target.value)}
                        name="cityMap"
                        placeholder="City Map"
                        label="City Map"
                        variation="quiet"
                        value={formCreateCityState.cityMap}
                        required
                    />            </Flex>
                <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                    <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                        {(action == "add") && <Button id="createCity" className="button" onClick={addCity}
                                variation="primary">
                            Create City
                        </Button>}
                        {(action == "edit") && <Button id="updateCity" className="button" onClick={updateCity}
                                variation="primary">
                            Update City
                        </Button>}
                    </Flex>
                </Flex>
            </View>
        </View>
    )
}