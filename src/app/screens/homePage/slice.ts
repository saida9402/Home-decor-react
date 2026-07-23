import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
    popularDishes: [],
    newDishes: [],
    mostLoved: [],
};

const homePageSlice = createSlice({
    name: "homePage",
    initialState,
    reducers: {
        setPopularDishes: (state, action) => {
            state.popularDishes = action.payload;
        },
        setNewDishes: (state, action) => {
            state.newDishes = action.payload;
        },
        setMostLoved: (state, action) => {
            state.mostLoved = action.payload;
        },
    },
});

export const { setPopularDishes, setNewDishes, setMostLoved} =
    homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;    