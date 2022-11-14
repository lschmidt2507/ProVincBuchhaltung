import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function WeekStatDetailS(props) {
    const location = useLocation();
    const id = localStorage.getItem("week_id")
    const jwt = localStorage.getItem("jwt")

    const[weekData, setWeekData] = useState([]);

    console.log("iD: " +  id)
    localStorage.setItem("week_id", null)
    

    const getWeekData = async () => {
        const response = await axios.post("http://178.254.2.54:5000/api/weekstats/all", {jwt})
        const js = await response.data;
        const js_parsed = js["week_stats"].reverse()          
        return js_parsed
    }

}